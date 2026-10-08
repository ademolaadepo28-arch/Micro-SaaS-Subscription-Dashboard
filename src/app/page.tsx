import React from 'react';
import Link from 'next/link';
import {
  Layers,
  CreditCard,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  Users,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-3 group" id="brand-home-link">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              Micro-SaaS Dashboard
            </span>
            <span className="text-[10px] text-zinc-400 block font-mono">SPEC #03 ARCHITECTURE</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            id="nav-health-status"
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-medium text-emerald-400 hover:bg-emerald-900/60 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Container Live</span>
          </Link>

          <Link href="/login" id="nav-btn-signin">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/register" id="nav-btn-register" className="hidden sm:inline-block">
            <Button variant="secondary" size="sm">
              Register
            </Button>
          </Link>

          <Link href="/dashboard/acme-corp" id="nav-btn-launch">
            <Button variant="primary" size="sm">
              Launch App <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 flex-wrap justify-center">
            <Badge variant="purple" size="md">
              <Sparkles className="w-3 h-3 mr-1 inline" /> Multi-Tenant B2B Engine
            </Badge>
            <Badge variant="success" size="md">
              <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Full-Stack Production Container
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.15]">
            Multi-Tenant Subscription &amp; Metered Quota Platform
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Engineered to handle multi-tier plans, dynamic role-based access control (RBAC),
            consumption-based API quotas with automatic soft/hard limits, and idempotent Stripe billing synchronization.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/dashboard/acme-corp" id="hero-btn-acme">
              <Button variant="primary" size="lg">
                Enter Acme Corp (Team Tier) &rarr;
              </Button>
            </Link>
            <Link href="/dashboard/acme-corp/usage" id="hero-btn-usage">
              <Button variant="secondary" size="lg">
                <Activity className="w-4 h-4 mr-1.5 text-indigo-400" />
                Live Metered Telemetry
              </Button>
            </Link>
            <Link href="/register" id="hero-btn-provision">
              <Button variant="outline" size="lg">
                Provision New Tenant
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Organization Selector */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-zinc-100">Live Multi-Tenant Workspaces</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select any pre-configured tenant to test isolated quotas, tier boundaries, and RBAC permissions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Org 1 - Acme Corp */}
            <Card glow={true} className="flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="blue" size="sm">TEAM TIER ($99/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">acme-corp</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Acme Cloud Dynamics</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  High-volume enterprise production workspace. 4 active members, 412,850 of 500,000 monthly API requests.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Allocated Seats:</span>
                    <span className="font-medium text-zinc-200">4 / 20 assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Consumption:</span>
                    <span className="text-amber-400 font-semibold">82% (Soft Warning Limit)</span>
                  </div>
                </div>

                {/* Sub-page quick jump links */}
                <div className="mt-4 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <Link
                    href="/dashboard/acme-corp/usage"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Usage
                  </Link>
                  <Link
                    href="/dashboard/acme-corp/billing"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Billing
                  </Link>
                  <Link
                    href="/dashboard/acme-corp/team"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Team
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/acme-corp" id="card-btn-acme" className="w-full block">
                  <Button variant="primary" className="w-full">
                    Launch Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Org 2 - Hyperflow AI */}
            <Card className="flex flex-col justify-between hover:border-purple-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" size="sm">PRO TIER ($29/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">hyperflow-ai</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Hyperflow AI Labs</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Fast-scaling generative AI startup. 34,200 of 50,000 monthly API quota, 5 team seats, custom webhook ingestion.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Allocated Seats:</span>
                    <span className="font-medium text-zinc-200">1 / 5 assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Consumption:</span>
                    <span className="text-emerald-400 font-semibold">68% (Healthy Quota)</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <Link
                    href="/dashboard/hyperflow-ai/usage"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Usage
                  </Link>
                  <Link
                    href="/dashboard/hyperflow-ai/billing"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Billing
                  </Link>
                  <Link
                    href="/dashboard/hyperflow-ai/team"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Team
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/hyperflow-ai" id="card-btn-hyperflow" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Launch Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Org 3 - DevStudio */}
            <Card className="flex flex-col justify-between hover:border-zinc-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="default" size="sm">FREE TIER ($0/mo)</Badge>
                  <span className="text-xs font-mono text-zinc-500">devstudio</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">DevStudio Indie</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Individual sandbox environment. 1 max team seat, 450 of 1,000 requests with automatic upgrade banners.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Allocated Seats:</span>
                    <span className="font-medium text-amber-400">1 / 1 (Max Capacity)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">API Consumption:</span>
                    <span className="text-emerald-400 font-semibold">45% (Healthy)</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <Link
                    href="/dashboard/devstudio/usage"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Usage
                  </Link>
                  <Link
                    href="/dashboard/devstudio/billing"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Billing
                  </Link>
                  <Link
                    href="/dashboard/devstudio/team"
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    Team
                  </Link>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/dashboard/devstudio" id="card-btn-devstudio" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Launch Workspace &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* 4 Core Architectural Modules */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-zinc-100">Production Feature Architecture</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Direct access into each core module implemented in the dashboard:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/acme-corp/team" className="group">
              <Card className="h-full group-hover:border-indigo-500/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-indigo-300 transition-colors">
                  Multi-Tenant Engine
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Isolates workspaces, member seats, API tokens, and billing contexts with secure tenant slug routing.
                </p>
                <div className="mt-4 text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                  <span>Inspect Team &amp; Workspaces</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/acme-corp/billing" className="group">
              <Card className="h-full group-hover:border-emerald-500/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-emerald-300 transition-colors">
                  Stripe Subscriptions
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Handles automated tier upgrades, plan downgrades, cancellations, and idempotent customer portal sessions.
                </p>
                <div className="mt-4 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>View Billing Engine</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/acme-corp" className="group">
              <Card className="h-full group-hover:border-cyan-500/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-cyan-300 transition-colors">
                  Role-Based Access Control
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Dynamic simulation across OWNER, ADMIN, BILLING, and MEMBER roles with strict action enforcement.
                </p>
                <div className="mt-4 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                  <span>Test RBAC Roles</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/acme-corp/usage" className="group">
              <Card className="h-full group-hover:border-amber-500/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-amber-300 transition-colors">
                  Metered Quota Ingestion
                </h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Real-time telemetry, burst simulation, token-bucket rate limiting headers, and overage calculations.
                </p>
                <div className="mt-4 text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <span>Launch Quota Simulator</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-10 px-4 sm:px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span>Micro-SaaS Subscription Dashboard &bull; Spec #03</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <Link href="/dashboard/acme-corp" className="hover:text-zinc-100 transition-colors">
              Acme Workspace
            </Link>
            <Link href="/api/health" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors flex items-center gap-1">
              Healthcheck <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/api/v1/metrics" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors flex items-center gap-1">
              API Docs <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/login" className="hover:text-zinc-100 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-zinc-100 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
