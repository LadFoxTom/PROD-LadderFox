'use client';

import { useState } from 'react';
import { JobForm } from '../components/JobForm';
import type { JobFormData } from '../components/JobForm';
import { ImportJobModal } from '../components/ImportJobModal';

interface NewJobClientProps {
  scorecards: { id: string; name: string }[];
}

export function NewJobClient({ scorecards }: NewJobClientProps) {
  const [importedData, setImportedData] = useState<Partial<JobFormData> | null>(null);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-[#F0EDFF] to-[#EEF2FF] border border-[#E0E7FF] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
            <i className="ph ph-lightning text-[#4F46E5] text-lg" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E293B]">Have an existing job listing?</p>
            <p className="text-xs text-[#64748B]">
              Import from text or PDF to auto-fill the form
            </p>
          </div>
        </div>
        <ImportJobModal onImport={(data) => setImportedData(data)} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <JobForm
          key={importedData ? 'imported' : 'fresh'}
          mode="create"
          scorecards={scorecards}
          initialData={importedData || undefined}
        />
      </div>
    </>
  );
}
