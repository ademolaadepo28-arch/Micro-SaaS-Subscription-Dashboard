'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Clock } from 'lucide-react';
import { Member, Invitation, Role } from '@/types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface TeamTableProps {
  members: Member[];
  invitations: Invitation[];
  currentUserRole: Role;
  onUpdateRole: (memberId: string, newRole: Role) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onRevokeInvitation: (invitationId: string) => Promise<void>;
}

export const TeamTable: React.FC<TeamTableProps> = ({
  members,
  invitations,
  currentUserRole,
  onUpdateRole,
  onRemoveMember,
  onRevokeInvitation,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'OWNER':
        return 'success';
      case 'ADMIN':
        return 'blue';
      case 'BILLING':
        return 'warning';
      case 'MEMBER':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Active Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'invitations'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Pending Invitations ({invitations.length})
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-xs text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
                {canManage && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xs font-bold text-indigo-300 overflow-hidden">
                        {member.user.image ? (
                          <Image
                            src={member.user.image}
                            alt={member.user.name || member.user.email}
                            width={36}
                            height={36}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (member.user.name || member.user.email).substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">{member.user.name || 'Team Member'}</p>
                        <p className="text-xs text-zinc-400">{member.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {canManage && member.role !== 'OWNER' ? (
                      <select
                        value={member.role}
                        onChange={(e) => onUpdateRole(member.id, e.target.value as Role)}
                        className="bg-zinc-950 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="BILLING">BILLING</option>
                        <option value="ADMIN">ADMIN</option>
                        {currentUserRole === 'OWNER' && <option value="OWNER">OWNER</option>}
                      </select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                        {member.role}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-400">
                    {new Date(member.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  {canManage && (
                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'OWNER' ? (
                        <button
                          onClick={() => setMemberToRemove(member)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Workspace Owner</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
          {invitations.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm">
              No pending invitations for this workspace.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900 text-xs text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Invited Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Expires In</th>
                  {canManage && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-zinc-200">{inv.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getRoleBadgeVariant(inv.role)} size="sm">
                        {inv.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>7 days</span>
                    </td>
                    {canManage && (
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onRevokeInvitation(inv.id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        title="Remove Member from Workspace"
        description="Are you sure you want to revoke workspace access for this user?"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
            <strong>{memberToRemove?.user?.name || memberToRemove?.user?.email}</strong> will immediately lose access to all resources, API keys, and configurations for this workspace.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (memberToRemove) {
                  onRemoveMember(memberToRemove.id);
                  setMemberToRemove(null);
                }
              }}
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamTable;
