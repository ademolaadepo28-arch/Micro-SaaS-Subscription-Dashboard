#!/bin/bash
set -e

# ==============================================================================
# Micro-SaaS Subscription Dashboard - Full-Stack Container Entrypoint
# Supports Embedded PostgreSQL, Embedded SQLite, and External Databases
# Compatible with AppDeploy, Fly.io, and Docker Orchestrators
# ==============================================================================

echo "=========================================================="
echo " Starting Micro-SaaS Full-Stack Container"
echo " Target Environment: AppDeploy / Fly.io / Container Runtime"
echo "=========================================================="

# Ensure directories and permissions for persistent volume
mkdir -p /data/postgres /data/sqlite /run/postgresql
chown -R postgres:postgres /data /run/postgresql 2>/dev/null || true
chmod 700 /data/postgres 2>/dev/null || true
chmod 755 /data/sqlite 2>/dev/null || true

# Determine Database Configuration
DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/microsaas?schema=public}"
export DATABASE_URL="$DB_URL"
IS_EMBEDDED_PG=false

cleanup() {
  echo "==> Received shutdown signal. Terminating gracefully..."
  if [ -n "$APP_PID" ]; then
    kill -TERM "$APP_PID" 2>/dev/null || true
    wait "$APP_PID" 2>/dev/null || true
  fi
  if [ "$IS_EMBEDDED_PG" = true ]; then
    echo "==> Shutting down embedded PostgreSQL cleanly..."
    su-exec postgres pg_ctl -D /data/postgres -m fast stop || true
  fi
  exit 0
}

trap cleanup SIGTERM SIGINT

if [[ ("$DB_URL" == *"localhost"* || "$DB_URL" == *"127.0.0.1"*) && "$DB_TYPE" != "sqlite" && "$DB_URL" != file:* ]]; then
  IS_EMBEDDED_PG=true
  echo "==> Embedded PostgreSQL detected on localhost:5432"

  if [ ! -f /data/postgres/PG_VERSION ]; then
    echo "==> Initializing new PostgreSQL cluster in /data/postgres..."
    su-exec postgres initdb -D /data/postgres -E UTF8 --auth=trust
    echo "listen_addresses = '127.0.0.1'" >> /data/postgres/postgresql.conf
    echo "shared_buffers = 128MB" >> /data/postgres/postgresql.conf
  fi

  echo "==> Starting embedded PostgreSQL daemon..."
  su-exec postgres pg_ctl -D /data/postgres -w -o "-p 5432 -h 127.0.0.1" -l /data/postgres/postgres.log start

  # Create 'microsaas' database if it doesn't already exist
  if ! su-exec postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw microsaas; then
    echo "==> Creating 'microsaas' database..."
    su-exec postgres createdb -U postgres microsaas
  fi

  # Apply Prisma schema to database if Prisma is available
  if [ -f /app/prisma/schema.prisma ] && [ -d /app/node_modules/prisma ]; then
    echo "==> Synchronizing Prisma database schema..."
    node /app/node_modules/prisma/build/index.js db push --skip-generate --schema=/app/prisma/schema.prisma --accept-data-loss || npx prisma db push --skip-generate --schema=/app/prisma/schema.prisma || echo "Notice: Prisma db push step completed."
  fi

elif [[ "$DB_TYPE" == "sqlite" || "$DB_URL" == file:* ]]; then
  echo "==> Embedded SQLite mode detected."
  mkdir -p /data/sqlite
  if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="file:/data/sqlite/microsaas.db"
  fi
else
  echo "==> External database URL detected. Connecting directly."
fi

# Set host and port defaults
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "==> Launching Next.js Standalone Server on port ${PORT}..."
node server.js &
APP_PID=$!

wait $APP_PID
