'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JOB_TYPES = [
  { value: '', label: 'Select type...' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

interface JobFormData {
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  scorecardId: string;
}

interface ScorecardOption {
  id: string;
  name: string;
}

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  jobId?: string;
  mode: 'create' | 'edit';
  scorecards?: ScorecardOption[];
}

export function JobForm({ initialData, jobId, mode, scorecards = [] }: JobFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAiGen, setShowAiGen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBullets, setAiBullets] = useState('');
  const [form, setForm] = useState<JobFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    type: initialData?.type || '',
    department: initialData?.department || '',
    salaryMin: initialData?.salaryMin || '',
    salaryMax: initialData?.salaryMax || '',
    salaryCurrency: initialData?.salaryCurrency || 'EUR',
    scorecardId: initialData?.scorecardId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Job title is required');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const url = mode === 'create' ? '/api/v1/jobs' : `/api/v1/jobs/${jobId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          location: form.location.trim() || null,
          type: form.type || null,
          department: form.department.trim() || null,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
          salaryCurrency: form.salaryCurrency,
          scorecardId: form.scorecardId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save job');
      }

      if (mode === 'create') {
        const data = await res.json();
        router.push(`/jobs/${data.job.id}`);
      } else {
        router.push(`/jobs/${jobId}`);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof JobFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!form.title.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/v1/jobs/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          bullets: aiBullets || undefined,
          department: form.department || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        update('description', data.description);
        setShowAiGen(false);
        setAiBullets('');
      }
    } catch (err) {
      console.error('Failed to generate description:', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-[#1E293B] mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-[#1E293B]">
            Description
          </label>
          <button
            type="button"
            onClick={() => setShowAiGen(!showAiGen)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            <i className="ph ph-sparkle" />
            Generate with AI
          </button>
        </div>

        {showAiGen && (
          <div className="mb-3 p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-[#64748B]">
              Enter optional bullet points for key responsibilities or requirements.
              The AI will generate a full job description using your job title{form.department ? ` and department` : ''}.
            </p>
            <textarea
              value={aiBullets}
              onChange={(e) => setAiBullets(e.target.value)}
              placeholder="e.g. 3+ years React experience, remote OK, lead a team of 5..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] transition-all"
            />
            <button
              type="button"
              disabled={aiLoading || !form.title.trim()}
              onClick={handleGenerateDescription}
              className="px-4 py-2 bg-[#4F46E5] text-white text-sm font-semibold rounded-lg hover:bg-[#4338CA] transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <i className="ph ph-spinner animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <i className="ph ph-sparkle" />
                  Generate
                </>
              )}
            </button>
          </div>
        )}

        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Job description, responsibilities, requirements..."
          rows={8}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all resize-y"
        />
      </div>

      {/* Two-column grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Department
          </label>
          <input
            type="text"
            value={form.department}
            onChange={(e) => update('department', e.target.value)}
            placeholder="e.g. Engineering"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Remote, Berlin, Hybrid"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Employment Type
          </label>
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all bg-white"
          >
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Salary Currency
          </label>
          <select
            value={form.salaryCurrency}
            onChange={(e) => update('salaryCurrency', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Scorecard */}
        {scorecards.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Evaluation Scorecard
            </label>
            <select
              value={form.scorecardId}
              onChange={(e) => update('scorecardId', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all bg-white"
            >
              <option value="">No scorecard</option>
              {scorecards.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#94A3B8] mt-1">Scorecard criteria used when evaluating candidates for this job</p>
          </div>
        )}

        {/* Salary Min */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Salary Min (annual)
          </label>
          <input
            type="number"
            value={form.salaryMin}
            onChange={(e) => update('salaryMin', e.target.value)}
            placeholder="e.g. 40000"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
          />
        </div>

        {/* Salary Max */}
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-2">
            Salary Max (annual)
          </label>
          <input
            type="number"
            value={form.salaryMax}
            onChange={(e) => update('salaryMax', e.target.value)}
            placeholder="e.g. 70000"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all duration-300 disabled:opacity-50 shadow-md shadow-indigo-500/25"
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Create Job' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white text-[#64748B] border border-slate-200 rounded-xl font-semibold text-sm hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
