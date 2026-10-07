export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'BILLING';

export type SubscriptionStatus =
  | 'INCOMPLETE'
  | 'INCOMPLETE_EXPIRED'
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'UNPAID';

export type PlanTier = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  priceLabel: string;
  stripePriceId?: string;
  seatLimit: number;
  meteredApiQuota: number; // requests per month
  storageQuotaBytes: number; // e.g. bytes
  entitlements: string[];
  badge?: string;
  popular?: boolean;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
}

export interface Member {
  id: string;
  role: Role;
  organizationId: string;
  userId: string;
  user: User;
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  organizationId: string;
  createdAt: Date;
}

export interface UsageRecord {
  id: string;
  metric: 'api_requests' | 'storage_bytes';
  quantity: number;
  timestamp: Date;
  organizationId: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  expiresAt: Date;
  organizationId: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd?: Date | null;
  members: Member[];
  apiKeys: ApiKey[];
  usageRecords: UsageRecord[];
  invitations: Invitation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageSummary {
  metric: string;
  used: number;
  limit: number;
  percent: number;
  isSoftWarning: boolean;
  isHardWarning: boolean;
  isExceeded: boolean;
  overageUnits: number;
  estimatedOverageCost: number;
}
