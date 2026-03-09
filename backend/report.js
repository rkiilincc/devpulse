function buildReport(renderData, supabaseData, config) {
const now = new Date().toLocaleString('tr-TR', { timeZone: config.timezone || 'Europe/Istanbul' });
let text = `📊 *DevPulse Report*\n🕐 ${now}\n\n`;

if (renderData?.services?.length > 0) {
text += `*🚀 Render Services*\n`;
for (const svc of renderData.services) {
if (svc.error) { text += `• ❌ ${svc.id}: ${svc.error}\n`; continue; }
const statusIcon = svc.pingOk ? '🟢' : (svc.status === 'suspended' ? '⏸' : '🔴');
text += `${statusIcon} *${svc.name}*`;
if (svc.pingMs) text += ` — ${svc.pingMs}ms`;
text += `\n`;
if (svc.url) text += `   🌐 \`${svc.url}\`\n`;
if (svc.recentDeploys?.length > 0) {
const last = svc.recentDeploys[0];
const deployIcon = last.status === 'live' ? '✅' : last.status === 'failed' ? '❌' : '⏳';
text += `   ${deployIcon} Last deploy: ${last.status}`;
if (last.commitMessage) text += ` — "${last.commitMessage}"`;
text += `\n`;
}
}
text += `\n`;
}

if (supabaseData?.tables?.length > 0) {
text += `*🗄 Supabase Tables*\n`;
for (const t of supabaseData.tables) {
if (t.error) { text += `• ❌ ${t.name}: ${t.error}\n`; continue; }
text += `📋 *${t.name}*\n`;
text += `   👥 Total: *${t.total}* rows\n`;
text += `   📈 Last 24h: *+${t.newLast24h}* new\n`;
if (t.recentRows?.length > 0) {
const emailField = t.recentRows[0].email ? 'email' : Object.keys(t.recentRows[0])[0];
const preview = t.recentRows.slice(0, 3).map(r => `\`${String(r[emailField]).slice(0, 30)}\``).join(', ');
text += `   🕐 Recent: ${preview}\n`;
}
}
if (supabaseData.storage?.buckets?.length > 0) {
text += `\n🪣 Storage: ${supabaseData.storage.buckets.map(b => b.name).join(', ')}\n`;
}
text += `\n`;
}

text += `━━━━━━━━━━━━━━━\n_DevPulse • github.com/rkiilincc/devpulse_`;
return { text };
}

module.exports = { buildReport };
