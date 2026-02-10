# Migration from /new to Root Path

## Summary

The Next.js application has been migrated from `/new` path to the root path `/`. This simplifies the architecture and makes the site more user-friendly.

## Changes Made

### 1. Next.js Configuration (`next.config.ts`)
- ✅ Removed `basePath: '/new'`
- ✅ Removed `assetPrefix: '/new'`
- ✅ Kept `trailingSlash: true` for consistent routing

### 2. Nginx Configuration (`nginx/8blocks.io.conf`)
- ✅ Removed old static site configuration
- ✅ Changed proxy from `/new/` to `/`
- ✅ Simplified routing - all requests now go directly to Next.js

### 3. Application Files
- ✅ `app/layout.tsx` - Changed favicon from `/new/favicon.ico` to `/favicon.ico`
- ✅ `components/cards/ServiceCard.tsx` - Changed PDF paths from `/new/presentations/` to `/presentations/`
- ✅ `public/robots.txt` - Removed `/new` disallow rules

### 4. Docker & CI/CD
- ✅ `docker-compose.yml` - Updated healthcheck from `/new/` to `/`
- ✅ `.github/workflows/deploy.yml`:
  - Changed `NEXT_PUBLIC_SITE_URL` from `https://8blocks.io/new` to `https://8blocks.io`
  - Updated health check endpoint
  - Updated deployment success message

## Deployment Steps

### On Server

1. **Update nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/8blocks.io
   # Replace with new configuration from nginx/8blocks.io.conf
   
   # Test configuration
   sudo nginx -t
   
   # Reload nginx
   sudo systemctl reload nginx
   ```

2. **Deploy via GitHub Actions:**
   ```bash
   git add .
   git commit -m "Migrate from /new to root path"
   git push origin main
   ```
   
   The GitHub Actions workflow will automatically:
   - Build the new Docker image
   - Deploy to the server
   - Run health checks

3. **Verify deployment:**
   - Visit `https://8blocks.io` (not `/new`)
   - Check that all pages load correctly
   - Test PDF downloads from Services section
   - Test newsletter subscription

### Local Development

1. **Update environment variables:**
   ```bash
   # .env.local
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Access at:** `http://localhost:3000`

## Breaking Changes

### URLs
- **Old:** `https://8blocks.io/new/`
- **New:** `https://8blocks.io/`

### Static Assets
- **Old:** `/new/assets/...`, `/new/fonts/...`, `/new/presentations/...`
- **New:** `/assets/...`, `/fonts/...`, `/presentations/...`

### API Endpoints
- No changes needed - relative paths work the same

## Rollback Plan

If issues occur, rollback by:

1. Revert the nginx configuration:
   ```bash
   git checkout HEAD~1 nginx/8blocks.io.conf
   sudo cp nginx/8blocks.io.conf /etc/nginx/sites-available/8blocks.io
   sudo nginx -t && sudo systemctl reload nginx
   ```

2. Revert Next.js configuration:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Testing Checklist

- [ ] Homepage loads at `https://8blocks.io`
- [ ] All pages accessible (services, cases, blog, etc.)
- [ ] Blog posts and images load correctly
- [ ] PDF downloads work from Services section
- [ ] Newsletter subscription works
- [ ] Contact forms work
- [ ] Images and assets load properly
- [ ] Mobile responsiveness maintained
- [ ] SEO meta tags correct (no `/new` references)

## Notes

- The old `/new` path will return 404 after this migration
- Update any external links or bookmarks to point to the root domain
- Search engines will automatically discover the new URLs via sitemap
- Consider setting up 301 redirects from `/new/*` to `/*` if needed for SEO

## Support

If you encounter any issues after migration:
1. Check nginx error logs: `sudo tail -f /var/log/nginx/8blocks.io.error.log`
2. Check application logs: `docker compose logs -f app`
3. Verify environment variables are correct
4. Test locally first before deploying to production
