import { NextRequest, NextResponse } from 'next/server';
import BillingService from '@/services/billing.service';

// Set of processed event IDs for idempotent processing
const processedEventIds = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const eventId = event.id || `evt_${Date.now()}`;

    // Idempotency check: Ignore duplicate delivery of identical events
    if (processedEventIds.has(eventId)) {
      return NextResponse.json(
        { received: true, idempotentReplay: true },
        { status: 200 }
      );
    }

    processedEventIds.add(eventId);

    // Keep cache bounded
    if (processedEventIds.size > 1000) {
      const firstKey = processedEventIds.values().next().value;
      if (firstKey) processedEventIds.delete(firstKey);
    }

    // Process event through BillingService
    await BillingService.processStripeWebhook(event);

    return NextResponse.json(
      {
        received: true,
        eventId,
        type: event.type,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    return NextResponse.json(
      { error: err?.message || 'Webhook handler error' },
      { status: 500 }
    );
  }
}
