/**
 * Generate "Add to Calendar" URLs for interviews.
 * No OAuth required — these are simple URL templates.
 */

interface CalendarEventInput {
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  candidateName?: string | null;
}

/** Format a Date to Google Calendar format: YYYYMMDDTHHmmssZ */
function toGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Format a Date to ISO string without milliseconds (for Outlook) */
function toOutlookDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function buildDescription(input: CalendarEventInput): string {
  const lines: string[] = [];
  if (input.candidateName) lines.push(`Candidate: ${input.candidateName}`);
  if (input.meetingLink) lines.push(`Meeting Link: ${input.meetingLink}`);
  if (input.notes) lines.push(`\nNotes: ${input.notes}`);
  lines.push('\nScheduled via HireKit');
  return lines.join('\n');
}

export function generateGoogleCalendarUrl(input: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${toGoogleDate(input.startTime)}/${toGoogleDate(input.endTime)}`,
    details: buildDescription(input),
  });

  if (input.location) params.set('location', input.location);
  if (input.meetingLink && !input.location) params.set('location', input.meetingLink);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarUrl(input: CalendarEventInput): string {
  const params = new URLSearchParams({
    subject: input.title,
    startdt: toOutlookDate(input.startTime),
    enddt: toOutlookDate(input.endTime),
    body: buildDescription(input),
    path: '/calendar/action/compose',
    rru: 'addevent',
  });

  if (input.location) params.set('location', input.location);
  if (input.meetingLink && !input.location) params.set('location', input.meetingLink);

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
