import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Activity,
  CreditCard,
  Users,
  KeyRound,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import db from '@/lib/db';
import BillingService from '@/services/billing.service';
import UsageService from '@/services/usage.service';
import Card, { CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import UsageProgressBar from '@/components/billing/UsageProgressBar';

interface PageProps {
  params: Promise<{ orgSlug: string }>;
}

export default async function DashboardOverviewPage({ params }: PageProps) {
  const { orgSlug } = await params;
  const org = await db.getOrganizationBySlug(orgSlug);

  if (!org) notFound();

  const tier = BillingService.getPlanTierFromPriceId(org.stripePriceId);
  const planInfo = await BillingService.getOrganizationPlan(orgSlug);
  const usageSummary = await UsageService.getUsageSummary(org.id, tier);
  const dailySeries = UsageService.getDailyUsageSeries(usageSummary.apiRequests.used);

  const maxSeriesCount = Math.max(...dailySeries.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">{org.name}</h2>
            <Badge variant="success" size="sm">
              {org.subscriptionStatus}
            </Badge>
            <Badge variant="purple" size="sm">
              {tier} TIER
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Enterprise multi-tenant workspace &bull; Billing renewal on{' '}
            {org.currentPeriodEnd
              ? new Date(org.currentPeriodEnd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/dashboard/${orgSlug}/usage`}>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-1 text-indigo-400" />
              Live Meters
            </Button>
          </Link>
          <Link href={`/dashboard/${orgSlug}/billing`}>
            <Button variant="primary" size="sm">
              <CreditCard className="w-4 h-4 mr-1" />
              Manage Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Usage Card */}
        <Card>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Monthly API Requests</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {usageSummary.apiRequests.used.toLocaleString()}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {usageSummary.apiRequests.percent}% of {usageSummary.apiRequests.limit.toLocaleString()} quota
          </p>
          <div className="mt-3">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, usageSummary.apiRequests.percent)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Team Seats Card */}
        <Card>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Assigned Team Seats</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {org.members.length}{' '}
            <span className="text-sm font-normal text-zinc-500">
              / {planInfo.planConfig.seatLimit === 9999 ? '∞' : planInfo.planConfig.seatLimit}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {planInfo.planConfig.seatLimit - org.members.length} available seats
          </p>
          <div className="mt-3">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (org.members.length / (planInfo.planConfig.seatLimit === 9999 ? 100 : planInfo.planConfig.seatLimit)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </Card>

        {/* API Tokens */}
        <Card>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Active API Keys</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{org.apiKeys.length}</div>
          <p className="text-xs text-zinc-400 mt-1">All keys active and monitored</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Tokens verified healthy
          </div>
        </Card>

        {/* Billing Status */}
        <Card>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Plan Invoicing</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{planInfo.planConfig.priceLabel}</div>
          <p className="text-xs text-emerald-400 mt-1">Automatic Stripe sync</p>
          <div className="mt-3 text-xs text-zinc-400">
            Next invoice: {org.currentPeriodEnd ? new Date(org.currentPeriodEnd).toLocaleDateString() : 'N/A'}
          </div>
        </Card>
      </div>

      {/* Main Metered Progress and Live Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Usage Velocity & Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Metered Request Velocity"
            subtitle="Daily API request consumption across all registered API tokens (last 14 days)"
            action={
              <Badge variant="blue" size="sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live Telemetry
              </Badge>
            }
          />

          {/* SVG / CSS Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end gap-2 pt-6 pb-2">
              {dailySeries.map((d, idx) => {
                const heightPercent = Math.max(12, Math.round((d.count / maxSeriesCount) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-zinc-800 text-zinc-100 text-[10px] py-1 px-2 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20">
                      {d.count.toLocaleString()} reqs ({d.date})
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-indigo-700/60 to-indigo-500 rounded-t-sm group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all duration-200"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-zinc-500 font-mono truncate max-w-full">
                      {d.date.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-xs text-zinc-400">
            <span>Average daily consumption: ~{Math.round(usageSummary.apiRequests.used / 28).toLocaleString()} req/day</span>
            <Link
              href={`/dashboard/${orgSlug}/usage`}
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Deep-dive metrics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Right Col: Quota Limits & Warnings */}
        <Card>
          <CardHeader
            title="Entitlement Limits"
            subtitle="Enforced real-time by token bucket rate limiter"
          />

          <div className="space-y-6 pt-2">
            <UsageProgressBar
              label="API Consumption"
              current={usageSummary.apiRequests.used}
              max={usageSummary.apiRequests.limit}
              unit="reqs"
            />

            <UsageProgressBar
              label="Encrypted Cloud Storage"
              current={usageSummary.storage.used}
              max={usageSummary.storage.limit}
              isBytes={true}
            />

            <div className="p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-800 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 font-medium text-zinc-200">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Rate Limit Protection</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Tokens are throttled at 60 req/min for standard clients with token bucket recovery.
              </p>
              <Link
                href={`/dashboard/${orgSlug}/api-keys`}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold inline-block pt-1"
              >
                Inspect API keys & test console &rarr;
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
