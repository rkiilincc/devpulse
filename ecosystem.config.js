module.exports = {
apps: [{
name: 'devpulse',
script: 'server.js',
cwd: './backend',
watch: false,
restart_delay: 5000,
env: { NODE_ENV: 'production', PORT: 3001 },
error_file: './logs/error.log',
out_file: './logs/out.log'
}]
};
