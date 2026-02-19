'use client';

import { useState, useEffect } from 'react';

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface Scorecard {
  id: string;
  name: string;
  criteria: Criterion[];
  isDefault: boolean;
}

export function ScorecardsTab() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Scorecard | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch('/api/v1/scorecards')
      .then((r) => r.json())
      .then((data) => setScorecards(data.scorecards || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createNew = () => {
    setEditing({
      id: '',
      name: '',
      criteria: [{ id: crypto.randomUUID(), name: '', description: '', weight: 1 }],
      isDefault: false,
    });
  };

  const addCriterion = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      criteria: [...editing.criteria, { id: crypto.randomUUID(), name: '', description: '', weight: 1 }],
    });
  };

  const removeCriterion = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      criteria: editing.criteria.filter((c) => c.id !== id),
    });
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      criteria: editing.criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  const save = async () => {
    if (!editing || !editing.name || editing.criteria.length === 0) return;
    setSaving(true);

    const validCriteria = editing.criteria.filter((c) => c.name.trim());
    if (validCriteria.length === 0) {
      setSaving(false);
      return;
    }

    if (editing.id) {
      await fetch(`/api/v1/scorecards/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editing.name, criteria: validCriteria, isDefault: editing.isDefault }),
      });
    } else {
      await fetch('/api/v1/scorecards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editing.name, criteria: validCriteria, isDefault: editing.isDefault }),
      });
    }

    setSaving(false);
    setEditing(null);
    load();
  };

  const deleteScorecard = async (id: string) => {
    await fetch(`/api/v1/scorecards/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Scorecards</h3>
          <p className="text-sm text-[#64748B] mt-1">Create evaluation templates with specific criteria for your team</p>
        </div>
        <button
          onClick={createNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold hover:bg-[#4338CA] transition-colors"
        >
          <i className="ph ph-plus" />
          New Scorecard
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white rounded-2xl border border-[#4F46E5] p-6 shadow-sm space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Name</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Engineering Interview"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isDefault}
                  onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                />
                <span className="text-sm text-[#64748B]">Use as default for all jobs</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#1E293B]">Criteria</label>
              <button
                onClick={addCriterion}
                className="text-xs text-[#4F46E5] hover:underline font-medium"
              >
                + Add Criterion
              </button>
            </div>
            <div className="space-y-3">
              {editing.criteria.map((criterion, i) => (
                <div key={criterion.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-[#94A3B8] mt-2 w-5">{i + 1}.</span>
                  <div className="flex-1 grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                      placeholder="Criterion name"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                    />
                    <input
                      type="text"
                      value={criterion.description}
                      onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                      placeholder="Description (optional)"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#64748B] whitespace-nowrap">Weight:</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={criterion.weight}
                        onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value) || 1)}
                        className="w-16 rounded-lg border border-slate-200 px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                      />
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="text-[#94A3B8] hover:text-red-500 transition-colors ml-auto"
                      >
                        <i className="ph ph-trash text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-[#64748B]">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || !editing.name}
              className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing.id ? 'Update Scorecard' : 'Create Scorecard'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {scorecards.length === 0 && !editing ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-clipboard-text text-[#4F46E5] text-2xl" />
          </div>
          <p className="text-[#64748B]">No scorecards yet. Create one to standardize your evaluations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scorecards.map((sc) => (
            <div key={sc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1E293B]">{sc.name}</h4>
                    {sc.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0E7FF] text-[#4F46E5] font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {(sc.criteria as Criterion[]).length} criteria
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(sc)}
                    className="text-xs px-3 py-1.5 rounded-lg text-[#4F46E5] hover:bg-[#E0E7FF] font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteScorecard(sc.id)}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(sc.criteria as Criterion[]).map((c) => (
                  <span
                    key={c.id}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-[#64748B] border border-slate-100"
                  >
                    {c.name}
                    {c.weight > 1 && <span className="text-[#94A3B8] ml-1">x{c.weight}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
