import React from 'react';
import Link from 'next/link';
import {
  Layers,
  CreditCard,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight">Micro-SaaS Dashboard</span>
            <span className="text-[10px] text-zinc-400 block font-mono">SPEC #03 PORTFOLIO ARCHITECTURE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard/acme-corp">
            <Button variant="primary" size="sm">
              Launch Demo Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2">
            <Badge variant="purple" size="md">
              Full-Stack Architecture Spec #03
            </Badge>
            <Badge variant="success" size="md">
              Production Blueprint
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100">
            Multi-Tenant B2B Subscription &amp; Metered Usage Engine
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Engineered to handle multi-tier subscriptions, role-based team management (RBAC),
            metered API usage quotas with soft/hard warning limits, and automated billing synchronization via Stripe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/acme-corp">
              <Button variant="primary" size="lg">
                Enter Acme Corp (Team Tier) &rarr;
              </Button>
            </Link>
            <Link href="/dashboard/acme-corp/usage">
              <Button variant="secondary" size="lg">
                Inspect Metered Telemetry
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Organization Selector */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-100">Live Multi-Tenant Workspaces</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select any pre-configured tenant to test isolated contexts, tier limits, and RBAC roles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Org 1 */}
            <Card glow={true} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="blue" size="sm">TEAM TIER ($99/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">acme-corp</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Acme Cloud Dynamics</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  High volume production tenant. 4 active members, 412k / 500k API requests, soft warning limit active.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Seats:</span>
                    <span>4 / 20 assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Quota:</span>
                    <span className="text-amber-400 font-semibold">82% (Soft Warning)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/acme-corp" className="w-full block">
                  <Button variant="primary" className="w-full">
                    Open Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Org 2 */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" size="sm">PRO TIER ($29/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">hyperflow-ai</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Hyperflow AI Labs</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Growing AI studio. 34.2k / 50k API quota, 5 team seats, custom webhook integration enabled.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Seats:</span>
                    <span>1 / 5 assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Quota:</span>
                    <span className="text-emerald-400 font-semibold">68% (Healthy)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/hyperflow-ai" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Open Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Org 3 */}
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="default" size="sm">FREE TIER ($0/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">devstudio</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">DevStudio Indie</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Developer sandbox. 1 seat limit, 450 / 1,000 monthly request quota with upgrade prompts.
                </p>

                <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs space-y-1 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Seats:</span>
                    <span>1 / 1 (Maxed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Quota:</span>
                    <span className="text-emerald-400 font-semibold">45% (Healthy)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/devstudio" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Open Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* 4 Core Pillars from Spec */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-100">Core Feature Architecture</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Aligned with Section 2 of the Architecture Specification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-zinc-100 text-sm">Multi-Tenant Workspace Engine</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Organizations isolate users, team seats, API keys, and billing contexts. Supports SSO and team invite tokens with expiration limits.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-zinc-100 text-sm">Stripe Billing &amp; Webhooks</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Handles tier upgrades, downgrades, cancellations, prorated billing, and automated grace periods via idempotent Stripe webhook processing.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-zinc-100 text-sm">Role-Based Access Control</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Strict access levels (OWNER, ADMIN, MEMBER, BILLING) governing seat management, API token creation, and payment settings.
              </p>
            </Card>

            <Card>
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-zinc-100 text-sm">Metered Usage &amp; Rate Limiting</h4>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Tracks consumption metrics (API requests, storage bytes) against plan quotas with real-time soft/hard warning limits and automated overage billing.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-6 text-center text-xs text-zinc-500">
        <p>Micro-SaaS Subscription Dashboard &bull; Portfolio Project Architecture Spec #03</p>
      </footer>
    </div>
  );
}
