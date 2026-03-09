const { createClient } = require('@supabase/supabase-js');

async function collectSupabaseData(config) {
const { supabaseUrl, supabaseKey, supabaseTables = [] } = config;
if (!supabaseUrl || !supabaseKey) return { error: 'Not configured', tables: [] };

const sb = createClient(supabaseUrl, supabaseKey);
const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const tables = [];

for (const tableName of supabaseTables) {
try {
const [totalRes, newRes, recentRes] = await Promise.all([
sb.from(tableName).select('*', { count: 'exact', head: true }),
sb.from(tableName).select('*', { count: 'exact', head: true }).gte('created_at', since24h),
sb.from(tableName).select('*').order('created_at', { ascending: false }).limit(5)
]);

  tables.push({
    name: tableName,
    total: totalRes.count ?? 0,
    newLast24h: newRes.count ?? 0,
    recentRows: recentRes.data || [],
    error: totalRes.error?.message
  });
} catch (e) {
  tables.push({ name: tableName, error: e.message });
}
}

let storage = null;
try {
const { data: buckets } = await sb.storage.listBuckets();
if (buckets) storage = { buckets: buckets.map(b => ({ name: b.name, public: b.public })) };
} catch { }

return { tables, storage, collectedAt: new Date().toISOString() };
}

module.exports = { collectSupabaseData };
