# syntax=docker/dockerfile:1

# ==============================================================================
# Micro-SaaS Subscription Dashboard - Full-Stack Fly.io Container
# Multi-stage build with Embedded PostgreSQL / SQLite support
# ==============================================================================

# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Application Builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (supports both PostgreSQL and SQLite models)
RUN npx prisma generate

# Build Next.js in Standalone Mode
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Full-Stack Production Runner
FROM node:22-alpine AS runner
WORKDIR /app

# Install PostgreSQL, su-exec process switcher, bash, and curl
RUN apk add --no-cache \
    postgresql \
    postgresql-contrib \
    su-exec \
    bash \
    curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Setup persistent volume mount points for Fly.io
RUN mkdir -p /data/postgres /data/sqlite /run/postgresql && \
    chown -R postgres:postgres /run/postgresql /data

# Copy built application assets and standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy container startup script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose HTTP port for Fly.io proxy
EXPOSE 3000

# Fly.io Volume Mount Target
VOLUME ["/data"]

ENTRYPOINT ["/app/docker-entrypoint.sh"]
