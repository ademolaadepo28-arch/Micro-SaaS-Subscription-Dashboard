import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SuccessPageProps {
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<{ session_id?: string; tier?: string }>;
}

export default async function BillingSuccessPage({ params, searchParams }: SuccessPageProps) {
  const { orgSlug } = await params;
  const { session_id, tier } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <Card className="p-8">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto mb-6 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-zinc-100">Subscription Updated Successfully!</h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Your workspace tier has been upgraded to <strong>{tier || 'PRO'}</strong>. All plan entitlements, increased API rate limits, and seat allocations are now immediately active.
        </p>

        {session_id && (
          <div className="my-6 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 inline-block">
            Stripe Session: {session_id}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-left p-4 my-6 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Prorated billing calculated</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Quotas expanded in real-time</span>
          </div>
        </div>

        <div className="pt-2">
          <Link href={`/dashboard/${orgSlug}/billing`}>
            <Button variant="primary">
              Return to Billing Overview <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
