'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function SettingsPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const { role, orgName } = useWorkspace();

  const [name, setName] = useState(orgName);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/demo-endpoint');
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const canEditSettings = role === 'OWNER' || role === 'ADMIN';
  const canDeleteOrg = role === 'OWNER';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Workspace Settings & SSO</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configure multi-tenant isolation, enterprise single-sign-on, and security policies.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Workspace configuration saved successfully!</span>
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader
          title="General Workspace Profile"
          subtitle="Identifies your organization across invitations and billing invoices"
        />

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canEditSettings}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Workspace Slug</label>
            <div className="flex items-center">
              <span className="bg-zinc-900 border border-r-0 border-zinc-800 rounded-l-lg px-3 py-2 text-xs text-zinc-500 font-mono">
                app.microsaas.dev/
              </span>
              <input
                type="text"
                disabled
                value={orgSlug}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-r-lg px-3 py-2 text-xs font-mono text-zinc-400 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-zinc-500">Slugs are immutable to prevent routing conflicts.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Outbound Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={!canEditSettings}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <p className="text-[11px] text-zinc-500">Dispatches real-time quota warnings and invoice status events.</p>
          </div>

          {canEditSettings && (
            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Enterprise Single Sign-On */}
      <Card>
        <CardHeader
          title="Enterprise SSO (SAML & OIDC)"
          subtitle="Enforce corporate identity provider authentication (Okta, Azure AD, Google Workspace)"
          action={
            <Badge variant="blue" size="sm">
              TEAM & ENTERPRISE
            </Badge>
          }
        />

        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
          <div>
            <p className="text-sm font-semibold text-zinc-200">Enforce SAML Single Sign-On</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Require all members to authenticate through your corporate Identity Provider.
            </p>
          </div>
          <button
            type="button"
            onClick={() => canEditSettings && setSsoEnabled(!ssoEnabled)}
            disabled={!canEditSettings}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              ssoEnabled ? 'bg-indigo-600' : 'bg-zinc-700'
            } disabled:opacity-50`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                ssoEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="border border-rose-900/60 rounded-xl p-5 bg-rose-950/20">
        <div className="flex items-center gap-2 mb-2 text-rose-400 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs text-rose-300/80 mb-4 leading-relaxed">
          Deleting a workspace purges all team memberships, API credentials, and cancels the connected Stripe subscription immediately.
        </p>
        <Button
          variant="danger"
          size="sm"
          disabled={!canDeleteOrg}
          onClick={() => alert('Only the organization OWNER can delete this workspace.')}
        >
          Delete Workspace
        </Button>
        {!canDeleteOrg && (
          <p className="text-[11px] text-zinc-500 mt-2">
            Workspace deletion is strictly restricted to the <strong>OWNER</strong> role. (Currently simulating {role})
          </p>
        )}
      </div>
    </div>
  );
}
