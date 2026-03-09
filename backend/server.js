require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const { collectRenderData } = require('./collectors/render');
const { collectSupabaseData } = require('./collectors/supabase');
const { buildReport } = require('./report');
const { sendToAll } = require('./notifiers');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({
config: {
renderApiKey: '',
renderServices: [],
supabaseUrl: '',
supabaseKey: '',
supabaseTables: [],
schedule: '09:00',
timezone: 'Europe/Istanbul',
channels: {
telegram: { enabled: false, botToken: '', chatId: '' },
discord: { enabled: false, webhookUrl: '' },
slack: { enabled: false, webhookUrl: '' },
email: { enabled: false, smtp: { host: '', port: 587, user: '', pass: '' }, to: '' }
}
},
reports: []
}).write();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/config', (req, res) => {
const config = db.get('config').value();
const safe = JSON.parse(JSON.stringify(config));
if (safe.supabaseKey) safe.supabaseKey = safe.supabaseKey.slice(0, 8) + '…';
if (safe.channels?.telegram?.botToken) safe.channels.telegram.botToken = '***';
if (safe.channels?.email?.smtp?.pass) safe.channels.email.smtp.pass = '***';
res.json(safe);
});

app.get('/api/config/raw', (req, res) => {
res.json(db.get('config').value());
});

app.post('/api/config', (req, res) => {
const current = db.get('config').value();
const updated = deepMerge(current, req.body);
db.set('config', updated).write();
reschedule();
res.json({ ok: true });
});

app.get('/api/render/services', async (req, res) => {
const config = db.get('config').value();
if (!config.renderApiKey) return res.status(400).json({ error: 'No Render API key' });
try {
const axios = require('axios');
const r = await axios.get('https://api.render.com/v1/services?limit=20', {
headers: { Authorization: `Bearer ${config.renderApiKey}` }
});
const services = r.data.map(s => ({
id: s.service?.id || s.id,
name: s.service?.name || s.name,
type: s.service?.type || s.type
}));
res.json(services);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.get('/api/supabase/tables', async (req, res) => {
const config = db.get('config').value();
if (!config.supabaseUrl || !config.supabaseKey) return res.status(400).json({ error: 'No Supabase credentials' });
try {
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(config.supabaseUrl, config.supabaseKey);
const { data, error } = await sb.rpc('devpulse_list_tables').catch(() => ({ data: null, error: true }));
if (!error && data) return res.json(data);
return res.json([]);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post('/api/report/send', async (req, res) => {
try {
await runReport();
res.json({ ok: true });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.post('/api/report/preview', async (req, res) => {
try {
const config = db.get('config').value();
const renderData = await collectRenderData(config);
const supabaseData = await collectSupabaseData(config);
const report = buildReport(renderData, supabaseData, config);
res.json({ report, renderData, supabaseData });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

app.get('/api/reports', (req, res) => {
const reports = db.get('reports').value().slice(-20).reverse();
res.json(reports);
});

app.post('/api/test/:channel', async (req, res) => {
const { channel } = req.params;
const config = db.get('config').value();
try {
await sendToAll(`🧪 *DevPulse Test*\n✅ ${channel} connected successfully!`, config, [channel]);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ error: e.message });
}
});

async function runReport() {
const config = db.get('config').value();
const renderData = await collectRenderData(config);
const supabaseData = await collectSupabaseData(config);
const report = buildReport(renderData, supabaseData, config);
await sendToAll(report.text, config);
db.get('reports').push({
id: uuidv4(),
timestamp: new Date().toISOString(),
renderData,
supabaseData,
sentTo: Object.keys(config.channels).filter(k => config.channels[k].enabled)
}).write();
const all = db.get('reports').value();
if (all.length > 50) db.set('reports', all.slice(-50)).write();
}

let scheduledJob = null;
function reschedule() {
if (scheduledJob) { scheduledJob.stop(); scheduledJob = null; }
const config = db.get('config').value();
if (!config.schedule) return;
const [h, m] = config.schedule.split(':');
const utcH = (parseInt(h) - 3 + 24) % 24;
const expr = `${m || '0'} ${utcH} * * *`;
scheduledJob = cron.schedule(expr, () => runReport().catch(console.error));
console.log(`⏰ Scheduled: ${config.schedule} TR (cron: ${expr})`);
}
reschedule();

function deepMerge(target, source) {
const result = { ...target };
for (const key of Object.keys(source)) {
if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
result[key] = deepMerge(target[key] || {}, source[key]);
} else {
result[key] = source[key];
}
}
return result;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 DevPulse backend: http://localhost:${PORT}`));
