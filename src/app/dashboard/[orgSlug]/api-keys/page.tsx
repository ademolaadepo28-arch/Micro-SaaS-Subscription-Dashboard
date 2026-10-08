'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Copy, Check, Trash2, ShieldCheck, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { useWorkspace } from '@/context/WorkspaceContext';
import { ApiKey } from '@/types';

const INITIAL_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Ingestion Service',
    key: 'ms_live_49f8a20bc9e1458890cd1a97f26',
    lastUsedAt: new Date('2026-10-07T18:55:00Z'),
    expiresAt: new Date('2027-01-01'),
    organizationId: 'org_1',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'key_2',
    name: 'Staging CI/CD Pipeline',
    key: 'ms_test_901cbf540a82771de99c3321ba',
    lastUsedAt: new Date('2026-10-07T18:25:00Z'),
    expiresAt: new Date('2026-12-31'),
    organizationId: 'org_1',
    createdAt: new Date('2026-02-01'),
  },
];

export default function ApiKeysPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const { role } = useWorkspace();

  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Revoke confirmation modal
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Live API Tester State
  const [testQuantity, setTestQuantity] = useState(1);
  const [testResponse, setTestResponse] = useState<Record<string, unknown> | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const canManageKeys = role === 'OWNER' || role === 'ADMIN';

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    const secretKey = `ms_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKeyObj: ApiKey = {
      id: `key_${Date.now()}`,
      name: keyName,
      key: secretKey,
      lastUsedAt: null,
      expiresAt: new Date(Date.now() + 365 * 86400 * 1000),
      organizationId: 'org_1',
      createdAt: new Date(),
    };

    setKeys([newKeyObj, ...keys]);
    setCreatedKey(secretKey);
    setKeyName('');
    showToast(`Created API key "${keyName}" successfully.`);
  };

  const confirmRevokeKey = () => {
    if (!keyToRevoke) return;
    setKeys(keys.filter((k) => k.id !== keyToRevoke.id));
    showToast(`Revoked API key "${keyToRevoke.name}".`);
    setKeyToRevoke(null);
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Test metered API endpoint
  const handleTestApi = async () => {
    setIsTesting(true);
    try {
      const activeKey = keys[0]?.key || 'ms_live_demo';
      const res = await fetch('/api/v1/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`,
          'x-org-slug': orgSlug,
        },
        body: JSON.stringify({
          metric: 'api_requests',
          quantity: testQuantity,
        }),
      });
      const data = await res.json();
      setTestStatus(res.status);
      setTestResponse({
        status: res.status,
        headers: {
          'x-ratelimit-limit': res.headers.get('x-ratelimit-limit') || '60',
          'x-ratelimit-remaining': res.headers.get('x-ratelimit-remaining') || '59',
        },
        body: data,
      });
      showToast(`Dispatched ${testQuantity} request(s) - Status ${res.status}`);
    } catch (err: unknown) {
      setTestStatus(500);
      setTestResponse({
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">API Credentials &amp; Keys</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Authenticate external ingestion and SDK queries with isolated organizational bearer tokens.
          </p>
        </div>

        <div>
          <Button
            id="btn-create-api-key"
            variant="primary"
            size="sm"
            onClick={() => {
              setCreatedKey(null);
              setIsCreateModalOpen(true);
            }}
            disabled={!canManageKeys}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create API Key
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {!canManageKeys && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <span>
            Simulating role <strong>{role}</strong>: Only <strong>OWNER</strong> and <strong>ADMIN</strong> roles are permitted to generate or revoke API keys.
          </span>
        </div>
      )}

      {/* Keys Table */}
      <Card>
        <CardHeader
          title="Active Bearer Tokens"
          subtitle="Enforced by token bucket rate limiter (60 req/min/key)"
        />

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Token Name</th>
                <th className="py-2.5 px-3">API Key Prefix</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-zinc-100">{k.name}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[11px]">
                        {k.key.substring(0, 10)}&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                      </span>
                      <button
                        onClick={() => copyToClipboard(k.key, k.id)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Copy Key Token"
                      >
                        {copiedKey === k.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleTimeString() : 'Never used'}
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {canManageKeys ? (
                      <button
                        onClick={() => setKeyToRevoke(k)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-zinc-600 italic">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Live Interactive API Tester Console */}
      <Card>
        <CardHeader
          title="Interactive Metered Endpoint Tester"
          subtitle="Test external endpoint POST /api/v1/metrics with simulated bearer authentication"
          action={
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-zinc-950 border border-zinc-800 p-0.5 text-xs">
                {[1, 10, 50].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setTestQuantity(qty)}
                    className={`px-2 py-1 rounded font-mono text-[11px] cursor-pointer transition-colors ${
                      testQuantity === qty
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    +{qty}
                  </button>
                ))}
              </div>
              <Button
                id="btn-dispatch-test-api"
                variant="primary"
                size="sm"
                onClick={handleTestApi}
                isLoading={isTesting}
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Dispatch API Request
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2">
            <span className="text-zinc-500 block uppercase font-bold text-[10px]">Request Preview</span>
            <div className="text-emerald-400">POST /api/v1/metrics HTTP/1.1</div>
            <div className="text-zinc-400">Host: micro-saas-subscription-dashboard.fly.dev</div>
            <div className="text-zinc-400 truncate">
              Authorization: Bearer {keys[0]?.key || 'ms_live_demo...'}
            </div>
            <div className="text-zinc-400">x-org-slug: {orgSlug}</div>
            <div className="text-zinc-400">Content-Type: application/json</div>
            <div className="text-indigo-400 pt-1">
              &#123;&quot;metric&quot;: &quot;api_requests&quot;, &quot;quantity&quot;: {testQuantity}&#125;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase font-bold text-[10px]">Response Payload</span>
              {testStatus && (
                <Badge variant={testStatus === 200 ? 'success' : 'danger'} size="sm">
                  HTTP {testStatus}
                </Badge>
              )}
            </div>
            {testResponse ? (
              <pre className="text-zinc-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            ) : (
              <div className="text-zinc-600 italic pt-4">
                Click &quot;Dispatch API Request&quot; to test metered increment and inspect response headers.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Revoke Confirmation Modal */}
      <Modal
        isOpen={Boolean(keyToRevoke)}
        onClose={() => setKeyToRevoke(null)}
        title="Revoke API Key"
        description="Are you sure you want to revoke this secret credential?"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
            Any applications or services using <strong>{keyToRevoke?.name}</strong> will immediately fail with HTTP 401 Unauthorized. This action cannot be undone.
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
            <Button variant="ghost" size="sm" onClick={() => setKeyToRevoke(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmRevokeKey}>
              Confirm Revoke
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Key Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={createdKey ? 'API Key Generated' : 'Create New API Key'}
        description={
          createdKey
            ? 'Please copy your secret key now. You will not be able to view it again.'
            : 'Enter a descriptive identifier for your new API credential.'
        }
      >
        {createdKey ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Store this key securely. It grants external programmatic access.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Secret Token</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdKey}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200"
                />
                <Button variant="secondary" size="sm" onClick={() => copyToClipboard(createdKey, 'modal-key')}>
                  {copiedKey === 'modal-key' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="primary" onClick={() => setIsCreateModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Key Name</label>
              <input
                type="text"
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Production Data Ingestion"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800/80">
              <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Key
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

