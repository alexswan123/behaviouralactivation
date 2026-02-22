export function format(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatDayHeader(dateStr: string): { weekday: string; date: string } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  };
}

export function isInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date < today;
}

export function isToday(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
