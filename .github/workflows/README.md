# GitHub Actions Workflows

This directory contains automated workflows for the project.

## Available Workflows

### 1. Deploy to Production (`deploy.yml`)

**Trigger:** Push to `main` branch or manual trigger

Automatically deploys the application to production server via SSH.

**Steps:**
1. Connects to server via SSH
2. Pulls latest code from repository
3. Generates `.env` file from GitHub Secrets
4. Starts PostgreSQL container
5. Builds application Docker image
6. Runs database migrations (Prisma)
7. Seeds database (optional)
8. Verifies deployment

**Duration:** ~5-10 minutes

**Required Secrets:** See [GITHUB_ACTIONS_SETUP.md](../GITHUB_ACTIONS_SETUP.md)

### 2. Test (`test.yml`)

**Trigger:** Push to `main` or pull requests

Runs automated tests to ensure code quality.

**Steps:**
1. Sets up Node.js 20 and PostgreSQL
2. Installs dependencies
3. Runs linter (ESLint)
4. Runs unit tests (Jest)
5. Builds application
6. Runs E2E tests (Playwright)
7. Uploads test results if failed

**Duration:** ~3-5 minutes

**No secrets required** - runs in GitHub-hosted runners

## Setup Instructions

See [GITHUB_ACTIONS_SETUP.md](../GITHUB_ACTIONS_SETUP.md) for complete setup guide.

## Monitoring

View workflow runs:
1. Go to **Actions** tab in GitHub repository
2. Select workflow from left sidebar
3. Click on specific run to view details and logs

## Troubleshooting

### Deploy Workflow Fails

Check logs in Actions tab and verify:
- SSH credentials are correct
- Server is accessible
- Project directory exists on server
- All required secrets are configured

### Test Workflow Fails

- Check test logs for specific failures
- Run tests locally: `npm test` and `npm run test:e2e`
- Ensure all tests pass before pushing

## Manual Trigger

To manually trigger the deploy workflow:
1. Go to **Actions** tab
2. Select "Deploy to Production"
3. Click "Run workflow" button
4. Select branch (usually `main`)
5. Click "Run workflow"

## Badge

Add workflow status badge to README:

```markdown
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)
![Test](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test.yml/badge.svg)
```
