'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

interface KanbanCardProps {
  id: string;
  name: string | null;
  email: string;
  jobTitle?: string | null;
  aiScore?: number | null;
  createdAt: string;
}

export function KanbanCard({ id, name, email, jobTitle, aiScore, createdAt }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const scoreColor = aiScore
    ? aiScore >= 80
      ? '#16A34A'
      : aiScore >= 60
      ? '#D97706'
      : '#DC2626'
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-[#4F46E5] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(name || 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <Link
              href={`/applications/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-semibold text-[#1E293B] hover:text-[#4F46E5] transition-colors truncate block"
            >
              {name || 'Unnamed'}
            </Link>
            <p className="text-xs text-[#94A3B8] truncate">{email}</p>
          </div>
        </div>
        {aiScore !== null && aiScore !== undefined && (
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ color: scoreColor!, backgroundColor: `${scoreColor}15` }}
          >
            {aiScore}%
          </span>
        )}
      </div>
      {jobTitle && (
        <p className="text-xs text-[#64748B] mt-2 flex items-center gap-1">
          <i className="ph ph-briefcase" />
          {jobTitle}
        </p>
      )}
      <p className="text-xs text-[#94A3B8] mt-1">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
