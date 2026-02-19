'use client';

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface EvaluationData {
  userId: string;
  userName: string;
  rating: number;
  scores: Record<string, number> | null;
  recommendation: string | null;
}

interface EvaluationComparisonProps {
  criteria: Criterion[];
  evaluations: EvaluationData[];
}

const REC_COLORS: Record<string, { bg: string; text: string }> = {
  strong_yes: { bg: '#DCFCE7', text: '#16A34A' },
  yes: { bg: '#E0E7FF', text: '#4F46E5' },
  no: { bg: '#FEF3C7', text: '#D97706' },
  strong_no: { bg: '#FEE2E2', text: '#DC2626' },
};

const REC_LABELS: Record<string, string> = {
  strong_yes: 'Strong Yes',
  yes: 'Yes',
  no: 'No',
  strong_no: 'Strong No',
};

function ScoreCell({ score }: { score: number }) {
  const colors = [
    '#EF4444', // 1
    '#F97316', // 2
    '#F59E0B', // 3
    '#84CC16', // 4
    '#22C55E', // 5
  ];
  const color = colors[Math.min(Math.max(score - 1, 0), 4)];

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
      style={{ backgroundColor: score > 0 ? color : '#E2E8F0' }}
    >
      {score > 0 ? score : '-'}
    </div>
  );
}

export function EvaluationComparison({ criteria, evaluations }: EvaluationComparisonProps) {
  if (evaluations.length === 0) return null;

  // Calculate averages per criterion
  const avgScores = criteria.map((c) => {
    const scores = evaluations
      .map((e) => e.scores?.[c.id] || 0)
      .filter((s) => s > 0);
    return scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
  });

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-[#1E293B] mb-3">Evaluation Comparison</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-[#64748B]">Criterion</th>
              {evaluations.map((ev) => (
                <th key={ev.userId} className="text-center py-2 px-2 text-xs font-semibold text-[#64748B]">
                  {ev.userName.split(' ')[0]}
                </th>
              ))}
              <th className="text-center py-2 px-2 text-xs font-semibold text-[#4F46E5]">Avg</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="py-2 pr-4 text-xs text-[#1E293B]">{c.name}</td>
                {evaluations.map((ev) => (
                  <td key={ev.userId} className="py-2 px-2 text-center">
                    <ScoreCell score={ev.scores?.[c.id] || 0} />
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <span className="text-xs font-bold text-[#4F46E5]">
                    {avgScores[i] > 0 ? avgScores[i].toFixed(1) : '-'}
                  </span>
                </td>
              </tr>
            ))}
            {/* Recommendation row */}
            <tr>
              <td className="py-2 pr-4 text-xs font-medium text-[#1E293B]">Recommendation</td>
              {evaluations.map((ev) => {
                const rec = ev.recommendation;
                const style = rec ? REC_COLORS[rec] : null;
                return (
                  <td key={ev.userId} className="py-2 px-2 text-center">
                    {rec && style ? (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {REC_LABELS[rec] || rec}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">-</span>
                    )}
                  </td>
                );
              })}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
