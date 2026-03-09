
# Nginx Setup Guide

## Basic Config

```nginx
server {
    listen 80;
    server_name devpulse.yourdomain.com;

    location / {
        root /opt/devpulse/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## With SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d devpulse.yourdomain.com
```

## Reload

```bash
sudo nginx -t && sudo systemctl reload nginx
```
