'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Copy, Check, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const { role, orgName } = useWorkspace();

  const [name, setName] = useState(orgName);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/demo-endpoint');
  const [webhookSecret, setWebhookSecret] = useState(`whsec_${orgSlug}_${Math.random().toString(36).substring(2, 10)}`);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [ssoTested, setSsoTested] = useState(false);
  const [isTestingSso, setIsTestingSso] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Danger zone modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmSlugInput, setConfirmSlugInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const canEditSettings = role === 'OWNER' || role === 'ADMIN';
  const canDeleteOrg = role === 'OWNER';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Workspace profile & webhook configurations updated successfully!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleRotateSecret = () => {
    const newSec = `whsec_${orgSlug}_${Math.random().toString(36).substring(2, 12)}`;
    setWebhookSecret(newSec);
    setSavedNotice('Rotated webhook signing secret. Ensure consuming endpoints update their verification keys.');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleTestSso = () => {
    setIsTestingSso(true);
    setTimeout(() => {
      setIsTestingSso(false);
      setSsoTested(true);
      setTimeout(() => setSsoTested(false), 3000);
    }, 700);
  };

  const handleDeleteWorkspace = () => {
    if (confirmSlugInput !== orgSlug) return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Workspace Settings &amp; SSO</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configure multi-tenant isolation, enterprise single-sign-on, and security policies.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{savedNotice}</span>
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
                micro-saas-subscription-dashboard.fly.dev/dashboard/
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

          {/* Webhook Signing Secret */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-zinc-300">Webhook Signature Secret</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={webhookSecret}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopySecret}
                title="Copy webhook secret"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              {canEditSettings && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRotateSecret}
                  title="Rotate webhook secret"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Rotate
                </Button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">Used to sign payloads with HMAC-SHA256 headers.</p>
          </div>

          {canEditSettings && (
            <div className="pt-2 flex justify-end">
              <Button id="btn-save-settings" type="submit" variant="primary">
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
              TEAM &amp; ENTERPRISE
            </Badge>
          }
        />

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <div>
              <p className="text-sm font-semibold text-zinc-200">Enforce SAML Single Sign-On</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Require all members to authenticate through your corporate Identity Provider.
              </p>
            </div>
            <button
              id="btn-toggle-sso"
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

          {ssoEnabled && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  SAML Service Provider (SP) Metadata
                </span>
                <Button
                  id="btn-test-sso"
                  variant="outline"
                  size="sm"
                  onClick={handleTestSso}
                  isLoading={isTestingSso}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Test SSO Handshake
                </Button>
              </div>

              {ssoTested && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SAML 2.0 handshake verified successfully against simulated IdP metadata.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                <div>
                  <span className="text-zinc-500 block mb-0.5">Assertion Consumer Service (ACS) URL:</span>
                  <span className="font-mono text-zinc-300 bg-zinc-900 p-1.5 rounded border border-zinc-800 block truncate">
                    https://micro-saas-subscription-dashboard.fly.dev/api/auth/callback/saml
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">Entity ID (Audience URI):</span>
                  <span className="font-mono text-zinc-300 bg-zinc-900 p-1.5 rounded border border-zinc-800 block truncate">
                    urn:microsaas:tenant:{orgSlug}
                  </span>
                </div>
              </div>
            </div>
          )}
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
          id="btn-delete-workspace"
          variant="danger"
          size="sm"
          disabled={!canDeleteOrg}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Workspace
        </Button>
        {!canDeleteOrg && (
          <p className="text-[11px] text-zinc-500 mt-2">
            Workspace deletion is strictly restricted to the <strong>OWNER</strong> role. (Currently simulating {role})
          </p>
        )}
      </div>

      {/* Delete Workspace Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Workspace Confirmation"
        description="This action cannot be undone. All data will be permanently wiped."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs leading-relaxed">
            Please type <strong className="font-mono text-white">{orgSlug}</strong> below to confirm deletion of this workspace.
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Confirmation Slug</label>
            <input
              type="text"
              value={confirmSlugInput}
              onChange={(e) => setConfirmSlugInput(e.target.value)}
              placeholder={orgSlug}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={confirmSlugInput !== orgSlug}
              isLoading={isDeleting}
              onClick={handleDeleteWorkspace}
            >
              Permanently Delete Workspace
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

