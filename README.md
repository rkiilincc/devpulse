<div align="center">

<br />

```
██████╗ ███████╗██╗   ██╗██████╗ ██╗   ██╗██╗     ███████╗███████╗
██╔══██╗██╔════╝██║   ██║██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
██║  ██║█████╗  ██║   ██║██████╔╝██║   ██║██║     ███████╗█████╗  
██║  ██║██╔══╝  ╚██╗ ██╔╝██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  
██████╔╝███████╗ ╚████╔╝ ██║     ╚██████╔╝███████╗███████║███████╗
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝
```

**Self-hosted daily SaaS monitoring bot for solo founders.**  
Monitor your Render services & Supabase tables.  
Get reports via Telegram, Discord, Slack, or Email.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-00e5a0.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Stars](https://img.shields.io/github/stars/rkiilincc/devpulse?style=flat-square&color=00e5a0)](https://github.com/rkiilincc/devpulse/stargazers)
[![Issues](https://img.shields.io/github/issues/rkiilincc/devpulse?style=flat-square)](https://github.com/rkiilincc/devpulse/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-00e5a0.svg?style=flat-square)](CONTRIBUTING.md)

<br />

[**Quick Start**](#-quick-start) · [**Features**](#-features) · [**Roadmap**](#-roadmap) · [**Contributing**](#-contributing)

</div>

-----

## What is DevPulse?

DevPulse is a **self-hosted monitoring tool** built for indie hackers and solo founders who use **Render** for hosting and **Supabase** as their database.

Instead of checking dashboards manually every morning, DevPulse sends you a clean daily report directly to your preferred messaging platform — automatically, at the time you choose.

> Built by a solo founder, for solo founders.

-----

## ✨ Features

### 📡 Multi-Channel Notifications

Send reports to **any combination** of:

|Channel   |What you need      |
|----------|-------------------|
|✈️ Telegram|Bot token + Chat ID|
|💬 Discord |Webhook URL        |
|💼 Slack   |Webhook URL        |
|📧 Email   |SMTP credentials   |

### 🚀 Render Monitoring

- Service uptime & response time (ping)
- Deploy history (last 3 deploys with commit messages)
- Service status (live / suspended / failed)
- Multi-service support

### 🗄 Supabase Monitoring

- Auto-discovers all tables in your project
- Per-table row counts
- New records in the last 24 hours
- Recent entries preview
- Storage bucket listing

### ⚙️ Web Dashboard

- Clean dark-mode UI
- Configure everything without touching config files
- Live preview before sending
- Report history log
- Test each notification channel independently

### ⏰ Smart Scheduling

- Set your daily report time (timezone-aware, UTC+3 default)
- Instant manual send anytime

-----

## 📸 Sample Report

```
📊 DevPulse Report
🕐 09:00 - 09.03.2026

🚀 Render Services
🟢 my-api — 142ms
   🌐 api.myapp.com
   ✅ Last deploy: live — "fix: localization keys"

🗄 Supabase Tables
📋 waitlist
   👥 Total: 247 rows
   📈 Last 24h: +12 new

━━━━━━━━━━━━━━━
DevPulse • github.com/rkiilincc/devpulse
```

-----

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PM2 for 24/7 uptime: `npm install -g pm2`

### 1. Clone & Install

```bash
git clone https://github.com/rkiilincc/devpulse.git
cd devpulse/backend
npm install
```

### 2. Start the Backend

```bash
# Development
npm run dev

# Production (with PM2)
cd ..
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

### 3. Open the Dashboard

Open `frontend/index.html` in your browser.

> **With Nginx?** See [Nginx Setup Guide](docs/nginx.md) to serve the dashboard on a domain.

### 4. Configure via UI

1. Go to **Settings** tab
1. Enter your **Render API key** → Fetch Services → select which to monitor
1. Enter your **Supabase URL + Service Role Key** → Fetch Tables → select tables
1. Enable notification channels and enter credentials
1. Set your daily report time
1. Click **Save Settings** → **Test** each channel

That’s it. DevPulse will send your first report at the scheduled time.

-----

## 🗂 Project Structure

```
devpulse/
├── backend/
│   ├── server.js              # Express API + scheduler
│   ├── report.js              # Report builder
│   ├── collectors/
│   │   ├── render.js          # Render API integration
│   │   └── supabase.js        # Supabase integration
│   └── notifiers/
│       └── index.js           # Telegram / Discord / Slack / Email
├── frontend/
│   └── index.html             # Web dashboard (single file)
├── ecosystem.config.js        # PM2 config
└── docs/
    └── nginx.md               # Nginx reverse proxy guide
```

-----

## 🔑 Getting Your Credentials

<details>
<summary><b>Render API Key</b></summary>

1. Go to [render.com](https://render.com) → Account Settings → API Keys
1. Create a new key and copy it

</details>

<details>
<summary><b>Supabase Service Role Key</b></summary>

1. Supabase project → Settings → API
1. Copy the `service_role` key (not the `anon` key)
1. ⚠️ Keep this secret — it has full DB access

</details>

<details>
<summary><b>Telegram Bot Token</b></summary>

1. Open Telegram → search `@BotFather`
1. Send `/newbot` and follow the steps
1. To get your Chat ID: message `@userinfobot`

</details>

<details>
<summary><b>Discord Webhook</b></summary>

1. Channel Settings → Integrations → Webhooks → New Webhook
1. Copy the webhook URL

</details>

-----

## 🗺 Roadmap

- [x] Telegram, Discord, Slack, Email notifications
- [x] Render service monitoring
- [x] Supabase table statistics
- [x] Web dashboard with dark UI
- [x] Report history
- [ ] Uptime alerts (instant, not just daily)
- [ ] Docker image
- [ ] Railway, Fly.io, Vercel integrations
- [ ] Multiple schedules
- [ ] WhatsApp support

Have an idea? [Open an issue](https://github.com/rkiilincc/devpulse/issues/new?template=feature_request.md) 🙌

-----

## 🤝 Contributing

See <CONTRIBUTING.md> for guidelines.

```bash
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse/backend
npm install
npm run dev
```

-----

## 📄 License

MIT — free to use, modify, and distribute. See <LICENSE>.

-----

<div align="center">

**Built in public by [rkiilincc](https://github.com/rkiilincc)**  
If DevPulse saves you time, consider giving it a ⭐

</div>
