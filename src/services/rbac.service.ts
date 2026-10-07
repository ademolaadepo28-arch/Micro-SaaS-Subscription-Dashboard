// RBAC Service - Strict Permission Enforcement
// Spec #03 - Access levels (OWNER, ADMIN, MEMBER, BILLING)

import { Role } from '@/types';

export type PermissionAction =
  | 'seat:invite'
  | 'seat:remove'
  | 'seat:change_role'
  | 'api_key:create'
  | 'api_key:revoke'
  | 'billing:view'
  | 'billing:update_plan'
  | 'billing:portal'
  | 'org:update_settings'
  | 'org:delete'
  | 'metrics:view';

const ROLE_PERMISSIONS: Record<Role, PermissionAction[]> = {
  OWNER: [
    'seat:invite',
    'seat:remove',
    'seat:change_role',
    'api_key:create',
    'api_key:revoke',
    'billing:view',
    'billing:update_plan',
    'billing:portal',
    'org:update_settings',
    'org:delete',
    'metrics:view',
  ],
  ADMIN: [
    'seat:invite',
    'seat:remove',
    'seat:change_role',
    'api_key:create',
    'api_key:revoke',
    'org:update_settings',
    'metrics:view',
  ],
  BILLING: [
    'billing:view',
    'billing:update_plan',
    'billing:portal',
    'metrics:view',
  ],
  MEMBER: [
    'metrics:view',
  ],
};

export class RbacService {
  // Check if role has explicit permission action
  static can(role: Role, action: PermissionAction): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(action);
  }

  // Assert permission or throw descriptive error
  static assert(role: Role, action: PermissionAction): void {
    if (!this.can(role, action)) {
      throw new Error(`Forbidden: Role '${role}' is not authorized to perform action '${action}'.`);
    }
  }

  // List all allowed actions for a given role
  static getPermissions(role: Role): PermissionAction[] {
    return ROLE_PERMISSIONS[role] || [];
  }
}

export default RbacService;
