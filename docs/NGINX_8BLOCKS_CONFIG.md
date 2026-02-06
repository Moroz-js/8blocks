# Nginx Configuration for 8blocks.io with /new path

## Complete Working Configuration

Create/update the Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/8blocks.io
```

Replace with this **complete** configuration:

```nginx
# Redirect www to non-www
server {
    listen 443 ssl http2;
    server_name www.8blocks.io;

    ssl_certificate /etc/letsencrypt/live/8blocks.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/8blocks.io/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://8blocks.io$request_uri;
}

# Main server block
server {
    listen 443 ssl http2;
    server_name 8blocks.io;

    server_tokens off;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/8blocks.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/8blocks.io/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Increase upload limit
    client_max_body_size 50M;

    # Logging
    access_log /var/log/nginx/8blocks.io.access.log;
    error_log /var/log/nginx/8blocks.io.error.log;

    # ==============================================
    # Next.js app on /new path
    # ==============================================
    
    # Main /new location
    location /new {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files (_next directory)
    location /new/_next/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache static assets
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js API routes
    location /new/api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # No caching for API
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Next.js image optimization
    location /new/_next/image {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Next.js uploaded assets
    location /new/assets/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Next.js uploads folder
    location /new/uploads/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # ==============================================
    # Old static site for root path
    # ==============================================
    
    location / {
        root /var/www/8blocks.io;
        index index.html;
        try_files $uri $uri/ =404;
        
        # Cache static files
        add_header Cache-Control "public, max-age=3600";
    }

    # Static site assets
    location ~* \.(jpg|jpeg|png|gif|ico|svg|css|js|woff|woff2|ttf)$ {
        root /var/www/8blocks.io;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    gzip_disable "MSIE [1-6]\.";
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name 8blocks.io www.8blocks.io;
    return 301 https://8blocks.io$request_uri;
}
```

## Apply Configuration

```bash
# Test configuration
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx

# Check for errors
sudo tail -f /var/log/nginx/8blocks.io.error.log
```

## Verify It Works

```bash
# 1. Check if Docker app is running
cd /var/www/8blocks-nextjs
docker compose ps

# 2. Check app logs
docker compose logs --tail=50 app

# 3. Test app directly
curl -I http://127.0.0.1:3000/new

# 4. Test through Nginx
curl -I https://8blocks.io/new

# 5. Check old site still works
curl -I https://8blocks.io/
```

## Common Issues

### 404 Not Found on /new

**Check if app is running:**
```bash
docker compose ps
docker compose logs app
```

**Check if app responds locally:**
```bash
curl http://127.0.0.1:3000/new
```

### 502 Bad Gateway

**App is not running or crashed:**
```bash
docker compose restart app
docker compose logs -f app
```

### Old site not working

**Check static files:**
```bash
ls -la /var/www/8blocks.io/
```

## Emergency Rollback

If something goes wrong, restore old config:

```bash
# Backup current config
sudo cp /etc/nginx/sites-available/8blocks.io /etc/nginx/sites-available/8blocks.io.backup

# Restore from example above or previous backup
```
