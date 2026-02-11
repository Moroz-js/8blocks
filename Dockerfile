# Multi-stage build for Next.js application

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js application (includes prisma generate)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Compile seed.ts to seed.js for production use (no ts-node needed)
RUN npx tsc prisma/seed.ts --outDir prisma --esModuleInterop --module commonjs --skipLibCheck || true

# Stage 3: Runner (production)
FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma and wget for healthcheck
RUN apk add --no-cache openssl libc6-compat wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema and client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma CLI and binaries for migrations
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

# Copy compiled seed.js (no ts-node needed in production!)
COPY --from=builder /app/prisma/seed.js ./prisma/seed.js

# Create uploads directory with proper permissions
# Note: If using bind mount, host permissions take precedence
RUN mkdir -p ./public/uploads && \
    chown -R nextjs:nodejs ./public && \
    chmod -R 755 ./public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
