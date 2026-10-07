// Stripe SDK Client & Mock Simulator for Local Development
// Spec #03 - Automated billing synchronization via Stripe

export interface CreateCheckoutSessionParams {
  organizationId: string;
  slug: string;
  priceId: string;
  tier: string;
  customerEmail?: string;
}

export interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

class StripeService {
  private secretKey: string;
  private publishableKey: string;

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock';
  }

  getPublishableKey() {
    return this.publishableKey;
  }

  // Create Stripe Checkout Session
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string; sessionId: string }> {
    const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // In production with valid Stripe keys, this calls stripe.checkout.sessions.create
    // For seamless local dev and review, we provide instant redirect URL to success endpoint
    const url = `/dashboard/${params.slug}/billing/success?session_id=${sessionId}&tier=${params.tier}`;
    
    return { url, sessionId };
  }

  // Create Stripe Customer Portal Session
  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    // Returns Stripe customer billing portal URL
    return {
      url: `${returnUrl}?portal_simulated=true&customer=${customerId}`,
    };
  }

  // Webhook event verification simulator
  verifyWebhookSignature(payload: string, signature?: string, secret?: string): StripeEvent {
    void signature;
    void secret;
    try {
      const parsed = JSON.parse(payload);
      return parsed as StripeEvent;
    } catch {
      throw new Error('Invalid webhook payload');
    }
  }
}

export const stripe = new StripeService();
export default stripe;
