#!/bin/bash
# Diagnostic script for deployment issues

echo "═══════════════════════════════════════════════"
echo "🔍 8blocks.io Deployment Diagnostics"
echo "═══════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker containers
echo "📦 Docker Containers Status:"
echo "─────────────────────────────────────────────"
docker compose ps
echo ""

# Check app is responding locally
echo "🌐 Testing app locally (http://127.0.0.1:3000/):"
echo "─────────────────────────────────────────────"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/)
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "302" ]; then
  echo -e "${GREEN}✓ App responds: HTTP $HTTP_CODE${NC}"
else
  echo -e "${RED}✗ App not responding properly: HTTP $HTTP_CODE${NC}"
fi
echo ""

# Check static files
echo "📂 Testing static files (http://127.0.0.1:3000/_next/static):"
echo "─────────────────────────────────────────────"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/_next/static/)
echo "HTTP Status: $HTTP_CODE"
echo ""

# Check Nginx config
echo "⚙️  Nginx Configuration:"
echo "─────────────────────────────────────────────"
if grep -q "location /" /etc/nginx/sites-available/8blocks.io; then
  echo -e "${GREEN}✓ Nginx has root location block${NC}"
  grep -A 10 "location /" /etc/nginx/sites-available/8blocks.io | head -15
else
  echo -e "${RED}✗ No root location block in Nginx config${NC}"
fi
echo ""

# Check Nginx is running
echo "🔄 Nginx Status:"
echo "─────────────────────────────────────────────"
systemctl is-active nginx && echo -e "${GREEN}✓ Nginx is running${NC}" || echo -e "${RED}✗ Nginx is not running${NC}"
echo ""

# Test through Nginx
echo "🌍 Testing through Nginx (https://8blocks.io/):"
echo "─────────────────────────────────────────────"
HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/ -H "Host: 8blocks.io")
if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "302" ]; then
  echo -e "${GREEN}✓ Nginx proxies successfully: HTTP $HTTP_CODE${NC}"
else
  echo -e "${YELLOW}⚠ Nginx response: HTTP $HTTP_CODE${NC}"
fi
echo ""

# Check database
echo "🗄️  Database Status:"
echo "─────────────────────────────────────────────"
docker compose exec -T postgres pg_isready -U postgres && echo -e "${GREEN}✓ PostgreSQL is ready${NC}" || echo -e "${RED}✗ PostgreSQL is not ready${NC}"
echo ""

# Check recent app logs
echo "📜 Recent App Logs (last 20 lines):"
echo "─────────────────────────────────────────────"
docker compose logs --tail=20 app
echo ""

# Check Nginx error log
echo "⚠️  Recent Nginx Errors (last 10 lines):"
echo "─────────────────────────────────────────────"
tail -n 10 /var/log/nginx/8blocks.io.error.log 2>/dev/null || echo "No errors found"
echo ""

echo "═══════════════════════════════════════════════"
echo "✅ Diagnostics Complete"
echo "═══════════════════════════════════════════════"
