import React from 'react';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import BillingService from '@/services/billing.service';
import DashboardShell from '@/components/layout/DashboardShell';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}

export default async function OrgDashboardLayout({ children, params }: LayoutProps) {
  const { orgSlug } = await params;
  const org = await db.getOrganizationBySlug(orgSlug);

  if (!org) {
    notFound();
  }

  const allOrgs = await db.getAllOrganizations();
  const availableOrgs = allOrgs.map((o) => ({ slug: o.slug, name: o.name }));
  const tier = BillingService.getPlanTierFromPriceId(org.stripePriceId);

  return (
    <DashboardShell
      orgSlug={org.slug}
      orgName={org.name}
      planTier={tier}
      availableOrgs={availableOrgs}
      initialRole="OWNER"
    >
      {children}
    </DashboardShell>
  );
}
