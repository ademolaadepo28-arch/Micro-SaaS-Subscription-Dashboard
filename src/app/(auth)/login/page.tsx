'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah@skynet-defense.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard/acme-corp');
    }, 600);
  };

  const handleDemoLogin = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome Back</h1>
          <p className="text-xs text-zinc-400">Sign in to your Micro-SaaS organization account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                <a href="#" className="text-[11px] text-indigo-400 hover:text-indigo-300">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In to Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick SSO demo buttons */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-2">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">
              Quick Demo Workspaces
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('acme-corp')}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-indigo-500 text-[11px] font-medium text-zinc-300 hover:text-indigo-300 transition-colors text-center"
              >
                Acme Corp (Team)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('hyperflow-ai')}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-indigo-500 text-[11px] font-medium text-zinc-300 hover:text-indigo-300 transition-colors text-center"
              >
                Hyperflow (Pro)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('devstudio')}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-indigo-500 text-[11px] font-medium text-zinc-300 hover:text-indigo-300 transition-colors text-center"
              >
                DevStudio (Free)
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500">
          Need a new workspace?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Register organization &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
