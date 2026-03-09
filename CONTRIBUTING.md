
# Contributing to DevPulse

Thanks for your interest! DevPulse is built in public and welcomes contributions.

## Ways to Contribute

- 🐛 **Bug reports** — open an issue
- 💡 **Feature requests** — open an issue with `enhancement` label
- 🔧 **Code** — fix bugs, add features
- 🌍 **Integrations** — add new platforms (WhatsApp, Pushover, etc.)

## Development Setup

```bash
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse/backend
npm install
npm run dev
```

## Adding a New Notification Channel

1. Create `backend/notifiers/yourplatform.js`
1. Export a `send(text, config)` function
1. Register it in `backend/notifiers/index.js`
1. Add the UI section in `frontend/index.html`
1. Update the README

## Questions?

Open a [GitHub Discussion](https://github.com/rkiilincc/devpulse/discussions).
