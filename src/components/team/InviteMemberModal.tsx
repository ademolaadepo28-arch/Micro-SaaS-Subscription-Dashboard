'use client';

import React, { useState } from 'react';
import { Mail, Shield, AlertCircle, Copy, Check } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Role } from '@/types';
import { ROLES_DESCRIPTION } from '@/lib/constants';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: Role) => Promise<{ token: string }>;
  currentSeats: number;
  maxSeats: number;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  currentSeats,
  maxSeats,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isSeatLimitReached = currentSeats >= maxSeats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (isSeatLimitReached) {
      setError(`Seat limit reached (${currentSeats}/${maxSeats}). Please upgrade your plan tier to invite more members.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await onInvite(email, role);
      setCreatedToken(res.token);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate invitation.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!createdToken) return;
    const url = `${window.location.origin}/invite?token=${createdToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setEmail('');
    setRole('MEMBER');
    setError(null);
    setCreatedToken(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Invite Team Member"
      description="Send a secure time-limited invitation token to join your workspace."
    >
      {createdToken ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-sm">
            <p className="font-semibold">Invitation token generated successfully!</p>
            <p className="text-xs text-emerald-400/80 mt-1">
              The recipient has 7 days to accept before this token expires.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Invite Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invite?token=${createdToken}`}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300"
              />
              <Button variant="secondary" size="sm" onClick={copyInviteLink}>
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button variant="primary" onClick={handleResetAndClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSeatLimitReached && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                Plan seat limit reached ({currentSeats}/{maxSeats}). Upgrade to add additional team members.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Role & Access Level (RBAC)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="MEMBER">Member (Read & standard access)</option>
              <option value="BILLING">Billing (Stripe subscriptions & invoices)</option>
              <option value="ADMIN">Admin (Team seats & API key management)</option>
              <option value="OWNER">Owner (Full administrative control)</option>
            </select>
            <p className="text-xs text-zinc-400 mt-1">
              {ROLES_DESCRIPTION[role].description}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800/80">
            <Button type="button" variant="ghost" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isSeatLimitReached}
            >
              Generate Invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InviteMemberModal;
