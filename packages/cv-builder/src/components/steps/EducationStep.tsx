import * as React from 'react';
import type { CVData } from '@repo/types';
import { Input, Button } from '@repo/ui';

type EducationEntry = NonNullable<CVData['education']>[number];

interface EducationStepProps {
  data: Partial<CVData>;
  onChange: (data: Partial<CVData>) => void;
  primaryColor?: string;
  min?: number;
  max?: number;
}

function createEmptyEntry(): EducationEntry {
  return {
    institution: '',
    degree: '',
    field: '',
    dates: '',
  };
}

export function EducationStep({ data, onChange, primaryColor, min = 0, max = 5 }: EducationStepProps) {
  const entries = data.education || (min > 0 ? [createEmptyEntry()] : []);

  const updateEntry = (index: number, field: keyof EducationEntry, value: unknown) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ education: updated });
  };

  const addEntry = () => {
    if (entries.length >= max) return;
    onChange({ education: [...entries, createEmptyEntry()] });
  };

  const removeEntry = (index: number) => {
    if (entries.length <= min) return;
    const updated = entries.filter((_, i) => i !== index);
    onChange({ education: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Education
        </h2>
        <p className="text-sm text-slate-500">
          Add your educational background, starting with the most recent degree.
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <p className="text-slate-500 mb-4 text-sm">No education entries yet</p>
          <Button onClick={addEntry} variant="outline" size="sm">
            Add Your Education
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
                {entry.institution || `Education ${index + 1}`}
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
              label="Institution"
              placeholder="University of Example"
              value={entry.institution || ''}
              onChange={(e) => updateEntry(index, 'institution', e.target.value)}
              required
            />
            <Input
              label="Degree"
              placeholder="Bachelor of Science"
              value={entry.degree || ''}
              onChange={(e) => updateEntry(index, 'degree', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Field of Study"
              placeholder="Computer Science"
              value={entry.field || ''}
              onChange={(e) => updateEntry(index, 'field', e.target.value)}
            />
            <Input
              label="Dates"
              placeholder="Sep 2018 - Jun 2022"
              value={entry.dates || ''}
              onChange={(e) => updateEntry(index, 'dates', e.target.value)}
            />
          </div>
        </div>
      ))}

      {entries.length > 0 && entries.length < max && (
        <div className="flex justify-center">
          <Button onClick={addEntry} variant="outline" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Another Degree
          </Button>
        </div>
      )}
    </div>
  );
}
