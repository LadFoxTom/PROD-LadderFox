'use client';

import { WIDGET_TEMPLATES, WidgetTemplateConfig } from '@repo/types';

interface CVPreviewProps {
  cvData: Record<string, unknown>;
  primaryColor?: string;
  templateId?: string;
}

function getTemplate(templateId?: string): WidgetTemplateConfig {
  if (!templateId) return WIDGET_TEMPLATES[0];
  return WIDGET_TEMPLATES.find(t => t.id === templateId) || WIDGET_TEMPLATES[0];
}

// SVG icons as inline components (Shadow DOM safe)
const icons = {
  email: (color: string) => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  ),
  phone: (color: string) => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  ),
  location: (color: string) => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  ),
  doc: (color: string) => (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
};

export function CVPreview({ cvData, primaryColor, templateId }: CVPreviewProps) {
  const template = getTemplate(templateId);
  const color = primaryColor || template.primaryColor;

  const hasData = Object.keys(cvData).length > 0;
  const fullName = (cvData.fullName as string) || '';
  const title = (cvData.title as string) || (cvData.professionalHeadline as string) || '';
  const summary = (cvData.summary as string) || (cvData.careerObjective as string) || '';
  const contact = (cvData.contact as Record<string, string>) || {};
  const experience = (cvData.experience as Array<Record<string, unknown>>) || [];
  const education = (cvData.education as Array<Record<string, unknown>>) || [];
  const skills = cvData.skills as Record<string, string[]> | undefined;
  const technicalSkills = (cvData.technicalSkills as string[]) || skills?.technical || [];
  const softSkills = (cvData.softSkills as string[]) || skills?.soft || [];
  const toolSkills = skills?.tools || [];
  const hasSkills = technicalSkills.length > 0 || softSkills.length > 0 || toolSkills.length > 0;
  const hasContact = !!(contact.email || contact.phone || contact.location);

  if (!hasData) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '16px', color: '#94A3B8', padding: '40px 20px', textAlign: 'center',
      }}>
        {icons.doc('#CBD5E1')}
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>
            Your CV Preview
          </div>
          <div style={{ fontSize: '13px' }}>
            Start chatting to build your CV.<br />It will appear here in real-time.
          </div>
        </div>
      </div>
    );
  }

  // Section title renderer based on template sectionStyle
  const SectionTitle = ({ children }: { children: string }) => {
    const base: React.CSSProperties = {
      fontSize: '10.5px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '8px',
      fontFamily: template.fontFamily,
    };
    if (template.sectionStyle === 'underlined') {
      return (
        <div style={{ ...base, color: color, paddingBottom: '5px', borderBottom: `2px solid ${color}` }}>
          {children}
        </div>
      );
    }
    if (template.sectionStyle === 'boxed') {
      return (
        <div style={{
          ...base, color: color, padding: '4px 8px',
          backgroundColor: `${color}08`, borderRadius: '4px', border: `1px solid ${color}20`,
        }}>
          {children}
        </div>
      );
    }
    // minimal
    return (
      <div style={{ ...base, color: template.textColor, marginBottom: '6px' }}>
        {children}
      </div>
    );
  };

  // Sidebar section title (light text on dark bg)
  const SidebarSectionTitle = ({ children }: { children: string }) => (
    <div style={{
      fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
      color: `${template.sidebarText}90`, marginBottom: '6px', paddingBottom: '4px',
      borderBottom: `1px solid ${template.sidebarText}25`, fontFamily: template.fontFamily,
    }}>
      {children}
    </div>
  );

  // Contact row for single-column
  const ContactRow = () => {
    if (!hasContact) return null;
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap',
        fontSize: '11px', color: template.lightText, marginBottom: '16px',
        paddingBottom: '12px', borderBottom: '1px solid #E2E8F0',
      }}>
        {contact.email && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {icons.email(template.lightText)}{contact.email}
          </span>
        )}
        {contact.phone && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {icons.phone(template.lightText)}{contact.phone}
          </span>
        )}
        {contact.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {icons.location(template.lightText)}{contact.location}
          </span>
        )}
      </div>
    );
  };

  // Sidebar contact (light icons on dark bg)
  const SidebarContact = () => {
    if (!hasContact) return null;
    return (
      <div style={{ marginBottom: '16px' }}>
        <SidebarSectionTitle>Contact</SidebarSectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
          {contact.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: template.sidebarText, opacity: 0.9 }}>
              {icons.email(template.sidebarText)}{contact.email}
            </span>
          )}
          {contact.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: template.sidebarText, opacity: 0.9 }}>
              {icons.phone(template.sidebarText)}{contact.phone}
            </span>
          )}
          {contact.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: template.sidebarText, opacity: 0.9 }}>
              {icons.location(template.sidebarText)}{contact.location}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Skills badges for single-column
  const SkillBadges = ({ items, bgColor, textColor: tc, borderColor }: {
    items: string[]; bgColor: string; textColor: string; borderColor: string;
  }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {items.map((s, i) => (
        <span key={i} style={{
          padding: '2px 7px', borderRadius: '4px', fontSize: '10px',
          backgroundColor: bgColor, color: tc, border: `1px solid ${borderColor}`, fontWeight: 500,
        }}>{s}</span>
      ))}
    </div>
  );

  // Sidebar skills (tags on dark bg)
  const SidebarSkills = () => {
    if (!hasSkills) return null;
    const allSkills = [...technicalSkills, ...softSkills, ...toolSkills];
    return (
      <div style={{ marginBottom: '16px' }}>
        <SidebarSectionTitle>Skills</SidebarSectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {allSkills.map((s, i) => (
            <span key={i} style={{
              padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 500,
              backgroundColor: `${template.sidebarText}15`, color: template.sidebarText, opacity: 0.9,
              border: `1px solid ${template.sidebarText}20`,
            }}>{s}</span>
          ))}
        </div>
      </div>
    );
  };

  // Experience section content (shared between layouts)
  const ExperienceContent = ({ textColor: tc, lightColor }: { textColor: string; lightColor: string }) => (
    <>
      {experience.map((exp, i) => {
        const expTitle = String(exp.title || 'Untitled Position');
        const expDates = exp.dates ? String(exp.dates) : '';
        const expCompany = exp.company ? String(exp.company) : '';
        const expLocation = exp.location ? String(exp.location) : '';
        return (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? '12px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: tc }}>
                {expTitle}
              </div>
              {expDates && (
                <div style={{ fontSize: '10px', color: lightColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {expDates}
                </div>
              )}
            </div>
            {(expCompany || expLocation) && (
              <div style={{ fontSize: '11px', color: color, fontWeight: 500, marginTop: '1px' }}>
                {expCompany}{expCompany && expLocation ? ' · ' : ''}{expLocation}
              </div>
            )}
            {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '14px', color: lightColor, fontSize: '11px', lineHeight: '1.6' }}>
                {(exp.achievements as string[]).map((a, j) => (
                  <li key={j} style={{ marginBottom: '1px' }}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );

  // Education section content (shared between layouts)
  const EducationContent = ({ textColor: tc, lightColor }: { textColor: string; lightColor: string }) => (
    <>
      {education.map((edu, i) => {
        const eduDegree = edu.degree ? String(edu.degree) : '';
        const eduField = edu.field ? String(edu.field) : '';
        const eduDates = edu.dates ? String(edu.dates) : '';
        const eduInstitution = edu.institution ? String(edu.institution) : '';
        return (
          <div key={i} style={{ marginBottom: i < education.length - 1 ? '8px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: tc }}>
                {eduDegree}{eduDegree && eduField ? ' in ' : ''}{eduField}
              </div>
              {eduDates && (
                <div style={{ fontSize: '10px', color: lightColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {eduDates}
                </div>
              )}
            </div>
            {eduInstitution && (
              <div style={{ fontSize: '11px', color: color, fontWeight: 500, marginTop: '1px' }}>
                {eduInstitution}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  // ========================================================================
  // SIDEBAR LAYOUT
  // ========================================================================
  if (template.layoutType === 'sidebar') {
    return (
      <div style={{
        fontFamily: template.fontFamily,
        fontSize: '12px',
        lineHeight: '1.5',
        color: template.textColor,
        display: 'flex',
        height: '100%',
        maxWidth: '650px',
        margin: '0 auto',
      }}>
        {/* Sidebar */}
        <div style={{
          width: '35%',
          flexShrink: 0,
          backgroundColor: template.sidebarBg,
          color: template.sidebarText,
          padding: '24px 16px',
          overflowY: 'auto',
        }}>
          {/* Name & Title */}
          {(fullName || title) && (
            <div style={{ marginBottom: '20px' }}>
              {fullName && (
                <h1 style={{
                  fontSize: '18px', fontWeight: 800, color: template.sidebarText,
                  margin: '0 0 3px 0', letterSpacing: '-0.01em', lineHeight: '1.2',
                  fontFamily: template.fontFamily,
                }}>
                  {fullName}
                </h1>
              )}
              {title && (
                <div style={{ fontSize: '11px', color: `${template.sidebarText}BB`, fontWeight: 500 }}>
                  {title}
                </div>
              )}
            </div>
          )}

          <SidebarContact />
          <SidebarSkills />
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          padding: '24px 20px',
          overflowY: 'auto',
          minWidth: 0,
        }}>
          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: '16px' }}>
              <SectionTitle>Professional Summary</SectionTitle>
              <p style={{ margin: 0, color: template.lightText, fontSize: '11.5px', lineHeight: '1.65' }}>
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <SectionTitle>Experience</SectionTitle>
              <ExperienceContent textColor={template.textColor} lightColor={template.lightText} />
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <SectionTitle>Education</SectionTitle>
              <EducationContent textColor={template.textColor} lightColor={template.lightText} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========================================================================
  // SINGLE-COLUMN LAYOUT
  // ========================================================================
  const headerAlign: React.CSSProperties['textAlign'] =
    template.headerStyle === 'centered' ? 'center' : 'left';

  return (
    <div style={{
      fontFamily: template.fontFamily,
      padding: '28px 24px',
      fontSize: '12px',
      lineHeight: '1.5',
      color: template.textColor,
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Header */}
      {(fullName || title) && (
        <div style={{
          marginBottom: '16px',
          textAlign: headerAlign,
          ...(template.headerStyle === 'modern' ? { borderLeft: `3px solid ${color}`, paddingLeft: '12px' } : {}),
        }}>
          {fullName && (
            <h1 style={{
              fontSize: '20px', fontWeight: 800, color: template.textColor,
              margin: '0 0 3px 0', letterSpacing: '-0.02em',
              fontFamily: template.fontFamily,
            }}>
              {fullName}
            </h1>
          )}
          {title && (
            <div style={{ fontSize: '13px', color: color, fontWeight: 600 }}>
              {title}
            </div>
          )}
        </div>
      )}

      <ContactRow />

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ margin: 0, color: template.lightText, fontSize: '11.5px', lineHeight: '1.65' }}>
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle>Experience</SectionTitle>
          <ExperienceContent textColor={template.textColor} lightColor={template.lightText} />
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle>Education</SectionTitle>
          <EducationContent textColor={template.textColor} lightColor={template.lightText} />
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div style={{ marginBottom: '16px' }}>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {technicalSkills.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: template.lightText, marginBottom: '3px' }}>Technical</div>
                <SkillBadges items={technicalSkills} bgColor={`${color}10`} textColor={color} borderColor={`${color}25`} />
              </div>
            )}
            {softSkills.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: template.lightText, marginBottom: '3px' }}>Soft Skills</div>
                <SkillBadges items={softSkills} bgColor="#F1F5F9" textColor="#475569" borderColor="#E2E8F0" />
              </div>
            )}
            {toolSkills.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, color: template.lightText, marginBottom: '3px' }}>Tools</div>
                <SkillBadges items={toolSkills} bgColor="#F0FDF4" textColor="#16A34A" borderColor="#BBF7D0" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
