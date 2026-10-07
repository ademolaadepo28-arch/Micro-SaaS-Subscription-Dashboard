'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, Building, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOrgNameChange = (val: string) => {
    setOrgName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/dashboard/acme-corp`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Create Workspace</h1>
          <p className="text-xs text-zinc-400">Launch a multi-tenant B2B subscription account</p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Organization Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Acme Enterprise"
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Workspace Slug</label>
              <div className="flex items-center">
                <span className="bg-zinc-950 border border-r-0 border-zinc-800 rounded-l-lg px-3 py-2 text-xs text-zinc-500 font-mono">
                  app.dev/
                </span>
                <input
                  type="text"
                  required
                  placeholder="acme-enterprise"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-r-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="founder@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Provision Workspace &rarr;
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-zinc-500">
          Already registered?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
