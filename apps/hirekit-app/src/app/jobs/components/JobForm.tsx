'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/app/components/RichTextEditor';
import type { ScreeningQuestion } from '@repo/types';

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const WORKPLACE_TYPES = [
  { value: '', label: 'Select...' },
  { value: 'on-site', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
];

const EXPERIENCE_LEVELS = [
  { value: '', label: 'Select...' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'director', label: 'Director' },
  { value: 'executive', label: 'Executive' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

const SALARY_PERIODS = [
  { value: 'year', label: 'Per Year' },
  { value: 'month', label: 'Per Month' },
  { value: 'hour', label: 'Per Hour' },
];

const POPULAR_BENEFIT_TAGS = [
  'Health Insurance', 'Dental & Vision', 'Remote Work', 'Flexible Hours',
  '401(k) / Pension', 'Stock Options', 'Unlimited PTO', 'Learning Budget',
  'Gym Membership', 'Commuter Benefits', 'Parental Leave', 'Home Office Stipend',
];

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  benefitTags: string[];
  location: string;
  type: string;
  workplaceType: string;
  employmentTypes: string[];
  experienceLevel: string;
  department: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  showSalary: boolean;
  scorecardId: string;
  screeningQuestions: ScreeningQuestion[];
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

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-[#E0E7FF] flex items-center justify-center">
        <i className={`${icon} text-[#4F46E5] text-lg`} />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#1E293B]">{title}</h3>
        {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
      </div>
    </div>
  );
}

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all';
const selectClass = `${inputClass} bg-white`;
const labelClass = 'block text-sm font-semibold text-[#1E293B] mb-2';

export function JobForm({ initialData, jobId, mode, scorecards = [] }: JobFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAiGen, setShowAiGen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBullets, setAiBullets] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState<JobFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    benefits: initialData?.benefits || '',
    benefitTags: initialData?.benefitTags || [],
    location: initialData?.location || '',
    type: initialData?.type || '',
    workplaceType: initialData?.workplaceType || '',
    employmentTypes: initialData?.employmentTypes || (initialData?.type ? [initialData.type] : []),
    experienceLevel: initialData?.experienceLevel || '',
    department: initialData?.department || '',
    salaryMin: initialData?.salaryMin || '',
    salaryMax: initialData?.salaryMax || '',
    salaryCurrency: initialData?.salaryCurrency || 'EUR',
    salaryPeriod: initialData?.salaryPeriod || 'year',
    showSalary: initialData?.showSalary !== false,
    scorecardId: initialData?.scorecardId || '',
    screeningQuestions: (initialData?.screeningQuestions as unknown as ScreeningQuestion[]) || [],
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
          description: form.description || null,
          requirements: form.requirements || null,
          benefits: form.benefits || null,
          benefitTags: form.benefitTags,
          location: form.location.trim() || null,
          type: form.employmentTypes[0] || form.type || null,
          workplaceType: form.workplaceType || null,
          employmentTypes: form.employmentTypes,
          experienceLevel: form.experienceLevel || null,
          department: form.department.trim() || null,
          salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
          salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
          salaryCurrency: form.salaryCurrency,
          salaryPeriod: form.salaryPeriod,
          showSalary: form.showSalary,
          scorecardId: form.scorecardId || null,
          screeningQuestions: form.screeningQuestions.length > 0 ? form.screeningQuestions : null,
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

  const update = (field: keyof JobFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEmploymentType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(value)
        ? prev.employmentTypes.filter((t) => t !== value)
        : [...prev.employmentTypes, value],
    }));
  };

  const addBenefitTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !form.benefitTags.includes(trimmed)) {
      update('benefitTags', [...form.benefitTags, trimmed]);
    }
    setTagInput('');
  };

  const removeBenefitTag = (tag: string) => {
    update('benefitTags', form.benefitTags.filter((t) => t !== tag));
  };

  const addScreeningQuestion = () => {
    const newQ: ScreeningQuestion = {
      id: crypto.randomUUID(),
      type: 'text',
      label: '',
      required: false,
    };
    update('screeningQuestions', [...form.screeningQuestions, newQ]);
  };

  const updateScreeningQuestion = (id: string, field: keyof ScreeningQuestion, value: any) => {
    update(
      'screeningQuestions',
      form.screeningQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeScreeningQuestion = (id: string) => {
    update('screeningQuestions', form.screeningQuestions.filter((q) => q.id !== id));
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
        if (data.requirements) update('requirements', data.requirements);
        if (data.benefits) update('benefits', data.benefits);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* === Section 1: Job Details === */}
      <div>
        <SectionHeader icon="ph ph-briefcase" title="Job Details" subtitle="Basic information about the position" />

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelClass}>
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-[#1E293B]">Description</label>
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
                  Enter optional bullet points. AI will generate description, requirements, and benefits.
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

            <RichTextEditor
              value={form.description}
              onChange={(html) => update('description', html)}
              placeholder="Describe the role, team, and what makes this position exciting..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className={labelClass}>Requirements</label>
            <RichTextEditor
              value={form.requirements}
              onChange={(html) => update('requirements', html)}
              placeholder="List required skills, qualifications, and experience..."
            />
          </div>

          {/* Benefits */}
          <div>
            <label className={labelClass}>Benefits & Perks</label>
            <RichTextEditor
              value={form.benefits}
              onChange={(html) => update('benefits', html)}
              placeholder="Describe what you offer: compensation, culture, growth opportunities..."
            />
          </div>

          {/* Benefit Tags */}
          <div>
            <label className={labelClass}>Benefit Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.benefitTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E0E7FF] text-[#4F46E5] text-xs font-semibold rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeBenefitTag(tag)}
                    className="hover:text-[#DC2626] transition-colors"
                  >
                    <i className="ph ph-x text-[10px]" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBenefitTag(tagInput);
                  }
                }}
                placeholder="Type a benefit and press Enter..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => addBenefitTag(tagInput)}
                disabled={!tagInput.trim()}
                className="px-4 py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold hover:bg-[#4338CA] transition-all disabled:opacity-50 whitespace-nowrap"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BENEFIT_TAGS.filter((t) => !form.benefitTags.includes(t)).slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addBenefitTag(tag)}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#64748B] bg-white border border-slate-200 rounded-full hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Section 2: Location & Workplace === */}
      <div>
        <SectionHeader icon="ph ph-map-pin" title="Location & Workplace" subtitle="Where and how the work happens" />

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Berlin, Germany"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Workplace Type</label>
            <select
              value={form.workplaceType}
              onChange={(e) => update('workplaceType', e.target.value)}
              className={selectClass}
            >
              {WORKPLACE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* === Section 3: Compensation === */}
      <div>
        <SectionHeader icon="ph ph-currency-circle-dollar" title="Compensation" subtitle="Salary range and display preferences" />

        <div className="space-y-5">
          {/* Show Salary Toggle */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => update('showSalary', !form.showSalary)}
              className={`w-10 h-6 rounded-full cursor-pointer transition-colors relative ${
                form.showSalary ? 'bg-[#4F46E5]' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm ${
                  form.showSalary ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <label className="text-sm font-semibold text-[#1E293B]">Show salary on job listing</label>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelClass}>Currency</label>
              <select
                value={form.salaryCurrency}
                onChange={(e) => update('salaryCurrency', e.target.value)}
                className={selectClass}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Period</label>
              <select
                value={form.salaryPeriod}
                onChange={(e) => update('salaryPeriod', e.target.value)}
                className={selectClass}
              >
                {SALARY_PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Minimum</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => update('salaryMin', e.target.value)}
                placeholder="e.g. 40000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Maximum</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => update('salaryMax', e.target.value)}
                placeholder="e.g. 70000"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Section 4: Employment Terms === */}
      <div>
        <SectionHeader icon="ph ph-identification-card" title="Employment Terms" subtitle="Type, level, and department" />

        <div className="space-y-5">
          {/* Employment Types - Multi-select */}
          <div>
            <label className={labelClass}>Employment Type</label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleEmploymentType(t.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    form.employmentTypes.includes(t.value)
                      ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                      : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Experience Level</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => update('experienceLevel', e.target.value)}
                className={selectClass}
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                placeholder="e.g. Engineering"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Section 5: Evaluation === */}
      {scorecards.length > 0 && (
        <div>
          <SectionHeader icon="ph ph-exam" title="Evaluation" subtitle="Scorecard for candidate assessment" />

          <div className="max-w-md">
            <label className={labelClass}>Scorecard</label>
            <select
              value={form.scorecardId}
              onChange={(e) => update('scorecardId', e.target.value)}
              className={selectClass}
            >
              <option value="">No scorecard</option>
              {scorecards.map((sc) => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
            <p className="text-xs text-[#94A3B8] mt-1">Scorecard criteria used when evaluating candidates for this job</p>
          </div>
        </div>
      )}

      {/* === Section 6: Screening Questions === */}
      <div>
        <SectionHeader icon="ph ph-chat-circle-text" title="Screening Questions" subtitle="Ask candidates questions when they apply" />

        <div className="space-y-4">
          {form.screeningQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-[#94A3B8] mt-3 shrink-0">#{idx + 1}</span>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => updateScreeningQuestion(q.id, 'label', e.target.value)}
                    placeholder="e.g. Are you authorized to work in the EU?"
                    className={inputClass}
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={q.type}
                      onChange={(e) => updateScreeningQuestion(q.id, 'type', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#4F46E5] transition-all"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="select">Single Choice</option>
                      <option value="boolean">Yes / No</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-[#1E293B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => updateScreeningQuestion(q.id, 'required', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                      />
                      Required
                    </label>
                  </div>
                  {q.type === 'select' && (
                    <input
                      type="text"
                      value={(q.options || []).join(', ')}
                      onChange={(e) =>
                        updateScreeningQuestion(
                          q.id,
                          'options',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="Options (comma-separated): e.g. 0-2 years, 3-5 years, 5+ years"
                      className={inputClass}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeScreeningQuestion(q.id)}
                  className="mt-2 p-1.5 text-[#94A3B8] hover:text-red-500 transition-colors"
                  title="Remove question"
                >
                  <i className="ph ph-trash text-base" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addScreeningQuestion}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#4F46E5] bg-white border border-dashed border-[#4F46E5]/30 rounded-xl hover:bg-[#EEF2FF] transition-all"
          >
            <i className="ph ph-plus" />
            Add Question
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
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
