import { PlanConfig, PlanTier } from '@/types';

export const PLANS: Record<PlanTier, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free Tier',
    monthlyPrice: 0,
    priceLabel: '$0 / mo',
    stripePriceId: 'price_free',
    seatLimit: 1,
    meteredApiQuota: 1000,
    storageQuotaBytes: 100 * 1024 * 1024, // 100 MB
    entitlements: ['Community Support', 'Basic Metrics', '1 API Key'],
  },
  PRO: {
    id: 'PRO',
    name: 'Pro Tier',
    monthlyPrice: 29,
    priceLabel: '$29 / mo',
    stripePriceId: 'price_1N_pro_monthly_29',
    seatLimit: 5,
    meteredApiQuota: 50000,
    storageQuotaBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    entitlements: [
      'Email Support',
      'Custom Webhooks',
      'Audit Logs',
      'Up to 5 Team Seats',
      '50k API Requests / mo',
    ],
    popular: true,
  },
  TEAM: {
    id: 'TEAM',
    name: 'Team Tier',
    monthlyPrice: 99,
    priceLabel: '$99 / mo',
    stripePriceId: 'price_1N_team_monthly_99',
    seatLimit: 20,
    meteredApiQuota: 500000,
    storageQuotaBytes: 50 * 1024 * 1024 * 1024, // 50 GB
    entitlements: [
      'Priority Support (24/7)',
      'SAML Single Sign-On (SSO)',
      'Usage Overage Billing',
      'Up to 20 Team Seats',
      '500k API Requests / mo',
      'Advanced RBAC Controls',
    ],
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    monthlyPrice: 299,
    priceLabel: 'Custom ($299+)',
    stripePriceId: 'price_enterprise_custom',
    seatLimit: 9999, // Unlimited
    meteredApiQuota: 10000000, // Custom SLA
    storageQuotaBytes: 1024 * 1024 * 1024 * 1024, // 1 TB
    entitlements: [
      'Dedicated Account Manager',
      'Custom Contracts & Invoicing',
      'Custom SLA (99.99%)',
      'Unlimited Team Seats',
      'Multi-region Dedicated Clusters',
    ],
  },
};

export const THRESHOLDS = {
  SOFT_WARNING_PERCENT: 80,
  HARD_WARNING_PERCENT: 95,
  OVERAGE_FEE_PER_1000_REQS: 0.15, // $0.15 per 1,000 overage requests
};

export const ROLES_DESCRIPTION = {
  OWNER: {
    label: 'Owner',
    description: 'Full workspace ownership, billing rights, member deletion, and API credential management.',
    color: 'emerald',
  },
  ADMIN: {
    label: 'Admin',
    description: 'Workspace administration, team invite token issuance, rate limits, and API keys.',
    color: 'blue',
  },
  MEMBER: {
    label: 'Member',
    description: 'Read and execute standard features, view metered usage charts and metrics.',
    color: 'purple',
  },
  BILLING: {
    label: 'Billing',
    description: 'Manage Stripe subscriptions, view invoices, payment methods, and overage limits.',
    color: 'amber',
  },
};
