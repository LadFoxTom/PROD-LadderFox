'use client';

import { useState, useEffect } from 'react';

interface ConsentConfig {
  enabled: boolean;
  consentText: string;
  privacyPolicyUrl: string | null;
  retentionDays: number;
}

interface DeletionRequest {
  id: string;
  email: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  processedBy: string | null;
  notes: string | null;
}

export function GdprTab() {
  const [config, setConfig] = useState<ConsentConfig>({
    enabled: false,
    consentText: 'I consent to the processing of my personal data for recruitment purposes.',
    privacyPolicyUrl: null,
    retentionDays: 365,
  });
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadConfig = () => {
    fetch('/api/v1/gdpr/consent-config')
      .then((r) => r.json())
      .then((data) => setConfig(data.config))
      .catch(() => {});
  };

  const loadRequests = () => {
    fetch('/api/v1/gdpr/deletion-requests')
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []))
      .catch(() => {});
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/gdpr/consent-config').then((r) => r.json()),
      fetch('/api/v1/gdpr/deletion-requests').then((r) => r.json()),
    ])
      .then(([configData, requestsData]) => {
        setConfig(configData.config);
        setRequests(requestsData.requests || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    setSaved(false);
    await fetch('/api/v1/gdpr/consent-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRequest = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    await fetch(`/api/v1/gdpr/deletion-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setProcessingId(null);
    loadRequests();
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />;
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const processedRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Consent Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph ph-shield-check text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Consent Configuration</h3>
        </div>
        <p className="text-sm text-[#64748B] mb-6">
          Configure GDPR consent for candidate data collection. When enabled, candidates must accept before submitting applications.
        </p>

        <div className="space-y-5">
          {/* Enable toggle */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 relative ${
                config.enabled ? 'bg-[#4F46E5]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  config.enabled ? 'translate-x-5' : ''
                }`}
              />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#1E293B]">Enable Consent Collection</span>
              <p className="text-xs text-[#64748B]">Show consent checkbox on application forms</p>
            </div>
          </div>

          {config.enabled && (
            <>
              {/* Consent Text */}
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1">Consent Text</label>
                <textarea
                  value={config.consentText}
                  onChange={(e) => setConfig({ ...config, consentText: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
                  placeholder="I consent to the processing of my personal data..."
                />
              </div>

              {/* Privacy Policy URL */}
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1">Privacy Policy URL</label>
                <input
                  type="url"
                  value={config.privacyPolicyUrl || ''}
                  onChange={(e) => setConfig({ ...config, privacyPolicyUrl: e.target.value || null })}
                  placeholder="https://yoursite.com/privacy"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
                <p className="text-xs text-[#94A3B8] mt-1">Link displayed alongside the consent text</p>
              </div>

              {/* Retention Days */}
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1">Data Retention Period</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={30}
                    max={3650}
                    value={config.retentionDays}
                    onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) || 365 })}
                    className="w-28 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  />
                  <span className="text-sm text-[#64748B]">days</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">How long candidate data is retained before automatic cleanup</p>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={saveConfig}
              disabled={saving}
              className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-[#4338CA] transition-colors"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            {saved && (
              <span className="text-sm text-[#16A34A] font-medium flex items-center gap-1">
                <i className="ph ph-check-circle" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Deletion Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph ph-trash text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Data Deletion Requests</h3>
          {pendingRequests.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#FEF3C7] text-[#D97706]">
              {pendingRequests.length} pending
            </span>
          )}
        </div>
        <p className="text-sm text-[#64748B] mb-6">
          Manage candidate requests to delete their personal data (GDPR Article 17 - Right to Erasure).
        </p>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ph ph-shield-check text-[#4F46E5] text-2xl" />
            </div>
            <p className="text-[#64748B] text-sm">No deletion requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending requests first */}
            {pendingRequests.map((req) => (
              <div key={req.id} className="border border-[#FEF3C7] bg-[#FFFBEB] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-[#1E293B]">{req.email}</span>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Requested {new Date(req.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequest(req.id, 'approve')}
                      disabled={processingId === req.id}
                      className="px-3 py-1.5 bg-[#16A34A] text-white rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-[#15803D] transition-colors"
                    >
                      {processingId === req.id ? '...' : 'Approve & Delete'}
                    </button>
                    <button
                      onClick={() => handleRequest(req.id, 'reject')}
                      disabled={processingId === req.id}
                      className="px-3 py-1.5 border border-slate-200 text-[#64748B] rounded-lg text-xs font-semibold disabled:opacity-50 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Processed requests */}
            {processedRequests.map((req) => (
              <div key={req.id} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-[#1E293B]">{req.email}</span>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Requested {new Date(req.requestedAt).toLocaleDateString()}
                      {req.processedAt && ` · Processed ${new Date(req.processedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      req.status === 'completed'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {req.status === 'completed' ? 'Deleted' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-[#E0E7FF] rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <i className="ph ph-info text-[#4F46E5] text-xl mt-0.5" />
          <div>
            <h4 className="font-bold text-[#1E293B] text-sm">About GDPR Compliance</h4>
            <p className="text-sm text-[#64748B] mt-1">
              When consent is enabled, candidates will see a consent checkbox before submitting their application.
              Their consent record (text, timestamp, IP) is stored separately for audit purposes.
              Deletion requests remove all candidate data including applications, evaluations, and consent records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
