'use client';

import React, { useState } from 'react';
import { Check, Zap, Sparkles, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PLANS } from '@/lib/constants';
import { PlanTier } from '@/types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PricingCardsProps {
  currentTier: PlanTier;
  onSelectTier: (tier: PlanTier) => Promise<void>;
  isLoading?: boolean;
}

export const PricingCards: React.FC<PricingCardsProps> = ({
  currentTier,
  onSelectTier,
  isLoading = false,
}) => {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [pendingTier, setPendingTier] = useState<PlanTier | null>(null);

  const tiers: PlanTier[] = ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'];

  const handleSelect = async (tier: PlanTier) => {
    if (tier === currentTier) return;
    setPendingTier(tier);
    try {
      await onSelectTier(tier);
    } finally {
      setPendingTier(null);
    }
  };

  const getTierIcon = (tier: PlanTier) => {
    switch (tier) {
      case 'FREE':
        return <Zap className="w-5 h-5 text-zinc-400" />;
      case 'PRO':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'TEAM':
        return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'ENTERPRISE':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Monthly / Annual Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${!annualBilling ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}`}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setAnnualBilling(!annualBilling)}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            annualBilling ? 'bg-indigo-600' : 'bg-zinc-700'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              annualBilling ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${annualBilling ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}`}>
            Annual Billing
          </span>
          <Badge variant="success" size="sm">
            Save 20%
          </Badge>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tierKey) => {
          const plan = PLANS[tierKey];
          const isCurrent = currentTier === tierKey;
          const isPending = pendingTier === tierKey;

          // Price calculations
          let displayPrice = plan.monthlyPrice;
          if (annualBilling && plan.monthlyPrice > 0 && tierKey !== 'ENTERPRISE') {
            displayPrice = Math.round(plan.monthlyPrice * 0.8);
          }

          return (
            <div
              key={tierKey}
              className={`relative flex flex-col rounded-2xl p-6 transition-all duration-200 ${
                isCurrent
                  ? 'bg-zinc-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : plan.popular
                  ? 'bg-zinc-900/90 border border-indigo-500/40 hover:border-indigo-400/80 shadow-md'
                  : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="purple" size="sm">
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success" size="sm">
                    Current Plan
                  </Badge>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60">
                  {getTierIcon(tierKey)}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {plan.seatLimit === 9999 ? 'Unlimited Seats' : `${plan.seatLimit} Seat${plan.seatLimit > 1 ? 's' : ''}`}
                </span>
              </div>

              <h4 className="text-xl font-bold text-zinc-100">{plan.name}</h4>

              <div className="mt-3 mb-6">
                <div className="flex items-baseline gap-1">
                  {tierKey === 'ENTERPRISE' ? (
                    <span className="text-3xl font-extrabold text-zinc-100">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-zinc-100">${displayPrice}</span>
                      <span className="text-xs text-zinc-400">/ month</span>
                    </>
                  )}
                </div>
                {annualBilling && plan.monthlyPrice > 0 && tierKey !== 'ENTERPRISE' && (
                  <p className="text-xs text-emerald-400 mt-1">Billed annually (${displayPrice * 12}/yr)</p>
                )}
              </div>

              {/* Core Limits */}
              <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-800 space-y-1.5 text-xs text-zinc-300 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">API Quota:</span>
                  <span className="font-semibold">{plan.meteredApiQuota.toLocaleString()} req/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Seats:</span>
                  <span className="font-semibold">{plan.seatLimit === 9999 ? 'Unlimited' : plan.seatLimit}</span>
                </div>
              </div>

              {/* Entitlements */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.entitlements.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div>
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full group"
                    isLoading={isPending}
                    onClick={() => handleSelect(tierKey)}
                  >
                    <span>{tierKey === 'FREE' ? 'Downgrade to Free' : `Upgrade to ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingCards;
