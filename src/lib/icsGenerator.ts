import type { Schedule, ScheduledActivity } from './types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

/** Format a date+time string as ICS local time: YYYYMMDDTHHMMSS */
function icsLocal(dateStr: string, timeStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const [h, min] = timeStr.split(':');
  return `${y}${m}${d}T${h}${min}00`;
}

/** Add one hour to a time string */
function addOneHour(dateStr: string, timeStr: string): string {
  const [h, min] = timeStr.split(':').map(Number);
  const endH = (h + 1) % 24;
  return icsLocal(dateStr, `${pad2(endH)}:${pad2(min)}`);
}

/** UTC stamp for DTSTAMP */
function nowUtc(): string {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/** Fold long lines per RFC 5545 (max 75 octets, continuation starts with space) */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (i === 0) {
      chunks.push(line.slice(0, 75));
      i = 75;
    } else {
      chunks.push(' ' + line.slice(i, i + 74));
      i += 74;
    }
  }
  return chunks.join('\r\n');
}

/** Escape special chars in ICS text values */
function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// ── Google Calendar URL ───────────────────────────────────────────────────────

export function googleCalendarUrl(act: ScheduledActivity): string {
  const start = icsLocal(act.scheduled_date, act.scheduled_time);
  const end   = addOneHour(act.scheduled_date, act.scheduled_time);

  const descParts: string[] = [];
  if (act.category) descParts.push(`Category: ${act.category.charAt(0).toUpperCase() + act.category.slice(1)}`);
  if (act.pre_achievement !== null || act.pre_connection !== null || act.pre_enjoyment !== null) {
    descParts.push(`Expected — A:${act.pre_achievement ?? '–'} C:${act.pre_connection ?? '–'} E:${act.pre_enjoyment ?? '–'}`);
  }
  if (act.notes) descParts.push(`Notes: ${act.notes}`);
  descParts.push('Added by Bloom — behavioural activation');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: act.activity_name,
    dates: `${start}/${end}`,
    details: descParts.join('\n'),
    sf: 'true',
    output: 'xml',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ── ICS file builder ──────────────────────────────────────────────────────────

export function generateICS(_schedule: Schedule, activities: ScheduledActivity[], programmeName: string, reminderMinutes?: number): string {
  const dtstamp = nowUtc();

  const events = activities.map(act => {
    const dtstart = icsLocal(act.scheduled_date, act.scheduled_time);
    const dtend   = addOneHour(act.scheduled_date, act.scheduled_time);

    const descParts: string[] = [];
    if (act.category) descParts.push(`Category: ${act.category.charAt(0).toUpperCase() + act.category.slice(1)}`);
    const hasPre = act.pre_achievement !== null || act.pre_connection !== null || act.pre_enjoyment !== null;
    if (hasPre) {
      descParts.push(`Expected — A:${act.pre_achievement ?? '–'}  C:${act.pre_connection ?? '–'}  E:${act.pre_enjoyment ?? '–'}`);
    }
    if (act.notes) descParts.push(`Notes: ${act.notes}`);
    descParts.push('');
    descParts.push('Added by Bloom — behavioural activation');
    const description = escapeText(descParts.join('\n'));

    const uid = `${act.id}@bloom-ba`;

    const alarm = reminderMinutes != null ? [
      'BEGIN:VALARM',
      'TRIGGER:-PT' + reminderMinutes + 'M',
      'ACTION:DISPLAY',
      fold(`DESCRIPTION:${escapeText(act.activity_name)} starts in ${reminderMinutes} minutes`),
      'END:VALARM',
    ] : [];

    return [
      'BEGIN:VEVENT',
      fold(`UID:${uid}`),
      fold(`DTSTAMP:${dtstamp}`),
      fold(`DTSTART:${dtstart}`),
      fold(`DTEND:${dtend}`),
      fold(`SUMMARY:${escapeText(act.activity_name)}`),
      fold(`DESCRIPTION:${description}`),
      act.category ? fold(`CATEGORIES:${act.category.toUpperCase()}`) : null,
      'STATUS:CONFIRMED',
      ...alarm,
      'END:VEVENT',
    ].filter(Boolean).join('\r\n');
  });

  const calName = `Bloom — My ${programmeName}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bloom//Behavioural Activation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    fold(`X-WR-CALNAME:${escapeText(calName)}`),
    `X-WR-TIMEZONE:${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    ...events,
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}
