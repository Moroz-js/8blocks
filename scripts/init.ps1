# 8Blocks Initialization Script
# Run this script to set up the project for the first time

Write-Host "🚀 Initializing 8Blocks project..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local from example..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "⚠️  Please edit .env.local and set your admin credentials!" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after editing .env.local to continue"
}

# Check if Docker is running
Write-Host "🐳 Checking Docker..." -ForegroundColor Cyan
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL
Write-Host "🗄️  Starting PostgreSQL..." -ForegroundColor Cyan
docker-compose up -d

# Wait for PostgreSQL to be ready
Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
npm run db:generate

# Push schema to database
Write-Host "📊 Pushing schema to database..." -ForegroundColor Cyan
npm run db:push

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run db:seed

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Admin panel will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
