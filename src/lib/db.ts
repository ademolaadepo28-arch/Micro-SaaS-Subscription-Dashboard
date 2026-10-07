import { Organization, User, Member, ApiKey, UsageRecord, Invitation, Role } from '@/types';

// Initial Seed Data for Multi-tenant B2B Architecture Demo
const SEED_USERS: User[] = [
  {
    id: 'usr_owner_1',
    name: 'Sarah Connor',
    email: 'sarah@skynet-defense.io',
    emailVerified: new Date('2026-01-10'),
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr_admin_2',
    name: 'Alex Rivera',
    email: 'alex@skynet-defense.io',
    emailVerified: new Date('2026-02-15'),
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr_billing_3',
    name: 'Marcus Vance',
    email: 'marcus.finance@skynet-defense.io',
    emailVerified: new Date('2026-03-01'),
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'usr_member_4',
    name: 'Elena Rostova',
    email: 'elena@skynet-defense.io',
    emailVerified: new Date('2026-03-20'),
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_acme_corp',
    name: 'Acme Cloud Dynamics',
    slug: 'acme-corp',
    stripeCustomerId: 'cus_N94h8A0K2mLp',
    stripeSubscriptionId: 'sub_1O98B82eZvKYlo2CLp',
    stripePriceId: 'price_1N_team_monthly_99',
    subscriptionStatus: 'ACTIVE',
    currentPeriodEnd: new Date(Date.now() + 24 * 86400 * 1000),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date(),
    members: [],
    apiKeys: [],
    usageRecords: [],
    invitations: [],
  },
  {
    id: 'org_hyperflow_ai',
    name: 'Hyperflow AI Labs',
    slug: 'hyperflow-ai',
    stripeCustomerId: 'cus_M81x7B2P3nQr',
    stripeSubscriptionId: 'sub_1O87A71eZvKYlo1BQk',
    stripePriceId: 'price_1N_pro_monthly_29',
    subscriptionStatus: 'ACTIVE',
    currentPeriodEnd: new Date(Date.now() + 12 * 86400 * 1000),
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date(),
    members: [],
    apiKeys: [],
    usageRecords: [],
    invitations: [],
  },
  {
    id: 'org_starter_dev',
    name: 'DevStudio Indie',
    slug: 'devstudio',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: 'price_free',
    subscriptionStatus: 'TRIALING',
    currentPeriodEnd: new Date(Date.now() + 5 * 86400 * 1000),
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date(),
    members: [],
    apiKeys: [],
    usageRecords: [],
    invitations: [],
  },
];

// Initialize relations
const SEED_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    role: 'OWNER',
    organizationId: 'org_acme_corp',
    userId: 'usr_owner_1',
    user: SEED_USERS[0],
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'mem_2',
    role: 'ADMIN',
    organizationId: 'org_acme_corp',
    userId: 'usr_admin_2',
    user: SEED_USERS[1],
    createdAt: new Date('2026-01-05'),
  },
  {
    id: 'mem_3',
    role: 'BILLING',
    organizationId: 'org_acme_corp',
    userId: 'usr_billing_3',
    user: SEED_USERS[2],
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'mem_4',
    role: 'MEMBER',
    organizationId: 'org_acme_corp',
    userId: 'usr_member_4',
    user: SEED_USERS[3],
    createdAt: new Date('2026-02-01'),
  },
  {
    id: 'mem_5',
    role: 'OWNER',
    organizationId: 'org_hyperflow_ai',
    userId: 'usr_owner_1',
    user: SEED_USERS[0],
    createdAt: new Date('2026-02-10'),
  },
];

const SEED_API_KEYS: ApiKey[] = [
  {
    id: 'key_live_prod_1',
    name: 'Production Ingestion Service',
    key: 'ms_live_49f8a20bc9e1458890cd1a97f26',
    lastUsedAt: new Date(Date.now() - 4 * 60 * 1000),
    expiresAt: new Date('2027-01-01'),
    organizationId: 'org_acme_corp',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'key_test_staging_2',
    name: 'Staging CI/CD Pipeline',
    key: 'ms_test_901cbf540a82771de99c3321ba',
    lastUsedAt: new Date(Date.now() - 36 * 60 * 1000),
    expiresAt: new Date('2026-12-31'),
    organizationId: 'org_acme_corp',
    createdAt: new Date('2026-02-01'),
  },
];

const SEED_USAGE: UsageRecord[] = [
  {
    id: 'usg_1',
    metric: 'api_requests',
    quantity: 412850,
    timestamp: new Date(),
    organizationId: 'org_acme_corp',
  },
  {
    id: 'usg_2',
    metric: 'storage_bytes',
    quantity: 34359738368, // 32 GB
    timestamp: new Date(),
    organizationId: 'org_acme_corp',
  },
  {
    id: 'usg_3',
    metric: 'api_requests',
    quantity: 34200,
    timestamp: new Date(),
    organizationId: 'org_hyperflow_ai',
  },
  {
    id: 'usg_4',
    metric: 'api_requests',
    quantity: 450,
    timestamp: new Date(),
    organizationId: 'org_starter_dev',
  },
];

const SEED_INVITATIONS: Invitation[] = [
  {
    id: 'inv_1',
    email: 'devops-lead@partner.io',
    role: 'ADMIN',
    token: 'tok_inv_882910fa',
    expiresAt: new Date(Date.now() + 7 * 86400 * 1000),
    organizationId: 'org_acme_corp',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000),
  },
  {
    id: 'inv_2',
    email: 'accountant@auditfirm.com',
    role: 'BILLING',
    token: 'tok_inv_440188ef',
    expiresAt: new Date(Date.now() + 6 * 86400 * 1000),
    organizationId: 'org_acme_corp',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
];

