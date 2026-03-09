const axios = require('axios');

async function collectRenderData(config) {
const { renderApiKey, renderServices = [] } = config;
if (!renderApiKey || renderServices.length === 0) return { error: 'Not configured', services: [] };

const headers = { Authorization: `Bearer ${renderApiKey}` };
const results = [];

for (const serviceId of renderServices) {
try {
const [svcRes, deploysRes] = await Promise.all([
axios.get(`https://api.render.com/v1/services/${serviceId}`, { headers }).catch(() => null),
axios.get(`https://api.render.com/v1/services/${serviceId}/deploys?limit=5`, { headers }).catch(() => null),
]);

  const svc = svcRes?.data;
  const deploys = deploysRes?.data || [];

  let pingMs = null;
  let pingOk = false;
  if (svc?.serviceDetails?.url) {
    try {
      const start = Date.now();
      await axios.get(svc.serviceDetails.url + '/health', { timeout: 8000 });
      pingMs = Date.now() - start;
      pingOk = true;
    } catch {
      try {
        const start = Date.now();
        await axios.get(svc.serviceDetails.url, { timeout: 8000 });
        pingMs = Date.now() - start;
        pingOk = true;
      } catch { pingOk = false; }
    }
  }

  results.push({
    id: serviceId,
    name: svc?.name || serviceId,
    type: svc?.type,
    status: svc?.suspended === 'suspended' ? 'suspended' : (pingOk ? 'up' : 'unknown'),
    url: svc?.serviceDetails?.url,
    pingMs,
    pingOk,
    recentDeploys: deploys.slice(0, 3).map(d => ({
      id: d.deploy?.id,
      status: d.deploy?.status,
      createdAt: d.deploy?.createdAt,
      finishedAt: d.deploy?.finishedAt,
      commitMessage: d.deploy?.commit?.message?.slice(0, 60)
    }))
  });
} catch (e) {
  results.push({ id: serviceId, error: e.message });
}
}

return { services: results, collectedAt: new Date().toISOString() };
}

module.exports = { collectRenderData };
