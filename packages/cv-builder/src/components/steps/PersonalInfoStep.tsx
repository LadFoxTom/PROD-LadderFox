import * as React from 'react';
import type { CVData } from '@repo/types';
import { Input } from '@repo/ui';
import { Textarea } from '@repo/ui';

interface PersonalInfoStepProps {
  data: Partial<CVData>;
  onChange: (data: Partial<CVData>) => void;
  primaryColor?: string;
}

export function PersonalInfoStep({ data, onChange, primaryColor }: PersonalInfoStepProps) {
  const handleChange = (field: string, value: string) => {
    if (field === 'email' || field === 'phone' || field === 'location') {
      onChange({
        contact: {
          ...data.contact,
          [field]: value,
        },
      });
    } else {
      onChange({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Personal Information
        </h2>
        <p className="text-sm text-slate-500">
          This information will appear at the top of your CV.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
          />
          <Input
            label="Professional Title"
            placeholder="Senior Software Engineer"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={data.contact?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.contact?.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <Input
          label="Location"
          placeholder="New York, NY"
          value={data.contact?.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Textarea
          label="Professional Summary"
          placeholder="A brief summary of your professional background, key skills, and career goals..."
          value={data.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
