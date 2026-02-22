'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

type Tab = 'cv-builder' | 'job-listings';

export default function LivePreviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>('cv-builder');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setCompanyId(data.company?.id || data.companyId || null);
      })
      .catch(() => setCompanyId(null))
      .finally(() => setLoading(false));
  }, []);

  const iframeSrc = companyId
    ? `/live-preview-frame.html?widget=${activeTab}&companyId=${companyId}&r=${refreshKey}`
    : '';

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'cv-builder', label: 'CV Builder', icon: 'ph ph-chat-circle-dots' },
    { key: 'job-listings', label: 'Job Listings', icon: 'ph ph-briefcase' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E293B]">Live Preview</h1>
            <p className="text-[15px] text-[#64748B] mt-1">
              Test your widgets exactly as visitors will see them
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold hover:bg-[#4338CA] transition-colors"
          >
            <i className="ph ph-arrow-clockwise text-base" />
            Refresh Preview
          </button>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-5 py-4">
          <i className="ph ph-info text-lg text-[#4F46E5] mt-0.5" />
          <p className="text-sm text-[#4338CA]">
            This preview shows exactly what visitors see. Save your changes in Configuration, then refresh here.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-white text-[#64748B] border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <i className={`${tab.icon} text-base`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preview card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <i className={`${activeTab === 'cv-builder' ? 'ph ph-chat-circle-dots' : 'ph ph-briefcase'} text-xl text-[#4F46E5]`} />
            <h3 className="text-lg font-bold text-[#1E293B]">
              {activeTab === 'cv-builder' ? 'CV Builder Widget' : 'Job Listings Widget'}
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[600px] text-[#64748B]">
              <i className="ph ph-spinner animate-spin text-2xl mr-2" />
              Loading preview...
            </div>
          ) : !companyId ? (
            <div className="flex items-center justify-center h-[600px] text-[#64748B]">
              <p>Unable to load company settings. Please check your configuration.</p>
            </div>
          ) : (
            <iframe
              key={`${activeTab}-${refreshKey}`}
              src={iframeSrc}
              className="w-full border border-slate-200 rounded-xl"
              style={{ height: '800px' }}
              title={activeTab === 'cv-builder' ? 'CV Builder Preview' : 'Job Listings Preview'}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
