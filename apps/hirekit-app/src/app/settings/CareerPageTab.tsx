'use client';

import { useState, useEffect } from 'react';

interface CareerPageSettings {
  published: boolean;
  title: string;
  subtitle: string;
  introText: string;
  templateId: string;
  heroImageUrl: string;
  metaDescription: string;
}

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Gradient hero with centered layout' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, text-focused listing' },
  { id: 'corporate', name: 'Corporate', description: 'Professional with navbar and grid' },
  { id: 'creative', name: 'Creative', description: 'Bold typography with accent bar' },
];

export function CareerPageTab({ companySlug }: { companySlug: string }) {
  const [settings, setSettings] = useState<CareerPageSettings>({
    published: false,
    title: '',
    subtitle: '',
    introText: '',
    templateId: 'modern',
    heroImageUrl: '',
    metaDescription: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.careerPage) {
          setSettings({
            published: data.careerPage.published || false,
            title: data.careerPage.title || '',
            subtitle: data.careerPage.subtitle || '',
            introText: data.careerPage.introText || '',
            templateId: data.careerPage.templateId || 'modern',
            heroImageUrl: data.careerPage.heroImageUrl || '',
            metaDescription: data.careerPage.metaDescription || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        careerPage: {
          published: settings.published,
          title: settings.title,
          subtitle: settings.subtitle || null,
          introText: settings.introText || null,
          templateId: settings.templateId,
          heroImageUrl: settings.heroImageUrl || null,
          metaDescription: settings.metaDescription || null,
        },
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const careerUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/career/${companySlug}`;

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />;
  }

  return (
    <div className="space-y-8">
      {/* Published Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1E293B]">Career Page</h3>
            <p className="text-sm text-[#64748B] mt-1">
              {settings.published ? 'Your career page is live' : 'Your career page is not published yet'}
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, published: !settings.published })}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.published ? 'bg-[#4F46E5]' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.published ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>

        {settings.published && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
            <i className="ph ph-link text-[#4F46E5]" />
            <a
              href={careerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#4F46E5] hover:underline font-medium truncate"
            >
              {careerUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(careerUrl)}
              className="ml-auto text-xs text-[#64748B] hover:text-[#4F46E5] flex items-center gap-1"
            >
              <i className="ph ph-copy" /> Copy
            </button>
          </div>
        )}
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#1E293B] mb-4">Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSettings({ ...settings, templateId: t.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                settings.templateId === t.id
                  ? 'border-[#4F46E5] bg-[#F5F3FF]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="font-semibold text-sm text-[#1E293B]">{t.name}</p>
              <p className="text-xs text-[#64748B] mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-[#1E293B]">Content</h3>

        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1">Page Title</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            placeholder="Join Our Team"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1">Subtitle</label>
          <input
            type="text"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            placeholder="Help us build the future of..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1">Introduction</label>
          <textarea
            value={settings.introText}
            onChange={(e) => setSettings({ ...settings, introText: e.target.value })}
            rows={3}
            placeholder="Tell candidates about your company culture, mission, and values..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1">Hero Image URL</label>
          <input
            type="url"
            value={settings.heroImageUrl}
            onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#1E293B] mb-4">SEO</h3>
        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1">Meta Description</label>
          <textarea
            value={settings.metaDescription}
            onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
            rows={2}
            maxLength={160}
            placeholder="A brief description for search engines (max 160 characters)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          />
          <p className="text-xs text-[#94A3B8] mt-1">{settings.metaDescription.length}/160</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        {saved && <span className="text-sm text-green-600 self-center">Saved!</span>}
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-[#4338CA] transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
