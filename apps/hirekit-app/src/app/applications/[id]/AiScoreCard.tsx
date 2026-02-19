'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScoreData {
  skillsMatch: number;
  experienceRelevance: number;
  educationFit: number;
  overallScore: number;
  summary: string;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? '#16A34A' : value >= 60 ? '#D97706' : '#DC2626';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#64748B]">{label}</span>
        <span className="font-semibold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="w-full bg-[#F1F5F9] rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function AiScoreCard({
  applicationId,
  currentScore,
  currentScoreData,
  hasJob,
}: {
  applicationId: string;
  currentScore: number | null;
  currentScoreData: ScoreData | null;
  hasJob: boolean;
}) {
  const [score, setScore] = useState(currentScore);
  const [scoreData, setScoreData] = useState<ScoreData | null>(currentScoreData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScore = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}/score`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Scoring failed');
      }
      const data = await res.json();
      setScore(data.score);
      setScoreData(data.data);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const overallColor = score
    ? score >= 80
      ? '#16A34A'
      : score >= 60
      ? '#D97706'
      : '#DC2626'
    : '#94A3B8';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="ph ph-brain text-xl text-[#4F46E5]" />
        <h3 className="text-lg font-bold text-[#1E293B]">AI Score</h3>
      </div>

      {score !== null && score !== undefined && scoreData ? (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="text-center py-3">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4"
              style={{ borderColor: overallColor }}
            >
              <span className="text-2xl font-bold" style={{ color: overallColor }}>
                {score}
              </span>
            </div>
            <p className="text-sm text-[#64748B] mt-2">Overall Fit Score</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <ScoreBar label="Skills Match" value={scoreData.skillsMatch} />
            <ScoreBar label="Experience" value={scoreData.experienceRelevance} />
            <ScoreBar label="Education" value={scoreData.educationFit} />
          </div>

          {/* Summary */}
          {scoreData.summary && (
            <div className="mt-4 p-3 bg-[#FAFBFC] rounded-xl">
              <p className="text-sm text-[#1E293B] leading-relaxed">
                {scoreData.summary}
              </p>
            </div>
          )}

          {/* Re-score button */}
          <button
            onClick={handleScore}
            disabled={loading}
            className="w-full text-sm text-[#4F46E5] font-semibold hover:text-[#4338CA] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Re-scoring...' : 'Re-score Candidate'}
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-[#64748B] mb-4">
            {hasJob
              ? 'Use AI to analyze how well this candidate fits the job.'
              : 'Link a job to this application for more accurate scoring.'}
          </p>
          <button
            onClick={handleScore}
            disabled={loading}
            className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all duration-300 disabled:opacity-50 shadow-md shadow-indigo-500/25"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <i className="ph ph-spinner animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="ph ph-brain" />
                Score Candidate
              </span>
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-3 text-center">{error}</p>
      )}
    </div>
  );
}
