import * as React from 'react';
import { useState } from 'react';
import type { CVData } from '@repo/types';
import { Input, Button } from '@repo/ui';

interface SkillsStepProps {
  data: Partial<CVData>;
  onChange: (data: Partial<CVData>) => void;
  primaryColor?: string;
}

function getSkillsArray(skills: CVData['skills']): string[] {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return [
    ...(skills.technical || []),
    ...(skills.soft || []),
    ...(skills.tools || []),
    ...(skills.industry || []),
  ];
}

function toSkillsStructure(allSkills: string[]): CVData['skills'] {
  return {
    technical: allSkills,
    soft: [],
    tools: [],
    industry: [],
  };
}

export function SkillsStep({ data, onChange, primaryColor }: SkillsStepProps) {
  const [inputValue, setInputValue] = useState('');
  const skills = getSkillsArray(data.skills);
  const color = primaryColor || '#4F46E5';

  const addSkills = (text: string) => {
    const newSkills = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !skills.includes(s));

    if (newSkills.length > 0) {
      const updated = [...skills, ...newSkills];
      onChange({ skills: toSkillsStructure(updated) });
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    onChange({ skills: toSkillsStructure(updated) });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkills(inputValue);
      }
    }
    if (e.key === 'Backspace' && inputValue === '' && skills.length > 0) {
      const last = skills[skills.length - 1];
      removeSkill(last);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.includes(',')) {
      e.preventDefault();
      addSkills(pastedText);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Skills
        </h2>
        <p className="text-sm text-slate-500">
          Add your skills by typing them separated by commas or pressing Enter after each one.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Add Skills
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. React, TypeScript, Project Management"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
            <Button
              onClick={() => {
                if (inputValue.trim()) addSkills(inputValue);
              }}
              variant="outline"
              className="shrink-0"
            >
              Add
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Press Enter or comma to add. Backspace to remove the last skill.
          </p>
        </div>

        {skills.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: `${color}10`,
                    color: color,
                    border: `1px solid ${color}25`,
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 opacity-60 hover:opacity-100"
                    style={{ backgroundColor: `${color}20` }}
                    aria-label={`Remove ${skill}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {skills.length === 0 && (
        <div
          className="text-center py-12 border-2 border-dashed rounded-2xl"
          style={{ borderColor: `${color}30` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: `${color}10` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">
            No skills added yet. Start typing above to add your skills.
          </p>
        </div>
      )}
    </div>
  );
}
