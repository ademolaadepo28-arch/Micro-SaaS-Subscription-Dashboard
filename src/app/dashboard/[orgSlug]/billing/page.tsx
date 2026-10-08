'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CreditCard,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Download,
  Building,
  Check,
  RefreshCw,
} from 'lucide-react';
import PricingCards from '@/components/billing/PricingCards';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';
import { PlanTier } from '@/types';
import { PLANS } from '@/lib/constants';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'PAID' | 'PENDING';
  plan: string;
}

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2026-003', date: 'Oct 01, 2026', amount: '$99.00', status: 'PAID', plan: 'Team Plan' },
  { id: 'INV-2026-002', date: 'Sep 01, 2026', amount: '$99.00', status: 'PAID', plan: 'Team Plan' },
  { id: 'INV-2026-001', date: 'Aug 01, 2026', amount: '$99.00', status: 'PAID', plan: 'Team Plan' },
];

export default function BillingPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const { role } = useWorkspace();

  const defaultTier: PlanTier = orgSlug === 'hyperflow-ai' ? 'PRO' : orgSlug === 'devstudio' ? 'FREE' : 'TEAM';
  const [customTiers, setCustomTiers] = useState<Record<string, PlanTier>>({});
  const currentTier = customTiers[orgSlug] ?? defaultTier;

  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Stripe Portal Modal State
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'methods' | 'invoices' | 'details'>('methods');
  const [cardLast4, setCardLast4] = useState('4242');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const canManageBilling = role === 'OWNER' || role === 'BILLING';

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
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug, tier: newTier }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate checkout session');
      }

      if (data.url && !data.url.includes('billing/success')) {
        window.location.href = data.url;
        return;
      }

      setCustomTiers((prev) => ({ ...prev, [orgSlug]: newTier }));
      setNotice({
        message: `Successfully synchronized subscription! Workspace updated to ${PLANS[newTier].name}.`,
        type: 'success',
      });
    } catch (err: unknown) {
      setNotice({
        message: err instanceof Error ? err.message : 'Failed to update subscription tier.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStripePortal = async () => {
    if (!canManageBilling) {
      setNotice({
        message: `RBAC Permission Denied: Only OWNER or BILLING can access Stripe Customer Portal.`,
        type: 'error',
      });
      return;
    }

    try {
      const res = await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug }),
      });
      const data = await res.json();

      // If a real external Stripe hosted URL is configured (e.g. billing.stripe.com)
      if (data.url && data.url.startsWith('https://billing.stripe.com')) {
        window.location.href = data.url;
        return;
      }

      // Otherwise open the interactive simulated Customer Portal modal
      setIsPortalModalOpen(true);
    } catch {
      setIsPortalModalOpen(true);
    }
  };

  const handleSimulateCardUpdate = () => {
    setIsUpdatingCard(true);
    setTimeout(() => {
      setCardBrand(cardBrand === 'Visa' ? 'Mastercard' : 'Visa');
      setCardLast4(cardLast4 === '4242' ? '8899' : '4242');
      setIsUpdatingCard(false);
      setNotice({
        message: 'Payment method updated successfully in Stripe Customer Vault!',
        type: 'success',
      });
    }, 700);
  };

  const handleDownloadInvoice = (invId: string) => {
    setDownloadNotice(`Downloading receipt ${invId}.pdf...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Subscription &amp; Billing</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your Stripe billing lifecycle, tier upgrades, invoices, and payment methods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            id="btn-stripe-customer-portal"
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
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            notice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertOctagon className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
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
              Payment Method
            </span>
            <div className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>{cardBrand} &bull;&bull;&bull;&bull; {cardLast4}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Expires 12/28</p>
          </div>
        </div>
      </Card>

      {/* Tier & Entitlement Matrix */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-zinc-100">Plan Tiers &amp; Entitlements</h3>
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

      {/* Interactive Stripe Customer Portal Modal */}
      <Modal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        title="Stripe Customer Portal"
        description="Self-service subscription and payment methods powered by Stripe Billing."
      >
        <div className="space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 text-xs">
            <button
              onClick={() => setPortalTab('methods')}
              className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer ${
                portalTab === 'methods'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setPortalTab('invoices')}
              className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer ${
                portalTab === 'invoices'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Invoice History
            </button>
            <button
              onClick={() => setPortalTab('details')}
              className={`pb-2.5 px-3 font-medium transition-colors cursor-pointer ${
                portalTab === 'details'
                  ? 'border-b-2 border-indigo-500 text-indigo-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Billing Details
            </button>
          </div>

          {downloadNotice && (
            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 text-xs flex items-center gap-2">
              <Download className="w-4 h-4 animate-bounce" />
              <span>{downloadNotice}</span>
            </div>
          )}

          {/* Payment Methods Tab */}
          {portalTab === 'methods' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100">{cardBrand} ending in {cardLast4}</span>
                      <Badge variant="success" size="sm">Default</Badge>
                    </div>
                    <span className="text-xs text-zinc-400">Expires 12/2028 &bull; 3D Secure Verified</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSimulateCardUpdate}
                  isLoading={isUpdatingCard}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Switch Card
                </Button>
              </div>

              <p className="text-[11px] text-zinc-400">
                All card details are stored directly in PCI-DSS Level 1 compliant Stripe vaults. Micro-SaaS does not store sensitive cardholder data.
              </p>
            </div>
          )}

          {/* Invoices Tab */}
          {portalTab === 'invoices' && (
            <div className="space-y-3">
              <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
                {INITIAL_INVOICES.map((inv) => (
                  <div key={inv.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-800/20 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200">{inv.id}</span>
                        <Badge variant="success" size="sm">{inv.status}</Badge>
                      </div>
                      <span className="text-zinc-400 text-[11px]">{inv.date} &bull; {inv.plan}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-100">{inv.amount}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(inv.id)}
                        title="Download receipt PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-zinc-400 hover:text-indigo-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Details Tab */}
          {portalTab === 'details' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 font-medium">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span>Company Tax &amp; Invoicing Info</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-zinc-500 block">Legal Entity:</span>
                    <span className="text-zinc-200 font-medium">Acme Cloud Dynamics Inc.</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tax / VAT ID:</span>
                    <span className="text-zinc-200 font-mono">US-94-3829104</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500 block">Billing Contact:</span>
                    <span className="text-zinc-200">billing@{orgSlug}.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsPortalModalOpen(false);
                    setNotice({ message: 'Billing info verified and up to date.', type: 'success' });
                  }}
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Save &amp; Close
                </Button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setIsPortalModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

