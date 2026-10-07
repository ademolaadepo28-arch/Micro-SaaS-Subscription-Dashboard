import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '@/lib/redis';
import UsageService from '@/services/usage.service';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const orgSlug = req.headers.get('x-org-slug') || 'acme-corp';

  // Check Bearer Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid Bearer token' },
      { status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '');

  // Rate Limiting Enforcement (Token Bucket)
  const rateLimitResult = await rateLimiter.limit(`key_${token}`, 60, 60);

  const headers = new Headers();
  headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: rateLimitResult.error,
        retryAfter: rateLimitResult.reset - Math.floor(Date.now() / 1000),
      },
      { status: 429, headers }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = { quantity: 1 };
  }

  const quantity = typeof body.quantity === 'number' ? body.quantity : 1;

  // Record metered usage increment
  const newTotal = await UsageService.recordUsage('org_acme_corp', 'api_requests', quantity);

  return NextResponse.json(
    {
      success: true,
      data: {
        metric: 'api_requests',
        recordedQuantity: quantity,
        totalMonthlyUsage: newTotal,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 200, headers }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/v1/metrics',
    documentation: 'Send POST requests with Bearer token to ingest metered metrics.',
    version: '1.0.0',
  });
}
