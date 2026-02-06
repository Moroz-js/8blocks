# Nginx Configuration for /new BasePath

This guide explains how to configure Nginx to serve the Next.js app on the `/new` path while keeping the old static site on the root path.

## Architecture Overview

```
https://8blocks.io/          → Static site from /var/www/8blocks.io
https://8blocks.io/new       → Next.js app on http://127.0.0.1:3000 (Docker)
```

## Prerequisites

- Nginx installed and running
- SSL certificate already configured for 8blocks.io
- Next.js app configured with `basePath: '/new'` in `next.config.ts`

## Complete Nginx Configuration

Edit the Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/8blocks.io
```

Replace with this configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name 8blocks.io www.8blocks.io;

    server_tokens off;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/8blocks.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/8blocks.io/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Increase upload limit
    client_max_body_size 50M;

    # Proxy settings for Next.js
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Next.js app on /new path
    location /new {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
    }

    # Next.js static files (_next directory)
    location /new/_next/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js API routes
    location /new/api/ {
        proxy_pass http://127.0.0.1:3000;
    }

    # Next.js images
    location /new/_next/image {
        proxy_pass http://127.0.0.1:3000;
    }

    # Next.js public assets
    location /new/assets/ {
        proxy_pass http://127.0.0.1:3000;
    }

    # Old static site for root path
    location / {
        root /var/www/8blocks.io;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_disable "MSIE [1-6]\.";
}

server {
    listen 80;
    server_name 8blocks.io www.8blocks.io;
    return 301 https://$host$request_uri;
}
```

## Test and Reload Nginx

```bash
# Test configuration for syntax errors
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

## Verify Configuration

1. **Check if Docker app is running:**
```bash
cd /var/www/8blocks-nextjs
docker compose ps
```

2. **Test local access:**
```bash
curl -I http://127.0.0.1:3000/new
```

3. **Test through Nginx:**
```bash
curl -I https://8blocks.io/new
```

4. **Check old site still works:**
```bash
curl -I https://8blocks.io/
```

## Troubleshooting

### 502 Bad Gateway

**Problem:** Nginx shows 502 error when accessing `/new`

**Solution:**
```bash
# Check if Docker app is running
cd /var/www/8blocks-nextjs
docker compose ps

# Check app logs
docker compose logs -f app

# Restart app if needed
docker compose restart app
```

### 404 Not Found on /new

**Problem:** Nginx returns 404 for `/new` path

**Causes:**
1. Next.js app not configured with `basePath: '/new'`
2. App is running but not responding

**Solution:**
```bash
# Verify basePath in next.config.ts
cat /var/www/8blocks-nextjs/next.config.ts | grep basePath

# Should show: basePath: '/new',

# Rebuild app if needed
cd /var/www/8blocks-nextjs
docker compose down
docker compose up -d --build
```

### Static Assets Not Loading

**Problem:** CSS/JS files return 404

**Solution:** Make sure these location blocks are present:
```nginx
location /new/_next/ {
    proxy_pass http://127.0.0.1:3000;
}

location /new/assets/ {
    proxy_pass http://127.0.0.1:3000;
}
```

### Images Not Loading

**Problem:** Next.js Image component not working

**Solution:** Add image optimization proxy:
```nginx
location /new/_next/image {
    proxy_pass http://127.0.0.1:3000;
}
```

## Migration Strategy

When you're ready to replace the old site with the new Next.js app:

1. **Backup old site:**
```bash
sudo cp -r /var/www/8blocks.io /var/www/8blocks.io.backup
```

2. **Update next.config.ts** - Remove `basePath: '/new'`

3. **Update Nginx config** - Change root location to proxy:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    # ... other proxy settings
}
```

4. **Update environment variables:**
```bash
# Change NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_URL=https://8blocks.io
```

5. **Rebuild and deploy:**
```bash
cd /var/www/8blocks-nextjs
docker compose down
docker compose up -d --build
```

6. **Test and reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Useful Commands

```bash
# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx without downtime
sudo systemctl reload nginx

# Restart Nginx (with brief downtime)
sudo systemctl restart nginx

# Test configuration before applying
sudo nginx -t
```

## Security Recommendations

1. **Rate limiting** for API routes:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /new/api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://127.0.0.1:3000;
}
```

2. **Hide server version:**
```nginx
server_tokens off;
```

3. **Add security headers:**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

## Additional Resources

- [Next.js basePath Documentation](https://nextjs.org/docs/api-reference/next.config.js/basepath)
- [Nginx Proxy Configuration](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Let's Encrypt SSL Configuration](https://letsencrypt.org/docs/)
