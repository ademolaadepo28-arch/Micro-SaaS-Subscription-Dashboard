import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { PLANS } from '@/lib/constants';
import { PlanTier } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgSlug, tier, customerEmail } = body;

    if (!orgSlug || !tier) {
      return NextResponse.json({ error: 'Missing required parameters: orgSlug, tier' }, { status: 400 });
    }

    const plan = PLANS[tier as PlanTier];
    if (!plan) {
      return NextResponse.json({ error: `Invalid plan tier: ${tier}` }, { status: 400 });
    }

    const session = await stripe.createCheckoutSession({
      organizationId: orgSlug,
      slug: orgSlug,
      priceId: plan.stripePriceId,
      tier,
      customerEmail,
    });

    return NextResponse.json({ url: session.url, sessionId: session.sessionId });
  } catch (error: unknown) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
