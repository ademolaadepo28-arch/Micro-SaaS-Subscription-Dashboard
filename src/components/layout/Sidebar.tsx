'use client';

import React, { useEffect } from 'react';
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
  X,
  ExternalLink,
  Home,
} from 'lucide-react';
import Badge from '../ui/Badge';
import { PlanTier } from '@/types';

interface SidebarProps {
  orgSlug: string;
  orgName: string;
  planTier: PlanTier;
  availableOrgs: { slug: string; name: string }[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  orgSlug,
  orgName,
  planTier,
  availableOrgs,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile drawer on route change
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname]);

  const navItems = [
    {
      label: 'Overview',
      href: `/dashboard/${orgSlug}`,
      icon: LayoutDashboard,
      exact: true,
      id: 'nav-overview',
    },
    {
      label: 'Metered Usage',
      href: `/dashboard/${orgSlug}/usage`,
      icon: Activity,
      id: 'nav-usage',
    },
    {
      label: 'Billing & Plans',
      href: `/dashboard/${orgSlug}/billing`,
      icon: CreditCard,
      id: 'nav-billing',
    },
    {
      label: 'Team & RBAC',
      href: `/dashboard/${orgSlug}/team`,
      icon: Users,
      id: 'nav-team',
    },
    {
      label: 'API Keys',
      href: `/dashboard/${orgSlug}/api-keys`,
      icon: KeyRound,
      id: 'nav-api-keys',
    },
    {
      label: 'Settings & SSO',
      href: `/dashboard/${orgSlug}/settings`,
      icon: Settings,
      id: 'nav-settings',
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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/80">
      {/* Brand Header & Org Switcher */}
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">Micro-SaaS</h1>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">B2B Platform</p>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-Tenant Org Switcher */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="org-switcher-select" className="text-[10px] uppercase font-semibold text-zinc-500">
              Workspace Tenant
            </label>
            <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[110px]">{orgSlug}</span>
          </div>
          <div className="relative">
            <select
              id="org-switcher-select"
              value={orgSlug}
              onChange={(e) => {
                router.push(`/dashboard/${e.target.value}`);
              }}
              className="w-full appearance-none bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-100 pr-8 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 cursor-pointer transition-colors"
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
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
          Core Modules
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              id={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm shadow-indigo-950/50'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-1 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
          Portals & Links
        </div>
        <Link
          id="nav-exit-home"
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition-colors"
        >
          <Home className="w-4 h-4 text-zinc-500" />
          <span>Landing Page</span>
        </Link>
        <Link
          id="nav-sign-in"
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-zinc-500" />
          <span>Switch Account / SSO</span>
        </Link>
      </nav>

      {/* Footer / Plan Context */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-400">Current Tier</span>
          <Badge variant={getTierVariant(planTier)} size="sm">
            {planTier}
          </Badge>
        </div>
        <Link
          id="sidebar-upgrade-link"
          href={`/dashboard/${orgSlug}/billing`}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-between pt-1 group"
        >
          <span className="group-hover:underline">Upgrade & Quota Limits</span>
          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-drawer-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        id="mobile-sidebar-drawer"
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
