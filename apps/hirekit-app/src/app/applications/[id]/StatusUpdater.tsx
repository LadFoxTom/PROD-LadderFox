'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUSES = [
  { value: 'new', label: 'New', icon: 'ph-envelope-simple', bg: '#E0E7FF', text: '#4F46E5', ring: '#4F46E5' },
  { value: 'reviewing', label: 'Reviewing', icon: 'ph-eye', bg: '#FEF3C7', text: '#D97706', ring: '#D97706' },
  { value: 'shortlisted', label: 'Shortlisted', icon: 'ph-check-circle', bg: '#DCFCE7', text: '#16A34A', ring: '#16A34A' },
  { value: 'rejected', label: 'Rejected', icon: 'ph-x-circle', bg: '#FEE2E2', text: '#DC2626', ring: '#DC2626' },
];

export function StatusUpdater({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    if (newStatus === status || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      {STATUSES.map((s) => {
        const isActive = s.value === status;
        return (
          <button
            key={s.value}
            onClick={() => handleChange(s.value)}
            disabled={saving}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center gap-3 transition-all duration-300 disabled:opacity-50"
            style={{
              backgroundColor: isActive ? s.bg : '#FAFBFC',
              color: isActive ? s.text : '#64748B',
              boxShadow: isActive ? `inset 0 0 0 2px ${s.ring}` : 'inset 0 0 0 1px #E2E8F0',
            }}
          >
            <i className={`${s.icon} text-base`} />
            {s.label}
            {isActive && (
              <i className="ph-check-bold text-xs ml-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
}
