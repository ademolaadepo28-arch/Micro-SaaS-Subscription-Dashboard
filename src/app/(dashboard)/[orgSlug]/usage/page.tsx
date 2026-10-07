'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Activity,
  HardDrive,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import UsageProgressBar from '@/components/billing/UsageProgressBar';
import { PLANS, THRESHOLDS } from '@/lib/constants';
import { PlanTier } from '@/types';

export default function MeteredUsagePage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [tier, setTier] = useState<PlanTier>('TEAM');
  const [apiRequests, setApiRequests] = useState(412850);
  const [storageBytes, setStorageBytes] = useState(34359738368); // ~32 GB
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (orgSlug === 'hyperflow-ai') {
      setTier('PRO');
      setApiRequests(34200);
      setStorageBytes(3221225472); // ~3 GB
    } else if (orgSlug === 'devstudio') {
      setTier('FREE');
      setApiRequests(450);
      setStorageBytes(45000000); // 45 MB
    } else {
      setTier('TEAM');
      setApiRequests(412850);
      setStorageBytes(34359738368);
    }
  }, [orgSlug]);

  const plan = PLANS[tier];
  const quota = plan.meteredApiQuota;
  const storageQuota = plan.storageQuotaBytes;

  const percent = Math.min(100, Math.round((apiRequests / quota) * 100));
  const isSoftWarning = percent >= THRESHOLDS.SOFT_WARNING_PERCENT && percent < THRESHOLDS.HARD_WARNING_PERCENT;
  const isHardWarning = percent >= THRESHOLDS.HARD_WARNING_PERCENT && apiRequests <= quota;
  const isExceeded = apiRequests > quota;
  const overageRequests = isExceeded ? apiRequests - quota : 0;
  const overageCost = ((overageRequests / 1000) * THRESHOLDS.OVERAGE_FEE_PER_1000_REQS).toFixed(2);

  // Simulation handler
  const handleSimulateBurst = (count: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      setApiRequests((prev) => prev + count);
      setIsSimulating(false);
    }, 400);
  };

  const handleSimulateStorage = (bytes: number) => {
    setStorageBytes((prev) => prev + bytes);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Metered Usage & Rate Limiting</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time consumption telemetry tracked against plan quotas with soft/hard thresholds and overage enforcement.
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateBurst(5000)}
            isLoading={isSimulating}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            +5,000 Ingestion Reqs
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateBurst(50000)}
            isLoading={isSimulating}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            +50,000 Heavy Burst
          </Button>
        </div>
      </div>

      {/* Warning Banners */}
      {isExceeded && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 flex-shrink-0 text-rose-400" />
            <div>
              <p className="font-semibold text-rose-200">Quota Limit Exceeded</p>
              <p className="text-rose-400/80 mt-0.5">
                Current usage is {apiRequests.toLocaleString()} reqs ({overageRequests.toLocaleString()} requests over your {quota.toLocaleString()} plan limit).
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">
              Estimated Overage Charge
            </span>
            <span className="text-lg font-bold text-rose-100">${overageCost}</span>
          </div>
        </div>
      )}

      {isHardWarning && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-200">Critical Hard Warning Threshold (95%+)</p>
            <p className="text-amber-400/80 mt-0.5">
              Workspace is at {percent}% capacity. Further bursts may incur overage fees or rate limiting.
            </p>
          </div>
        </div>
      )}

      {isSoftWarning && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300/90 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold">Soft Limit Warning Triggered (80%+)</p>
            <p className="text-amber-400/80 mt-0.5">
              Workspace reached 80% of plan capacity. An automated alert has been dispatched to your billing contact.
            </p>
          </div>
        </div>
      )}

      {/* Progress Bars Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="API Requests Consumption"
            subtitle={`Plan limit: ${quota.toLocaleString()} requests/month`}
          />
          <div className="pt-2">
            <UsageProgressBar
              label="API Ingestion Requests"
              current={apiRequests}
              max={quota}
              unit="requests"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Used</span>
              <span className="font-bold text-zinc-200">{apiRequests.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Remaining</span>
              <span className="font-bold text-zinc-200">
                {Math.max(0, quota - apiRequests).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Overages</span>
              <span className={`font-bold ${isExceeded ? 'text-rose-400' : 'text-zinc-400'}`}>
                {overageRequests.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Storage Consumption"
            subtitle={`Plan storage limit: ${(storageQuota / (1024 * 1024 * 1024)).toFixed(0)} GB`}
          />
          <div className="pt-2">
            <UsageProgressBar
              label="Encrypted File Storage"
              current={storageBytes}
              max={storageQuota}
              isBytes={true}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Bucket retention: 90 days</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSimulateStorage(1024 * 1024 * 1024 * 2)} // +2 GB
            >
              +2 GB Storage Test
            </Button>
          </div>
        </Card>
      </div>

      {/* Threshold Matrix Table */}
      <Card>
        <CardHeader
          title="Threshold & Overage Policy"
          subtitle="Autonomous monitoring engine policy specification"
        />

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Threshold Level</th>
                <th className="py-2.5 px-3">Percentage Trigger</th>
                <th className="py-2.5 px-3">Engine Action</th>
                <th className="py-2.5 px-3">Billing Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-emerald-400">Normal Range</td>
                <td className="py-3 px-3">0% - 79%</td>
                <td className="py-3 px-3">Standard token bucket processing (60 req/min/token)</td>
                <td className="py-3 px-3">$0.00 (Covered by base plan)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-amber-400">Soft Warning</td>
                <td className="py-3 px-3">80% - 94%</td>
                <td className="py-3 px-3">Email notice dispatched to Org Admins & Billing contacts</td>
                <td className="py-3 px-3">$0.00 (Notice only)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-400">Hard Warning</td>
                <td className="py-3 px-3">95% - 99%</td>
                <td className="py-3 px-3">Dashboard banner flag + Webhook notification event</td>
                <td className="py-3 px-3">Upgrade recommended</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-rose-500">Overage Incurred</td>
                <td className="py-3 px-3">&ge; 100%</td>
                <td className="py-3 px-3">Automated overage increments queued for Stripe invoice</td>
                <td className="py-3 px-3 font-mono font-semibold text-indigo-400">+$0.15 / 1,000 requests</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
