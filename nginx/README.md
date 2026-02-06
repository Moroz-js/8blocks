# Nginx Configuration for 8blocks.io

## Quick Apply

Copy the configuration file to the server:

```bash
# On server
cd /var/www/8blocks-nextjs
git pull

# Copy the config
sudo cp nginx/8blocks.io.conf /etc/nginx/sites-available/8blocks.io

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## What Changed

### Previous (incorrect) configuration:
```nginx
location /new/ {
    proxy_pass http://127.0.0.1:3000/;  # ❌ strips /new prefix
}
```

**Problem:** Next.js with `basePath: '/new'` expects requests WITH `/new` prefix, but Nginx was stripping it.

### Current (correct) configuration:
```nginx
location /new/ {
    proxy_pass http://127.0.0.1:3000/new/;  # ✅ keeps /new prefix
}
```

**Solution:** Nginx now keeps the `/new` prefix when proxying to Next.js.

## How it works

```
Browser → https://8blocks.io/new/ru/blog
         ↓
Nginx → proxy_pass http://127.0.0.1:3000/new/ru/blog  (keeps /new)
         ↓
Next.js (basePath: '/new') → handles /new/ru/blog  ✅
```

## Verification

After applying the config:

```bash
# 1. Check Next.js responds with basePath
curl -I http://127.0.0.1:3000/new/

# Should return HTTP 200 or 307 (locale redirect)

# 2. Check through Nginx
curl -I https://localhost/new/ -H "Host: 8blocks.io" -k

# Should also return HTTP 200 or 307

# 3. Open in browser
# https://8blocks.io/new/ - should load with all assets
```
