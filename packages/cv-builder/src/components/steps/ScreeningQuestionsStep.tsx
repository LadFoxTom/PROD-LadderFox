import * as React from 'react';
import { useState } from 'react';
import type { CVData, ScreeningQuestion, ScreeningAnswer } from '@repo/types';

interface ScreeningQuestionsStepProps {
  data: Partial<CVData>;
  onChange: (partial: Partial<CVData>) => void;
  primaryColor: string;
  questions: ScreeningQuestion[];
}

export function ScreeningQuestionsStep({
  data,
  onChange,
  primaryColor,
  questions,
}: ScreeningQuestionsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const answers: ScreeningAnswer[] = data.screeningAnswers || [];

  const getAnswer = (questionId: string): string | boolean => {
    const a = answers.find((a) => a.questionId === questionId);
    return a?.answer ?? '';
  };

  const setAnswer = (questionId: string, value: string | boolean) => {
    const existing = answers.filter((a) => a.questionId !== questionId);
    existing.push({ questionId, answer: value });
    onChange({ screeningAnswers: existing });
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Screening Questions
        </h2>
        <p className="text-sm text-slate-500">
          Please answer the following questions from the employer.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((q) => {
          const val = getAnswer(q.id);
          const error = errors[q.id];

          return (
            <div key={q.id}>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === 'text' && (
                <input
                  type="text"
                  value={val as string}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  placeholder="Your answer..."
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  value={val as string}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-y"
                  placeholder="Your answer..."
                />
              )}

              {q.type === 'select' && (
                <select
                  value={val as string}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                >
                  <option value="">Select an option...</option>
                  {(q.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {q.type === 'boolean' && (
                <div className="flex gap-3">
                  {(['Yes', 'No'] as const).map((label) => {
                    const boolVal = label === 'Yes';
                    const isSelected = val === boolVal;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAnswer(q.id, boolVal)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          backgroundColor: isSelected ? primaryColor : '#F8FAFC',
                          color: isSelected ? '#ffffff' : '#64748B',
                          border: isSelected ? `2px solid ${primaryColor}` : '2px solid #E2E8F0',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
