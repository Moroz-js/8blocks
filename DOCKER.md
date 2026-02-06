# Docker Development Guide

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd eightblocks
cp .env.local.example .env
```

### 2. Start Services
```bash
# Start only database (for local development)
docker compose up -d postgres

# Or start all services (database + app in Docker)
docker compose up -d --build
```

### 3. Run Migrations
```bash
# If running app locally (not in Docker)
npm install
npx prisma generate
npx prisma db push
npm run db:seed  # Optional: seed initial data

# If running app in Docker
docker compose exec app npx prisma generate
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed  # Optional
```

### 4. Development

**Option A: Local Development (Database in Docker)**
```bash
# Start only database
docker compose up -d postgres

# Run app locally
npm run dev
```
Access: http://localhost:3000

**Option B: Full Docker Development**
```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f app
```
Access: http://localhost:3000

## Docker Commands Cheat Sheet

### Container Management
```bash
# Start services
docker compose up -d

# Start with rebuild
docker compose up -d --build

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# Restart specific service
docker compose restart app
docker compose restart postgres

# View running containers
docker compose ps
```

### Logs
```bash
# View all logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# View specific service logs
docker compose logs app
docker compose logs postgres

# Last 100 lines
docker compose logs --tail=100 app
```

### Database Operations
```bash
# Access PostgreSQL shell
docker compose exec postgres psql -U postgres -d 8blocks

# Run Prisma commands inside container
docker compose exec app npx prisma studio
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate dev

# Backup database
docker compose exec postgres pg_dump -U postgres 8blocks > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U postgres 8blocks
```

### Execute Commands in Containers
```bash
# Run npm commands in app container
docker compose exec app npm run build
docker compose exec app npm test

# Access app container shell
docker compose exec app sh

# Access postgres container shell
docker compose exec postgres sh
```

### Clean Up
```bash
# Remove stopped containers
docker compose rm

# Remove unused images
docker image prune

# Remove everything (⚠️ use with caution)
docker system prune -a --volumes
```

## Dockerfile Explanation

The project uses a **multi-stage build** for optimization:

### Stage 1: Dependencies
- Base: `node:20-alpine`
- Installs only production dependencies
- Uses npm ci for faster, more reliable installs

### Stage 2: Builder
- Copies dependencies from stage 1
- Generates Prisma client
- Builds Next.js application
- Creates optimized production build

### Stage 3: Runner (Production)
- Minimal runtime image
- Copies only necessary files
- Runs as non-root user (`nextjs`)
- Exposes port 3000
- Uses Next.js standalone output for smaller image

## Docker Compose Services

### postgres
- **Image**: postgres:16-alpine
- **Port**: 5432 (mapped to host 5432)
- **Data**: Persisted in `postgres_data` volume
- **Health check**: Automatic health monitoring

### app
- **Build**: From local Dockerfile
- **Port**: 3000 (mapped to host 3000)
- **Depends on**: postgres (waits for health check)
- **Volumes**: `uploads` for user-uploaded files
- **Environment**: Loaded from `.env` file

## Environment Variables

### Development (.env.local)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/8blocks?schema=public"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_SITE_URL=http://localhost:3000
UPLOAD_DIR=public/uploads
```

### Production (.env)
```env
DATABASE_URL="postgresql://postgres:secure_pass@postgres:5432/8blocks?schema=public"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
UPLOAD_DIR=public/uploads
```

**Note**: In production, use `postgres` as hostname (Docker service name), not `localhost`.

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Linux/Mac
lsof -i :3000
lsof -i :5432

# Stop the service or change port in docker-compose.yml
```

### Database connection refused
```bash
# Check if postgres is running
docker compose ps postgres

# Check postgres logs
docker compose logs postgres

# Verify DATABASE_URL in .env
# Local dev: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/8blocks?schema=public"
# Docker: DATABASE_URL="postgresql://postgres:postgres@postgres:5432/8blocks?schema=public"
```

### App not starting
```bash
# View detailed logs
docker compose logs app

# Check if build succeeded
docker compose build app

# Try rebuilding from scratch
docker compose down
docker compose up -d --build
```

### Changes not reflected
```bash
# Rebuild app container
docker compose up -d --build app

# Or force rebuild
docker compose build --no-cache app
docker compose up -d app
```

### Database data lost after restart
If using `docker compose down -v`, the `-v` flag removes volumes including database data.

**Solution**: Use `docker compose down` (without `-v`) or backup before removing volumes.

### Prisma errors
```bash
# Regenerate Prisma client
docker compose exec app npx prisma generate

# Reset database (⚠️ deletes all data)
docker compose exec app npx prisma db push --force-reset

# Check Prisma schema
docker compose exec app npx prisma validate
```

## Best Practices

1. **Don't commit `.env`** - Always use `.env.example` templates
2. **Use volumes for data** - Database and uploads should persist
3. **Multi-stage builds** - Keep images small and secure
4. **Non-root user** - Run containers with minimal privileges
5. **Health checks** - Ensure services are ready before dependencies start
6. **Logging** - Use structured logging for production
7. **Secrets** - Use Docker secrets or external secret management in production

## Performance Tips

### Image Size Optimization
- ✅ Use Alpine Linux base images
- ✅ Multi-stage builds
- ✅ .dockerignore to exclude unnecessary files
- ✅ Combine RUN commands to reduce layers

### Build Speed
```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker compose build

# Cache npm dependencies
# Already implemented in Dockerfile with separate deps stage
```

### Development Speed
```bash
# Use bind mounts for hot reload (add to docker-compose.yml)
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker compose build
      
      - name: Run tests
        run: docker compose run app npm test
```

## Production Deployment

For production deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
