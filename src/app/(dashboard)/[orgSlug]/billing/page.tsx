'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, ExternalLink, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import PricingCards from '@/components/billing/PricingCards';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useWorkspace } from '@/context/WorkspaceContext';
import { PlanTier, Organization } from '@/types';
import { PLANS } from '@/lib/constants';

export default function BillingPage() {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params.orgSlug as string;
  const { role } = useWorkspace();

  const [currentTier, setCurrentTier] = useState<PlanTier>('TEAM');
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const canManageBilling = role === 'OWNER' || role === 'BILLING';

  useEffect(() => {
    // Determine tier based on active workspace
    if (orgSlug === 'hyperflow-ai') setCurrentTier('PRO');
    else if (orgSlug === 'devstudio') setCurrentTier('FREE');
    else setCurrentTier('TEAM');
  }, [orgSlug]);

  const handleSelectTier = async (newTier: PlanTier) => {
    if (!canManageBilling) {
      setNotice({
        message: `RBAC Permission Denied: Your simulated role is '${role}'. Only OWNER or BILLING roles can alter Stripe subscription tiers.`,
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setNotice(null);

    try {
      // Simulate Stripe checkout or instant tier update
      await new Promise((r) => setTimeout(r, 800));
      setCurrentTier(newTier);
      setNotice({
        message: `Successfully synchronized subscription! Workspace updated to ${PLANS[newTier].name}.`,
        type: 'success',
      });
    } catch (err: any) {
      setNotice({
        message: err?.message || 'Failed to update subscription tier.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStripePortal = () => {
    if (!canManageBilling) {
      setNotice({
        message: `RBAC Permission Denied: Only OWNER or BILLING can access Stripe Customer Portal.`,
        type: 'error',
      });
      return;
    }
    setNotice({
      message: 'Simulated Stripe Customer Portal: In production, redirects to billing.stripe.com/p/session.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Subscription & Billing</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your Stripe billing lifecycle, tier upgrades, invoices, and payment methods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenStripePortal}
            disabled={!canManageBilling}
          >
            <CreditCard className="w-4 h-4 mr-1 text-indigo-400" />
            Stripe Customer Portal
            <ExternalLink className="w-3.5 h-3.5 ml-1 text-zinc-500" />
          </Button>
        </div>
      </div>

      {/* Role Alert if Read-Only */}
      {!canManageBilling && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold">Read-Only Billing View</p>
            <p className="text-amber-400/80 mt-0.5">
              You are simulating role <strong>{role}</strong>. Tier modifications and payment configurations are restricted to <strong>OWNER</strong> and <strong>BILLING</strong> roles.
            </p>
          </div>
        </div>
      )}

      {/* Status Notice */}
      {notice && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertOctagon className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Current Subscription Card */}
      <Card>
        <CardHeader
          title="Active Subscription Overview"
          subtitle="Real-time Stripe synchronization and entitlements"
          action={
            <Badge variant="success" size="sm">
              ACTIVE STATUS
            </Badge>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Active Tier
            </span>
            <div className="text-lg font-bold text-zinc-100">{PLANS[currentTier].name}</div>
            <p className="text-xs text-zinc-400 mt-1">{PLANS[currentTier].priceLabel}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Next Invoice Date
            </span>
            <div className="text-lg font-bold text-zinc-100">Nov 1, 2026</div>
            <p className="text-xs text-emerald-400 mt-1">Automatic renewal</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Stripe Customer ID
            </span>
            <div className="text-xs font-mono font-medium text-zinc-300 truncate">
              cus_N94h8A0K2mLp
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Mapped via Webhook</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Grace Period Protection
            </span>
            <div className="text-xs font-semibold text-emerald-400">72-Hour Retry Grace</div>
            <p className="text-[11px] text-zinc-500 mt-1">Idempotent Webhook Listener</p>
          </div>
        </div>
      </Card>

      {/* Tier & Entitlement Matrix */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-zinc-100">User Tier & Entitlement Matrix</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Switch plans anytime. Upgrades are prorated immediately; downgrades take effect at the end of the current billing cycle.
          </p>
        </div>

        <PricingCards
          currentTier={currentTier}
          onSelectTier={handleSelectTier}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
