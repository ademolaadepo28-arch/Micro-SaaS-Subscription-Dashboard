'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertOctagon,
  Plus,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UsageProgressBar from '@/components/billing/UsageProgressBar';
import { PLANS, THRESHOLDS } from '@/lib/constants';
import { PlanTier } from '@/types';

const USAGE_PRESETS: Record<string, { tier: PlanTier; reqs: number; storage: number }> = {
  'hyperflow-ai': { tier: 'PRO', reqs: 34200, storage: 3221225472 },
  'devstudio': { tier: 'FREE', reqs: 450, storage: 45000000 },
  'acme-corp': { tier: 'TEAM', reqs: 412850, storage: 34359738368 },
};

export default function MeteredUsagePage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const defaultData = USAGE_PRESETS[orgSlug] || { tier: 'TEAM' as PlanTier, reqs: 412850, storage: 34359738368 };
  const tier = defaultData.tier;

  const [addedRequests, setAddedRequests] = useState<Record<string, number>>({});
  const [addedStorage, setAddedStorage] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [burstNotice, setBurstNotice] = useState<string | null>(null);

  const currentAdded = addedRequests[orgSlug] ?? 0;
  const currentAddedStorage = addedStorage[orgSlug] ?? 0;

  const apiRequests = defaultData.reqs + currentAdded;
  const storageBytes = defaultData.storage + currentAddedStorage;

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
  const handleSimulateBurst = (count: number, label: string) => {
    setIsSimulating(true);
    setTimeout(() => {
      setAddedRequests((prev) => ({ ...prev, [orgSlug]: (prev[orgSlug] ?? 0) + count }));
      setIsSimulating(false);
      setBurstNotice(`Simulated burst: +${count.toLocaleString()} requests added (${label}).`);
      setTimeout(() => setBurstNotice(null), 3000);
    }, 300);
  };

  const handleSimulateStorage = (bytes: number) => {
    setAddedStorage((prev) => ({ ...prev, [orgSlug]: (prev[orgSlug] ?? 0) + bytes }));
    setBurstNotice(`Simulated storage upload: +${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB added.`);
    setTimeout(() => setBurstNotice(null), 3000);
  };

  const handleReset = () => {
    setAddedRequests((prev) => ({ ...prev, [orgSlug]: 0 }));
    setAddedStorage((prev) => ({ ...prev, [orgSlug]: 0 }));
    setBurstNotice('Reset simulation to baseline metrics.');
    setTimeout(() => setBurstNotice(null), 3000);
  };

  const curlSnippet = `curl -X POST https://micro-saas-subscription-dashboard.fly.dev/api/v1/metrics \\
  -H "Authorization: Bearer ms_live_demo_${orgSlug}" \\
  -H "Content-Type: application/json" \\
  -d '{"metric": "api_requests", "quantity": 100}'`;

  const copyCurlToClipboard = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Metered Usage &amp; Rate Limiting</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time consumption telemetry tracked against plan quotas with soft/hard thresholds and overage enforcement.
          </p>
        </div>

        {/* Live Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="btn-simulate-5k"
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateBurst(5000, 'Batch Ingestion')}
            isLoading={isSimulating}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            +5,000 Reqs
          </Button>

          <Button
            id="btn-simulate-50k"
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateBurst(50000, 'Burst Event')}
            isLoading={isSimulating}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            +50,000 Burst
          </Button>

          <Button
            id="btn-simulate-200k"
            variant="secondary"
            size="sm"
            onClick={() => handleSimulateBurst(150000, 'Surge Load')}
            isLoading={isSimulating}
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-amber-400" />
            +150,000 Surge
          </Button>

          {(currentAdded > 0 || currentAddedStorage > 0) && (
            <Button
              id="btn-reset-usage"
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Reset simulation to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-zinc-400" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Burst Notice Toast */}
      {burstNotice && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <TrendingUp className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>{burstNotice}</span>
        </div>
      )}

      {/* Warning Banners */}
      {isExceeded && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 flex-shrink-0 text-rose-400" />
            <div>
              <p className="font-semibold text-rose-200">Quota Limit Exceeded</p>
              <p className="text-rose-400/80 mt-0.5">
                Current usage is {apiRequests.toLocaleString()} reqs ({overageRequests.toLocaleString()} requests over your {quota.toLocaleString()} plan limit).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold block">
                Estimated Overage
              </span>
              <span className="text-lg font-bold text-rose-100">${overageCost}</span>
            </div>
            <Link href={`/dashboard/${orgSlug}/billing`}>
              <Button variant="danger" size="sm">
                Upgrade Tier <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {isHardWarning && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-200">Critical Hard Warning Threshold (95%+)</p>
              <p className="text-amber-400/80 mt-0.5">
                Workspace is at {percent}% capacity. Further bursts may incur overage fees or rate limiting.
              </p>
            </div>
          </div>
          <Link href={`/dashboard/${orgSlug}/billing`}>
            <Button variant="outline" size="sm">
              Manage Plan
            </Button>
          </Link>
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
              id="btn-simulate-storage"
              variant="outline"
              size="sm"
              onClick={() => handleSimulateStorage(1024 * 1024 * 1024 * 2)} // +2 GB
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              +2 GB Storage Test
            </Button>
          </div>
        </Card>
      </div>

      {/* Ingestion cURL Command Tester Card */}
      <Card>
        <CardHeader
          title="Direct Metered Telemetry Ingestion"
          subtitle="Publish consumption metrics programmatically from your backends"
          action={
            <Button
              id="btn-copy-curl"
              variant="secondary"
              size="sm"
              onClick={copyCurlToClipboard}
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy cURL
                </>
              )}
            </Button>
          }
        />

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] mb-2 font-sans font-medium">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Bash / Terminal Example</span>
          </div>
          <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{curlSnippet}</pre>
        </div>
      </Card>

      {/* Threshold Matrix Table */}
      <Card>
        <CardHeader
          title="Threshold &amp; Overage Policy"
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
                <td className="py-3 px-3">Email notice dispatched to Org Admins &amp; Billing contacts</td>
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

