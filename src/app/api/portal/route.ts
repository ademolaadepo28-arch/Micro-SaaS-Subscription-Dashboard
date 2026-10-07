import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgSlug } = body;

    if (!orgSlug) {
      return NextResponse.json({ error: 'Missing orgSlug' }, { status: 400 });
    }

    const org = await db.getOrganizationBySlug(orgSlug);
    const customerId = org?.stripeCustomerId || `cus_mock_${orgSlug}`;
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const returnUrl = `${origin}/dashboard/${orgSlug}/billing`;

    const portalSession = await stripe.createBillingPortalSession(customerId, returnUrl);

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error('Billing portal session creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
