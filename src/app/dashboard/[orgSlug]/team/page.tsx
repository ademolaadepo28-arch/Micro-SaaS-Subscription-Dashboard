'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { UserPlus, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InviteMemberModal from '@/components/team/InviteMemberModal';
import TeamTable from '@/components/team/TeamTable';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Member, Invitation, Role, PlanTier } from '@/types';
import { PLANS } from '@/lib/constants';

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    role: 'OWNER',
    organizationId: 'org_1',
    userId: 'usr_1',
    user: {
      id: 'usr_1',
      name: 'Sarah Connor',
      email: 'sarah@skynet-defense.io',
      emailVerified: new Date('2026-01-01'),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'mem_2',
    role: 'ADMIN',
    organizationId: 'org_1',
    userId: 'usr_2',
    user: {
      id: 'usr_2',
      name: 'Alex Rivera',
      email: 'alex@skynet-defense.io',
      emailVerified: new Date('2026-01-05'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    createdAt: new Date('2026-01-05'),
  },
  {
    id: 'mem_3',
    role: 'BILLING',
    organizationId: 'org_1',
    userId: 'usr_3',
    user: {
      id: 'usr_3',
      name: 'Marcus Vance',
      email: 'marcus.finance@skynet-defense.io',
      emailVerified: new Date('2026-01-10'),
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'mem_4',
    role: 'MEMBER',
    organizationId: 'org_1',
    userId: 'usr_4',
    user: {
      id: 'usr_4',
      name: 'Elena Rostova',
      email: 'elena@skynet-defense.io',
      emailVerified: new Date('2026-02-01'),
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    createdAt: new Date('2026-02-01'),
  },
];

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv_1',
    email: 'devops-lead@partner.io',
    role: 'ADMIN',
    token: 'tok_inv_882910fa',
    expiresAt: new Date('2026-10-14T19:00:00Z'),
    organizationId: 'org_1',
    createdAt: new Date('2026-10-07T19:00:00Z'),
  },
];

export default function TeamManagementPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const { role } = useWorkspace();

  const tier: PlanTier = orgSlug === 'hyperflow-ai' ? 'PRO' : orgSlug === 'devstudio' ? 'FREE' : 'TEAM';
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [invitations, setInvitations] = useState<Invitation[]>(INITIAL_INVITATIONS);

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const plan = PLANS[tier];
  const maxSeats = plan.seatLimit;
  const currentSeats = members.length;
  const canManageTeam = role === 'OWNER' || role === 'ADMIN';

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleInvite = async (email: string, inviteRole: Role) => {
    const token = `tok_inv_${Math.random().toString(36).substring(2, 10)}`;
    const newInv: Invitation = {
      id: `inv_${Date.now()}`,
      email,
      role: inviteRole,
      token,
      expiresAt: new Date(Date.now() + 7 * 86400 * 1000),
      organizationId: 'org_1',
      createdAt: new Date(),
    };
    setInvitations((prev) => [...prev, newInv]);
    showToast(`Generated invite token for ${email}`);
    return { token };
  };

  const handleSimulateAcceptInvite = (token: string) => {
    const inv = invitations.find((i) => i.token === token);
    if (!inv) return;

    const newMember: Member = {
      id: `mem_${Date.now()}`,
      role: inv.role,
      organizationId: 'org_1',
      userId: `usr_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        name: inv.email.split('@')[0],
        email: inv.email,
        emailVerified: new Date(),
      },
      createdAt: new Date(),
    };

    setMembers((prev) => [...prev, newMember]);
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    showToast(`Simulated acceptance: ${inv.email} added to active team members!`);
  };

  const handleUpdateRole = async (memberId: string, newRole: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast(`Updated member role to ${newRole}`);
  };

  const handleRemoveMember = async (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast(`Removed ${target?.user?.name || target?.user?.email || 'member'} from workspace`);
  };

  const handleRevokeInvitation = async (invId: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== invId));
    showToast('Revoked invitation token.');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Team &amp; RBAC Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Control member seats, roles (OWNER, ADMIN, BILLING, MEMBER), and invitation tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="btn-invite-member"
            variant="primary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            disabled={!canManageTeam || currentSeats >= maxSeats}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Seat Allocation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <span className="text-xs font-medium text-zinc-400 block mb-1">Allocated Seats</span>
          <div className="text-2xl font-bold text-zinc-100">
            {currentSeats}{' '}
            <span className="text-sm font-normal text-zinc-500">
              / {maxSeats === 9999 ? 'Unlimited' : maxSeats}
            </span>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${Math.min(100, (currentSeats / (maxSeats === 9999 ? 100 : maxSeats)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <span className="text-xs font-medium text-zinc-400 block mb-1">Available Seats</span>
          <div className="text-2xl font-bold text-emerald-400">
            {maxSeats === 9999 ? 'Unlimited' : Math.max(0, maxSeats - currentSeats)}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {currentSeats >= maxSeats ? 'Plan limit reached' : 'Available on current plan'}
          </p>
        </Card>

        <Card>
          <span className="text-xs font-medium text-zinc-400 block mb-1">Current RBAC Mode</span>
          <div className="text-base font-semibold text-zinc-200">
            Simulating <span className="text-indigo-400">{role}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {canManageTeam
              ? 'Authorized to invite members & edit roles'
              : 'Read-only access (no invite/removal rights)'}
          </p>
        </Card>
      </div>

      {!canManageTeam && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <span>
            Your active role is <strong>{role}</strong>. You can view the member list, but only <strong>OWNER</strong> or <strong>ADMIN</strong> can issue invites or modify roles.
          </span>
        </div>
      )}

      {/* Main Table */}
      <TeamTable
        members={members}
        invitations={invitations}
        currentUserRole={role}
        onUpdateRole={handleUpdateRole}
        onRemoveMember={handleRemoveMember}
        onRevokeInvitation={handleRevokeInvitation}
      />

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
        onSimulateAccept={handleSimulateAcceptInvite}
        currentSeats={currentSeats}
        maxSeats={maxSeats}
      />
    </div>
  );
}
