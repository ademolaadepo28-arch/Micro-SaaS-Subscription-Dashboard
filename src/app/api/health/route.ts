import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const dbType = process.env.DB_TYPE || (dbUrl.includes('sqlite') || dbUrl.startsWith('file:') ? 'sqlite' : 'postgres');
  const isEmbedded = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.startsWith('file:');

  return NextResponse.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'microsaas-subscription-dashboard',
    environment: process.env.NODE_ENV || 'production',
    database: {
      type: dbType,
      mode: isEmbedded ? 'embedded' : 'external',
      target: isEmbedded ? (dbType === 'sqlite' ? '/data/sqlite' : '/data/postgres') : 'remote',
    },
    version: '1.0.0',
  }, { status: 200 });
}
