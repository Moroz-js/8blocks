# GitHub Actions Setup Guide

This guide explains how to configure GitHub Actions for automated deployment and testing.

## Overview

The project includes two workflows:
1. **Deploy** (`deploy.yml`) - Automatic deployment to production on push to `main`
2. **Test** (`test.yml`) - Run tests on pull requests and pushes

## Required GitHub Secrets

Navigate to your repository: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### SSH Connection Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_HOST` | Server IP address or domain | `123.45.67.89` |
| `SSH_USER` | SSH username (usually `root`) | `root` |
| `SSH_KEY` | Private SSH key for authentication | *Generate with `ssh-keygen`* |
| `SSH_PORT` | SSH port (default: 22) | `22` |

#### Generating SSH Key

On your **local machine**:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions@yourdomain.com" -f ~/.ssh/github_actions

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions.pub root@your-server-ip

# Display private key (this goes to GitHub Secrets)
cat ~/.ssh/github_actions
```

**Add the entire private key** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) to the `SSH_KEY` secret.

### Project Configuration Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PROJECT_NAME` | Project directory name on server | `8blocks-nextjs` |
| `DOMAIN` | Your domain name (without https://) | `8blocks.io` |

### Database Secrets

| Secret Name | Description | Recommendation |
|-------------|-------------|----------------|
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | Generate strong password (20+ chars) |
| `POSTGRES_DB` | Database name | `8blocks` |

**Generate secure password:**
```bash
openssl rand -base64 32
```

### Email (SMTP) Secrets

Configure these to enable contact form and email notifications.

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (usually 587 or 465) | `587` |
| `SMTP_USER` | SMTP username (email) | `noreply@yourdomain.com` |
| `SMTP_PASSWORD` | SMTP password or app password | *Your SMTP password* |
| `SMTP_FROM` | From email address | `"8Blocks" <noreply@yourdomain.com>` |

#### SMTP Providers

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587`
- Requires [App Password](https://support.google.com/accounts/answer/185833)

**SendGrid:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Password: Your SendGrid API key

**Mailgun:**
- Host: `smtp.mailgun.org`
- Port: `587`
- User/Password: From Mailgun dashboard

**AWS SES:**
- Host: `email-smtp.us-east-1.amazonaws.com` (depends on region)
- Port: `587`
- User/Password: From AWS SES SMTP credentials

### Admin Secrets

| Secret Name | Description | Recommendation |
|-------------|-------------|----------------|
| `ADMIN_USERNAME` | Admin panel username | Choose a username (not "admin") |
| `ADMIN_PASSWORD` | Admin panel password | Generate strong password (20+ chars) |

### Analytics Secrets (Optional)

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GOOGLE_ANALYTICS_ID` | Google Analytics Measurement ID | `G-XXXXXXXXXX` |

Leave empty if not using Google Analytics.

## Complete Secrets Checklist

Copy this checklist and fill in your values:

```
SSH & Server:
- [ ] SSH_HOST = _______________
- [ ] SSH_USER = root
- [ ] SSH_KEY = (private key content)
- [ ] SSH_PORT = 22

Project:
- [ ] PROJECT_NAME = 8blocks-nextjs
- [ ] DOMAIN = 8blocks.io

Database:
- [ ] POSTGRES_USER = postgres
- [ ] POSTGRES_PASSWORD = _______________
- [ ] POSTGRES_DB = 8blocks

Email (SMTP):
- [ ] SMTP_HOST = _______________
- [ ] SMTP_PORT = 587
- [ ] SMTP_USER = _______________
- [ ] SMTP_PASSWORD = _______________
- [ ] SMTP_FROM = _______________

Admin:
- [ ] ADMIN_USERNAME = _______________
- [ ] ADMIN_PASSWORD = _______________

Analytics (optional):
- [ ] GOOGLE_ANALYTICS_ID = _______________
```

## Deployment Workflow

### Automatic Deployment

Every push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will:
1. Connect to your server via SSH
2. Pull latest code
3. Generate `.env` from secrets
4. Build Docker images
5. Start containers
6. Run database migrations
7. Deploy the application

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

### Monitoring Deployment

1. Go to **Actions** tab
2. Click on the latest workflow run
3. View logs in real-time

## Testing Workflow

The test workflow runs automatically on:
- Every push to `main`
- Every pull request to `main`

It performs:
- Linting (ESLint)
- Unit tests (Jest)
- Build verification
- E2E tests (Playwright)

## Troubleshooting

### Deployment Fails: SSH Connection

**Error:** `Failed to connect to SSH server`

**Solution:**
1. Verify `SSH_HOST`, `SSH_USER`, `SSH_PORT` are correct
2. Ensure SSH key is correctly added to server:
   ```bash
   cat ~/.ssh/authorized_keys  # on server
   ```
3. Test SSH connection manually:
   ```bash
   ssh -i ~/.ssh/github_actions root@your-server-ip
   ```

### Deployment Fails: Permission Denied

**Error:** `Permission denied (publickey)`

**Solution:**
- Ensure the SSH private key in `SSH_KEY` secret includes header/footer:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  ... key content ...
  -----END OPENSSH PRIVATE KEY-----
  ```
- Check key has correct permissions on server

### Deployment Fails: Project Directory Not Found

**Error:** `cd: /var/www/8blocks: No such file or directory`

**Solution:**
Run server setup script first:
```bash
sudo bash scripts/server-setup.sh
```

### Database Migration Fails

**Error:** `Prisma db push failed`

**Solution:**
1. Check database credentials in secrets
2. SSH into server and check logs:
   ```bash
   cd /var/www/8blocks
   docker compose logs postgres
   docker compose logs app
   ```

### SMTP Errors

**Error:** `SMTP connection failed`

**Solution:**
1. Verify SMTP credentials are correct
2. For Gmail, ensure you're using an [App Password](https://support.google.com/accounts/answer/185833)
3. Check if your provider requires additional security settings
4. Test SMTP connection manually on server

### Build Timeout

**Error:** `The job running on runner ... has exceeded the maximum execution time`

**Solution:**
Increase timeout in `.github/workflows/deploy.yml`:
```yaml
jobs:
  deploy:
    timeout-minutes: 20  # increase from 15
```

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use strong passwords** (20+ characters, random)
3. **Rotate secrets regularly** (every 3-6 months)
4. **Use SSH keys** instead of passwords
5. **Limit SSH access** to GitHub Actions IP ranges (optional)
6. **Enable 2FA** on GitHub account
7. **Review workflow logs** regularly for suspicious activity
8. **Use environment-specific secrets** for staging/production

## Advanced Configuration

### Deploy to Staging

Create a separate workflow for staging:

1. Duplicate `deploy.yml` → `deploy-staging.yml`
2. Change branch to `develop`:
   ```yaml
   on:
     push:
       branches:
         - develop
   ```
3. Use different secrets (e.g., `SSH_HOST_STAGING`)

### Slack/Discord Notifications

Add notification step:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Deploy on Tag

Deploy only on version tags:

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action Documentation](https://github.com/appleboy/ssh-action)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
