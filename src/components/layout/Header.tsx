'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Bell, ExternalLink, Terminal } from 'lucide-react';
import Badge from '../ui/Badge';
import { Role } from '@/types';
import { ROLES_DESCRIPTION } from '@/lib/constants';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  orgName: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, orgName }) => {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-mono">Workspace:</span>
        <span className="text-sm font-semibold text-zinc-200">{orgName}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live RBAC Role Testing Switcher */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-zinc-400">Simulate RBAC:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="bg-transparent text-xs font-semibold text-indigo-400 focus:outline-none cursor-pointer"
          >
            <option value="OWNER" className="bg-zinc-900 text-zinc-100">OWNER (Full Admin)</option>
            <option value="ADMIN" className="bg-zinc-900 text-zinc-100">ADMIN (Team/Keys)</option>
            <option value="BILLING" className="bg-zinc-900 text-zinc-100">BILLING (Stripe Only)</option>
            <option value="MEMBER" className="bg-zinc-900 text-zinc-100">MEMBER (Read Only)</option>
          </select>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xs font-bold text-indigo-300">
            SC
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-zinc-200">Sarah Connor</p>
            <p className="text-[10px] text-zinc-500">sarah@skynet-defense.io</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
