import * as React from 'react';
import type { CVData } from '@repo/types';
import { Input, Button, Textarea } from '@repo/ui';

type ExperienceEntry = NonNullable<CVData['experience']>[number];

interface ExperienceStepProps {
  data: Partial<CVData>;
  onChange: (data: Partial<CVData>) => void;
  primaryColor?: string;
  min?: number;
  max?: number;
}

function createEmptyEntry(): ExperienceEntry {
  return {
    company: '',
    title: '',
    dates: '',
    achievements: [],
  };
}

export function ExperienceStep({ data, onChange, primaryColor, min = 0, max = 10 }: ExperienceStepProps) {
  const entries = data.experience || (min > 0 ? [createEmptyEntry()] : []);

  const updateEntry = (index: number, field: keyof ExperienceEntry, value: unknown) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ experience: updated });
  };

  const addEntry = () => {
    if (entries.length >= max) return;
    onChange({ experience: [...entries, createEmptyEntry()] });
  };

  const removeEntry = (index: number) => {
    if (entries.length <= min) return;
    const updated = entries.filter((_, i) => i !== index);
    onChange({ experience: updated });
  };

  const updateAchievements = (index: number, text: string) => {
    const achievements = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    updateEntry(index, 'achievements', achievements);
  };

  const getAchievementsText = (entry: ExperienceEntry): string => {
    return (entry.achievements || entry.content || []).join('\n');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Work Experience
        </h2>
        <p className="text-sm text-slate-500">
          Add your work experience, starting with the most recent position.
        </p>
      </div>

      {entries.length === 0 && (
        <div
          className="text-center py-12 border-2 border-dashed rounded-2xl transition-colors"
          style={{ borderColor: `${primaryColor || '#4F46E5'}30` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: `${primaryColor || '#4F46E5'}10` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={primaryColor || '#4F46E5'} className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <p className="text-slate-500 mb-4 text-sm">No experience entries yet</p>
          <Button onClick={addEntry} variant="outline" size="sm">
            Add Your First Position
          </Button>
        </div>
      )}

      {entries.map((entry, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: primaryColor || '#4F46E5' }}
              >
                {index + 1}
              </div>
              <h3 className="text-sm font-semibold text-slate-700">
                {entry.title || entry.company ? `${entry.title || 'Position'}${entry.company ? ` at ${entry.company}` : ''}` : `Position ${index + 1}`}
              </h3>
            </div>
            {entries.length > min && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEntry(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="Software Engineer"
              value={entry.title || ''}
              onChange={(e) => updateEntry(index, 'title', e.target.value)}
              required
            />
            <Input
              label="Company"
              placeholder="Acme Corp"
              value={entry.company || ''}
              onChange={(e) => updateEntry(index, 'company', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dates"
              placeholder="Jan 2022 - Present"
              value={entry.dates || ''}
              onChange={(e) => updateEntry(index, 'dates', e.target.value)}
            />
            <Input
              label="Location"
              placeholder="New York, NY"
              value={entry.location || ''}
              onChange={(e) => updateEntry(index, 'location', e.target.value)}
            />
          </div>

          <Textarea
            label="Key Achievements"
            placeholder={"Enter each achievement on a new line, e.g.:\nLed a team of 5 engineers to deliver a new product feature\nIncreased test coverage from 60% to 95%"}
            value={getAchievementsText(entry)}
            onChange={(e) => updateAchievements(index, e.target.value)}
            rows={4}
          />
        </div>
      ))}

      {entries.length > 0 && entries.length < max && (
        <div className="flex justify-center">
          <Button onClick={addEntry} variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Another Position
          </Button>
        </div>
      )}
    </div>
  );
}
