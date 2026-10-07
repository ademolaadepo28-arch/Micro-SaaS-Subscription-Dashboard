'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  KeyRound,
  Activity,
  Settings,
  ChevronDown,
  Layers,
} from 'lucide-react';
import Badge from '../ui/Badge';
import { PlanTier } from '@/types';

interface SidebarProps {
  orgSlug: string;
  orgName: string;
  planTier: PlanTier;
  availableOrgs: { slug: string; name: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  orgSlug,
  orgName,
  planTier,
  availableOrgs,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: 'Overview',
      href: `/dashboard/${orgSlug}`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Metered Usage',
      href: `/dashboard/${orgSlug}/usage`,
      icon: Activity,
    },
    {
      label: 'Billing & Plans',
      href: `/dashboard/${orgSlug}/billing`,
      icon: CreditCard,
    },
    {
      label: 'Team & RBAC',
      href: `/dashboard/${orgSlug}/team`,
      icon: Users,
    },
    {
      label: 'API Keys',
      href: `/dashboard/${orgSlug}/api-keys`,
      icon: KeyRound,
    },
    {
      label: 'Settings & SSO',
      href: `/dashboard/${orgSlug}/settings`,
      icon: Settings,
    },
  ];

  const getTierVariant = (tier: PlanTier) => {
    switch (tier) {
      case 'PRO':
        return 'purple';
      case 'TEAM':
        return 'blue';
      case 'ENTERPRISE':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <aside className="w-64 bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 flex-shrink-0 z-20">
      {/* Brand Header & Org Switcher */}
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-100">Micro-SaaS</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">B2B Platform</p>
          </div>
        </div>

        {/* Multi-Tenant Org Switcher */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] uppercase font-semibold text-zinc-500">
              Workspace
            </label>
            <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">{orgName}</span>
          </div>
          <div className="relative">
            <select
              value={orgSlug}
              onChange={(e) => {
                router.push(`/dashboard/${e.target.value}`);
              }}
              className="w-full appearance-none bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-100 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availableOrgs.map((org) => (
                <option key={org.slug} value={org.slug}>
                  {org.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
          Workspace Engine
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Plan Context */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400">Current Plan</span>
          <Badge variant={getTierVariant(planTier)} size="sm">
            {planTier}
          </Badge>
        </div>
        <Link
          href={`/dashboard/${orgSlug}/billing`}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-between pt-1"
        >
          <span>Manage Subscription</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
