'use client';

import { useState } from 'react';

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface ScorecardEvaluationProps {
  applicationId: string;
  criteria: Criterion[];
  existingScores: Record<string, number> | null;
  existingRating: number;
  existingRecommendation: string;
  existingNotes: string;
  onSaved: () => void;
}

export function ScorecardEvaluation({
  applicationId,
  criteria,
  existingScores,
  existingRating,
  existingRecommendation,
  existingNotes,
  onSaved,
}: ScorecardEvaluationProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    existingScores || Object.fromEntries(criteria.map((c) => [c.id, 0]))
  );
  const [recommendation, setRecommendation] = useState(existingRecommendation || '');
  const [notes, setNotes] = useState(existingNotes || '');
  const [saving, setSaving] = useState(false);

  // Calculate weighted average
  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
  const weightedSum = criteria.reduce((s, c) => s + (scores[c.id] || 0) * c.weight, 0);
  const overallRating = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
  const roundedRating = Math.round(overallRating) || 1;

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/v1/applications/${applicationId}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: Math.max(1, Math.min(5, roundedRating)),
        recommendation: recommendation || null,
        notes: notes || null,
        scores,
      }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="space-y-4">
      {/* Criteria ratings */}
      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-sm font-medium text-[#1E293B]">{criterion.name}</span>
                {criterion.weight > 1 && (
                  <span className="text-[10px] text-[#94A3B8] ml-1">x{criterion.weight}</span>
                )}
              </div>
              <span className="text-xs text-[#64748B]">{scores[criterion.id] || 0}/5</span>
            </div>
            {criterion.description && (
              <p className="text-[10px] text-[#94A3B8] mb-2">{criterion.description}</p>
            )}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setScores({ ...scores, [criterion.id]: star })}
                  className="text-lg transition-colors"
                  style={{
                    color: star <= (scores[criterion.id] || 0) ? '#F59E0B' : '#E2E8F0',
                  }}
                >
                  <i className={`ph-fill ph-star`} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overall */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#E0E7FF] rounded-xl">
        <span className="text-sm font-semibold text-[#4F46E5]">Overall Score</span>
        <span className="text-lg font-bold text-[#4F46E5]">{overallRating.toFixed(1)}/5</span>
      </div>

      {/* Recommendation */}
      <div>
        <label className="block text-xs font-semibold text-[#1E293B] mb-1">Recommendation</label>
        <select
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <option value="">Select...</option>
          <option value="strong_yes">Strong Yes</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="strong_no">Strong No</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-[#1E293B] mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          placeholder="Additional feedback..."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-[#4338CA] transition-colors"
      >
        {saving ? 'Saving...' : 'Submit Evaluation'}
      </button>
    </div>
  );
}