// Populate relations
SEED_ORGANIZATIONS[0].members = SEED_MEMBERS.filter((m) => m.organizationId === 'org_acme_corp');
SEED_ORGANIZATIONS[0].apiKeys = SEED_API_KEYS.filter((k) => k.organizationId === 'org_acme_corp');
SEED_ORGANIZATIONS[0].usageRecords = SEED_USAGE.filter((u) => u.organizationId === 'org_acme_corp');
SEED_ORGANIZATIONS[0].invitations = SEED_INVITATIONS.filter((i) => i.organizationId === 'org_acme_corp');

SEED_ORGANIZATIONS[1].members = SEED_MEMBERS.filter((m) => m.organizationId === 'org_hyperflow_ai');
SEED_ORGANIZATIONS[1].usageRecords = SEED_USAGE.filter((u) => u.organizationId === 'org_hyperflow_ai');

SEED_ORGANIZATIONS[2].usageRecords = SEED_USAGE.filter((u) => u.organizationId === 'org_starter_dev');

class DatabaseStore {
  private organizations: Organization[] = [...SEED_ORGANIZATIONS];
  private users: User[] = [...SEED_USERS];
  private members: Member[] = [...SEED_MEMBERS];
  private apiKeys: ApiKey[] = [...SEED_API_KEYS];
  private usage: UsageRecord[] = [...SEED_USAGE];
  private invitations: Invitation[] = [...SEED_INVITATIONS];

  async getOrganizationBySlug(slug: string): Promise<Organization | null> {
    const org = this.organizations.find((o) => o.slug === slug);
    if (!org) return null;
    return {
      ...org,
      members: this.members.filter((m) => m.organizationId === org.id),
      apiKeys: this.apiKeys.filter((k) => k.organizationId === org.id),
      usageRecords: this.usage.filter((u) => u.organizationId === org.id),
      invitations: this.invitations.filter((i) => i.organizationId === org.id),
    };
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizations.map((org) => ({
      ...org,
      members: this.members.filter((m) => m.organizationId === org.id),
      apiKeys: this.apiKeys.filter((k) => k.organizationId === org.id),
      usageRecords: this.usage.filter((u) => u.organizationId === org.id),
      invitations: this.invitations.filter((i) => i.organizationId === org.id),
    }));
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const idx = this.organizations.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Organization not found');
    this.organizations[idx] = {
      ...this.organizations[idx],
      ...data,
      updatedAt: new Date(),
    };
    return this.organizations[idx];
  }

  async createApiKey(orgId: string, name: string): Promise<ApiKey> {
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      key: `ms_live_${randomHex}`,
      lastUsedAt: null,
      expiresAt: new Date(Date.now() + 365 * 86400 * 1000),
      organizationId: orgId,
      createdAt: new Date(),
    };
    this.apiKeys.push(newKey);
    return newKey;
  }

  async deleteApiKey(orgId: string, keyId: string): Promise<boolean> {
    const initialLen = this.apiKeys.length;
    this.apiKeys = this.apiKeys.filter((k) => !(k.id === keyId && k.organizationId === orgId));
    return this.apiKeys.length < initialLen;
  }

  async createInvitation(orgId: string, email: string, role: Role): Promise<Invitation> {
    const inv: Invitation = {
      id: `inv_${Date.now()}`,
      email,
      role,
      token: `tok_inv_${Math.random().toString(36).substring(2, 10)}`,
      expiresAt: new Date(Date.now() + 7 * 86400 * 1000),
      organizationId: orgId,
      createdAt: new Date(),
    };
    this.invitations.push(inv);
    return inv;
  }

  async revokeInvitation(orgId: string, invId: string): Promise<boolean> {
    const initialLen = this.invitations.length;
    this.invitations = this.invitations.filter((i) => !(i.id === invId && i.organizationId === orgId));
    return this.invitations.length < initialLen;
  }

  async removeMember(orgId: string, memberId: string): Promise<boolean> {
    const initialLen = this.members.length;
    this.members = this.members.filter((m) => !(m.id === memberId && m.organizationId === orgId));
    return this.members.length < initialLen;
  }

  async updateMemberRole(orgId: string, memberId: string, role: Role): Promise<Member | null> {
    const member = this.members.find((m) => m.id === memberId && m.organizationId === orgId);
    if (!member) return null;
    member.role = role;
    return member;
  }

  async incrementUsage(orgId: string, metric: 'api_requests' | 'storage_bytes', amount = 1): Promise<number> {
    let record = this.usage.find((u) => u.organizationId === orgId && u.metric === metric);
    if (!record) {
      record = {
        id: `usg_${Date.now()}`,
        metric,
        quantity: amount,
        timestamp: new Date(),
        organizationId: orgId,
      };
      this.usage.push(record);
    } else {
      record.quantity += amount;
      record.timestamp = new Date();
    }
    return record.quantity;
  }

  async getUsage(orgId: string): Promise<{ apiRequests: number; storageBytes: number }> {
    const reqs = this.usage.find((u) => u.organizationId === orgId && u.metric === 'api_requests')?.quantity || 0;
    const storage = this.usage.find((u) => u.organizationId === orgId && u.metric === 'storage_bytes')?.quantity || 0;
    return { apiRequests: reqs, storageBytes: storage };
  }
}

// Global Singleton
const globalForDb = globalThis as unknown as { dbStore: DatabaseStore };
export const db = globalForDb.dbStore || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') globalForDb.dbStore = db;

export default db;
