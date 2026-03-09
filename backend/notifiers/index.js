const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');

async function sendToAll(text, config, only = null) {
const channels = config.channels || {};
const tasks = [];
const enabled = (name) => only ? only.includes(name) : channels[name]?.enabled;

if (enabled('telegram') && channels.telegram?.botToken && channels.telegram?.chatId)
tasks.push(sendTelegram(text, channels.telegram));
if (enabled('discord') && channels.discord?.webhookUrl)
tasks.push(sendDiscord(text, channels.discord));
if (enabled('slack') && channels.slack?.webhookUrl)
tasks.push(sendSlack(text, channels.slack));
if (enabled('email') && channels.email?.smtp?.host && channels.email?.to)
tasks.push(sendEmail(text, channels.email));

const results = await Promise.allSettled(tasks);
results.forEach((r, i) => {
if (r.status === 'rejected') console.error(`Notifier[${i}] failed:`, r.reason);
});
}

async function sendTelegram(text, cfg) {
const bot = new TelegramBot(cfg.botToken, { polling: false });
await bot.sendMessage(cfg.chatId, text, { parse_mode: 'Markdown' });
}

async function sendDiscord(text, cfg) {
const discordText = text.replace(/\*(.*?)\*/g, '**$1**').replace(/`(.*?)`/g, '`$1`');
await axios.post(cfg.webhookUrl, { content: discordText });
}

async function sendSlack(text, cfg) {
const slackText = text.replace(/\*(.*?)\*/g, '*$1*').replace(/`(.*?)`/g, '`$1`');
await axios.post(cfg.webhookUrl, {
blocks: [{ type: 'section', text: { type: 'mrkdwn', text: slackText } }]
});
}

async function sendEmail(text, cfg) {
const transporter = nodemailer.createTransport({
host: cfg.smtp.host,
port: cfg.smtp.port || 587,
secure: cfg.smtp.port === 465,
auth: { user: cfg.smtp.user, pass: cfg.smtp.pass }
});
const html = text
.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
.replace(/`(.*?)`/g, '<code>$1</code>')
.replace(/\n/g, '<br>');
await transporter.sendMail({
from: cfg.smtp.user,
to: cfg.to,
subject: `📊 DevPulse Report — ${new Date().toLocaleDateString('en-US')}`,
html: `<div style="font-family:monospace;max-width:600px;padding:20px">${html}</div>`
});
}

module.exports = { sendToAll };
