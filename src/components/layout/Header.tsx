'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Menu,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  LogOut,
  User,
  Activity,
  Check,
} from 'lucide-react';
import { Role } from '@/types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  orgName: string;
  orgSlug?: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  orgName,
  orgSlug = 'acme-corp',
  onToggleMobileMenu,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const mockNotifications = [
    {
      id: 1,
      title: 'Quota Warning Threshold (82%)',
      message: 'Monthly API ingestion reached 412,850 of 500,000 requests.',
      time: '12m ago',
      type: 'warning',
      href: `/dashboard/${orgSlug}/usage`,
    },
    {
      id: 2,
      title: 'Stripe Invoice Paid ($99.00)',
      message: 'Team plan renewal synchronized via Stripe webhook.',
      time: '2h ago',
      type: 'success',
      href: `/dashboard/${orgSlug}/billing`,
    },
    {
      id: 3,
      title: 'New Member Invitation Accepted',
      message: 'Alex Rivera (ADMIN) joined the workspace.',
      time: '1d ago',
      type: 'info',
      href: `/dashboard/${orgSlug}/team`,
    },
  ];

  const unreadCount = mockNotifications.filter((n) => !readNotifications.includes(n.id)).length;

  const markAllRead = () => {
    setReadNotifications(mockNotifications.map((n) => n.id));
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Workspace Context */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu-toggle"
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">Workspace:</span>
          <span className="text-sm font-semibold text-zinc-200 truncate max-w-[140px] sm:max-w-none">
            {orgName}
          </span>
          <Link
            id="header-live-health-pill"
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            title="Live container healthcheck status (Click to inspect)"
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-medium text-emerald-400 hover:bg-emerald-900/60 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Healthy</span>
          </Link>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Live RBAC Role Testing Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900/90 border border-zinc-700/80 rounded-lg px-2 sm:px-3 py-1.5 shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="text-[11px] text-zinc-400 hidden md:inline">RBAC:</span>
          <select
            id="rbac-role-simulator-select"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="bg-transparent text-xs font-semibold text-indigo-400 focus:outline-none cursor-pointer pr-1"
            title="Simulate role permissions dynamically"
          >
            <option value="OWNER" className="bg-zinc-900 text-zinc-100">
              OWNER (Full Admin)
            </option>
            <option value="ADMIN" className="bg-zinc-900 text-zinc-100">
              ADMIN (Team &amp; Keys)
            </option>
            <option value="BILLING" className="bg-zinc-900 text-zinc-100">
              BILLING (Stripe Only)
            </option>
            <option value="MEMBER" className="bg-zinc-900 text-zinc-100">
              MEMBER (Read-Only)
            </option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {notificationsOpen && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-3 z-50 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-100">Activity Telemetry</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => {
                  const isRead = readNotifications.includes(notif.id);
                  return (
                    <Link
                      key={notif.id}
                      href={notif.href}
                      onClick={() => setNotificationsOpen(false)}
                      className={`block p-2.5 rounded-lg border transition-colors ${
                        isRead
                          ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1.5 text-zinc-100">
                          {notif.type === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          )}
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-zinc-500">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{notif.message}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            id="btn-header-profile"
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-zinc-800 group cursor-pointer"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-700 to-cyan-600 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-900/50 group-hover:scale-105 transition-transform">
              SC
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                Sarah Connor
              </p>
              <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">
                {currentRole}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div
              id="profile-popover"
              className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="p-2 border-b border-zinc-800 mb-1">
                <p className="font-semibold text-zinc-100">Sarah Connor</p>
                <p className="text-[11px] text-zinc-400">sarah@skynet-defense.io</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60 text-[10px] font-mono text-indigo-300">
                  Role: {currentRole}
                </span>
              </div>
              <Link
                href={`/dashboard/${orgSlug}/settings`}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Account &amp; Security</span>
              </Link>
              <Link
                href={`/dashboard/${orgSlug}/usage`}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-zinc-400" />
                <span>Usage Telemetry</span>
              </Link>
              <Link
                href="/"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>Public Landing Page</span>
              </Link>
              <div className="border-t border-zinc-800 my-1" />
              <Link
                href="/login"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
