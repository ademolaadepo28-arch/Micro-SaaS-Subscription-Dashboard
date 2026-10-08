'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext';
import { PlanTier, Role } from '@/types';

interface DashboardShellProps {
  children: React.ReactNode;
  orgSlug: string;
  orgName: string;
  planTier: PlanTier;
  availableOrgs: { slug: string; name: string }[];
  initialRole?: Role;
}

function InnerShell({
  children,
  orgSlug,
  orgName,
  planTier,
  availableOrgs,
}: {
  children: React.ReactNode;
  orgSlug: string;
  orgName: string;
  planTier: PlanTier;
  availableOrgs: { slug: string; name: string }[];
}) {
  const { role, setRole } = useWorkspace();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans">
      <Sidebar
        orgSlug={orgSlug}
        orgName={orgName}
        planTier={planTier}
        availableOrgs={availableOrgs}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentRole={role}
          onRoleChange={setRole}
          orgName={orgName}
          orgSlug={orgSlug}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  orgSlug,
  orgName,
  planTier,
  availableOrgs,
  initialRole = 'OWNER',
}) => {
  return (
    <WorkspaceProvider
      initialRole={initialRole}
      orgSlug={orgSlug}
      orgName={orgName}
    >
      <InnerShell
        orgSlug={orgSlug}
        orgName={orgName}
        planTier={planTier}
        availableOrgs={availableOrgs}
      >
        {children}
      </InnerShell>
    </WorkspaceProvider>
  );
};

export default DashboardShell;
