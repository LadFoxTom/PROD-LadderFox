import * as React from 'react';
import type { CVData } from '@repo/types';

interface ReviewStepProps {
  data: Partial<CVData>;
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

function SectionCard({
  title,
  icon,
  primaryColor,
  children,
}: {
  title: string;
  icon: string;
  primaryColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={primaryColor} className="w-4.5 h-4.5">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-1.5">
      <span className="text-sm font-medium text-slate-400 sm:w-36 shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}

export function ReviewStep({ data, primaryColor }: ReviewStepProps) {
  const color = primaryColor || '#4F46E5';
  const skills = getSkillsArray(data.skills);
  const hasPersonalInfo =
    data.fullName || data.title || data.contact?.email || data.contact?.phone || data.contact?.location || data.summary;
  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasSkills = skills.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Review Your CV
        </h2>
        <p className="text-sm text-slate-500">
          Please review all the information below before submitting. You can go back to any step to make changes.
        </p>
      </div>

      {/* Personal Information */}
      {hasPersonalInfo && (
        <SectionCard
          title="Personal Information"
          icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          primaryColor={color}
        >
          <div className="space-y-1">
            <FieldRow label="Full Name" value={data.fullName} />
            <FieldRow label="Title" value={data.title} />
            <FieldRow label="Email" value={data.contact?.email} />
            <FieldRow label="Phone" value={data.contact?.phone} />
            <FieldRow label="Location" value={data.contact?.location} />
            {data.summary && (
              <div className="pt-3">
                <span className="text-sm font-medium text-slate-400 block mb-2">
                  Summary
                </span>
                <p className="text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 rounded-xl p-4 leading-relaxed">
                  {data.summary}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Experience */}
      {hasExperience && (
        <SectionCard
          title="Work Experience"
          icon="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
          primaryColor={color}
        >
          <div className="space-y-4">
            {data.experience!.map((entry, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h4 className="font-semibold text-slate-900">
                    {entry.title || 'Untitled Position'}
                  </h4>
                  {entry.dates && (
                    <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                      {entry.dates}
                    </span>
                  )}
                </div>
                {(entry.company || entry.location) && (
                  <p className="text-sm text-slate-500 mb-2">
                    {[entry.company, entry.location].filter(Boolean).join(' · ')}
                  </p>
                )}
                {(entry.achievements || entry.content) &&
                  (entry.achievements || entry.content)!.length > 0 && (
                    <ul className="space-y-1.5 mt-3">
                      {(entry.achievements || entry.content)!.map((achievement, i) => (
                        <li key={i} className="text-sm text-slate-700 flex gap-2">
                          <span style={{ color }} className="shrink-0 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Education */}
      {hasEducation && (
        <SectionCard
          title="Education"
          icon="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
          primaryColor={color}
        >
          <div className="space-y-3">
            {data.education!.map((entry, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h4 className="font-semibold text-slate-900">
                    {[entry.degree, entry.field].filter(Boolean).join(' in ') ||
                      'Untitled Education'}
                  </h4>
                  {entry.dates && (
                    <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                      {entry.dates}
                    </span>
                  )}
                </div>
                {entry.institution && (
                  <p className="text-sm text-slate-500">{entry.institution}</p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Skills */}
      {hasSkills && (
        <SectionCard
          title="Skills"
          icon="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          primaryColor={color}
        >
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `${color}10`,
                  color: color,
                  border: `1px solid ${color}25`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Empty state */}
      {!hasPersonalInfo && !hasExperience && !hasEducation && !hasSkills && (
        <div
          className="text-center py-16 border-2 border-dashed rounded-2xl"
          style={{ borderColor: `${color}30` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${color}10` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-slate-500">
            No information has been entered yet. Go back to previous steps to fill in your CV details.
          </p>
        </div>
      )}
    </div>
  );
}
