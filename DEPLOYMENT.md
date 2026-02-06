# Deployment Guide

## Prerequisites

- Ubuntu 22.04/24.04 or Debian 11/12 server
- Root access
- Domain name with DNS A records pointing to the server (8blocks.io)
- GitHub repository with the code
- Nginx already configured to proxy `/new` path to port 3000

## Step 1: Prepare the Server

1. SSH into your server:
```bash
ssh root@your-server-ip
```

2. Download and run the server setup script:
```bash
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/server-setup.sh
chmod +x server-setup.sh
sudo bash server-setup.sh
```

3. Follow the prompts:
   - Git repo URL: Your GitHub repository HTTPS URL

The script will:
- Install Docker and Git
- Clone your repository to `/var/www/8blocks-nextjs`
- Note: Nginx and SSL configuration should be done manually (see below)

## Step 2: Configure Nginx for /new Path

If not already configured, create/update Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/8blocks.io
```

Add location blocks for `/new` path:

```nginx
# Next.js app on /new path
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
}

location /new/_next/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_bypass $http_upgrade;
}

location /new/api/ {
    proxy_pass http://127.0.0.1:3000;
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 3: Configure Environment Variables

After the script completes, create the `.env` file:

```bash
cd /var/www/8blocks-nextjs
nano .env
```

Copy contents from `.env.production.example` and fill in actual values:

```env
DATABASE_URL="postgresql://postgres:secure_password@postgres:5432/8blocks?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=8blocks
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
NEXT_PUBLIC_SITE_URL=https://8blocks.io/new
UPLOAD_DIR=public/uploads
```

## Step 4: Start the Application

```bash
cd /var/www/8blocks-nextjs
docker compose up -d --build
```

## Step 5: Run Database Migrations

```bash
# Generate Prisma client
docker compose exec app npx prisma generate

# Push database schema
docker compose exec app npx prisma db push

# Seed initial data (optional)
docker compose exec app npm run db:seed
```

## Step 6: Verify Deployment

1. Check if containers are running:
```bash
docker compose ps
```

2. Check application logs:
```bash
docker compose logs -f app
```

3. Check if the app is accessible locally:
```bash
curl -I http://127.0.0.1:3000/new
```

4. Check if the domain is accessible:
```bash
curl -I https://8blocks.io/new
```

## Useful Commands

### View logs
```bash
cd /var/www/8blocks-nextjs
docker compose logs -f app        # Application logs
docker compose logs -f postgres   # Database logs
```

### Restart services
```bash
docker compose restart app
docker compose restart postgres
```

### Stop all services
```bash
docker compose down
```

### Rebuild and restart
```bash
docker compose up -d --build
```

### Access database
```bash
docker compose exec postgres psql -U postgres -d 8blocks
```

### Run Prisma Studio (development)
```bash
docker compose exec app npx prisma studio
# Then access via SSH tunnel: ssh -L 5555:localhost:5555 root@your-server-ip
```

### Update application
```bash
cd /var/www/8blocks-nextjs
git pull
docker compose up -d --build
```

## GitHub Actions Automated Deployment

The project includes automated deployment via GitHub Actions. See detailed setup guide in [`.github/GITHUB_ACTIONS_SETUP.md`](./.github/GITHUB_ACTIONS_SETUP.md).

### Quick Setup

1. **Run server setup script** (one-time):
   ```bash
   sudo bash scripts/server-setup.sh
   ```

2. **Configure Nginx manually** to proxy `/new` path to port 3000 (see Step 2 above)

3. **Configure GitHub Secrets** (in repository Settings → Secrets):
   - `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_PORT`
   - `PROJECT_NAME` = `8blocks-nextjs`
   - `DOMAIN` = `8blocks.io`
   - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `GOOGLE_ANALYTICS_ID` (optional)

4. **Deploy automatically**:
   ```bash
   git push origin main
   ```

The workflow will:
- Connect via SSH
- Pull latest code from `/var/www/8blocks-nextjs`
- Generate `.env` from secrets (with NEXT_PUBLIC_SITE_URL=https://8blocks.io/new)
- Build and start Docker containers
- Run migrations and seed

See complete guide: [`.github/GITHUB_ACTIONS_SETUP.md`](./.github/GITHUB_ACTIONS_SETUP.md)

## Troubleshooting

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000
# Or check Docker containers
docker ps -a
```

### Database connection issues
```bash
cd /var/www/8blocks-nextjs
# Check if PostgreSQL is running
docker compose ps postgres
# Check PostgreSQL logs
docker compose logs postgres
# Verify DATABASE_URL in .env matches the service name and credentials
```

### SSL certificate issues
```bash
# Check Nginx configuration
sudo nginx -t
# Renew certificate manually
sudo certbot renew
# Check certificate status
sudo certbot certificates
```

### Application not starting
```bash
cd /var/www/8blocks-nextjs
# Check application logs
docker compose logs app
# Check if .env file exists and is correct
cat .env
# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### /new path not working
```bash
# Check Nginx configuration
sudo nginx -t
cat /etc/nginx/sites-available/8blocks.io
# Check if app is running
curl -I http://127.0.0.1:3000/new
# Reload Nginx
sudo systemctl reload nginx
```

## Security Recommendations

1. **Change default passwords** in `.env`
2. **Enable automatic security updates**:
   ```bash
   apt install unattended-upgrades
   dpkg-reconfigure -plow unattended-upgrades
   ```
3. **Set up SSH key authentication** and disable password login
4. **Configure fail2ban** to prevent brute-force attacks
5. **Regular backups** of database:
   ```bash
   docker compose exec postgres pg_dump -U postgres 8blocks > backup_$(date +%Y%m%d).sql
   ```
6. **Monitor logs** regularly
7. **Keep Docker images updated**:
   ```bash
   docker compose pull
   docker compose up -d
   ```

## Backup Strategy

### Database Backup
```bash
cd /var/www/8blocks-nextjs
# Manual backup
docker compose exec postgres pg_dump -U postgres 8blocks > backup.sql

# Restore backup
cat backup.sql | docker compose exec -T postgres psql -U postgres 8blocks
```

### Automated Daily Backups
Add to crontab:
```bash
crontab -e
```

Add line:
```
0 2 * * * cd /var/www/8blocks-nextjs && docker compose exec -T postgres pg_dump -U postgres 8blocks > /root/backups/8blocks_$(date +\%Y\%m\%d).sql
```

## Monitoring

Consider setting up monitoring with:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Server monitoring**: Netdata, Prometheus + Grafana
