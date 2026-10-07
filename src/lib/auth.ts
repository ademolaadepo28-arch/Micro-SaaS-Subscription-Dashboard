// Session & RBAC Helpers
// Spec #03 - Strict access levels (OWNER, ADMIN, MEMBER, BILLING)

import { Role, User, Member } from '@/types';
import db from './db';

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 4,
  ADMIN: 3,
  BILLING: 2,
  MEMBER: 1,
};

export interface SessionContext {
  user: User;
  activeRole: Role;
  organizationId: string;
}

// Current demo session helper
export async function getCurrentSession(orgSlug?: string): Promise<SessionContext | null> {
  const org = orgSlug ? await db.getOrganizationBySlug(orgSlug) : (await db.getAllOrganizations())[0];
  if (!org) return null;

  // Default to first member (Owner) or Sarah Connor
  const member = org.members[0] || {
    id: 'mem_default',
    role: 'OWNER' as Role,
    organizationId: org.id,
    userId: 'usr_owner_1',
    user: {
      id: 'usr_owner_1',
      name: 'Sarah Connor',
      email: 'sarah@skynet-defense.io',
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    createdAt: new Date(),
  };

  return {
    user: member.user,
    activeRole: member.role,
    organizationId: org.id,
  };
}

// Role checking utilities
export function hasMinimumRole(userRole: Role, minimumRequired: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRequired];
}

export function canManageBilling(role: Role): boolean {
  return role === 'OWNER' || role === 'BILLING';
}

export function canManageTeam(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canManageApiKeys(role: Role): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canDeleteOrganization(role: Role): boolean {
  return role === 'OWNER';
}
