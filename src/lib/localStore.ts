/**
 * localStorage-backed data store.
 * Mirrors the Supabase schema so the hook interface stays identical.
 */
import type { Schedule, ScheduledActivity, PastActivity } from './types';
import { clearSentNotifications } from './notifications';

const KEYS = {
  schedule: 'ba_schedule',
  activities: 'ba_activities',
  pastActivities: 'ba_past_activities',
} as const;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Schedule ────────────────────────────────────────────────────────────────

export function getSchedule(): Schedule | null {
  return read<Schedule>(KEYS.schedule);
}

export function saveSchedule(schedule: Schedule): void {
  write(KEYS.schedule, schedule);
}

// ── Activities ───────────────────────────────────────────────────────────────

export function getActivities(): ScheduledActivity[] {
  return read<ScheduledActivity[]>(KEYS.activities) ?? [];
}

export function upsertActivity(activity: ScheduledActivity): void {
  const all = getActivities();
  const idx = all.findIndex(a => a.id === activity.id);
  if (idx === -1) {
    all.push(activity);
  } else {
    all[idx] = { ...all[idx], ...activity };
  }
  write(KEYS.activities, all);
}

export function patchActivity(id: string, updates: Partial<ScheduledActivity>): void {
  const all = getActivities();
  const idx = all.findIndex(a => a.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    write(KEYS.activities, all);
  }
}

export function removeActivity(id: string): void {
  write(KEYS.activities, getActivities().filter(a => a.id !== id));
}

export function clearAll(): void {
  localStorage.removeItem(KEYS.schedule);
  localStorage.removeItem(KEYS.activities);
  clearSentNotifications();
}

export function clearActivities(): void {
  localStorage.removeItem(KEYS.activities);
}

export function updateDuration(newDuration: number): void {
  const sched = getSchedule();
  if (!sched) return;
  write(KEYS.schedule, { ...sched, duration: newDuration });
}

export function updateStartDate(newDate: string): void {
  const sched = getSchedule();
  if (!sched) return;
  write(KEYS.schedule, { ...sched, start_date: newDate });
  // Recalculate each activity's scheduled_date from new start + day_number
  const acts = getActivities().map(a => {
    const d = new Date(newDate + 'T00:00:00');
    d.setDate(d.getDate() + a.day_number - 1);
    return { ...a, scheduled_date: d.toISOString().split('T')[0] };
  });
  write(KEYS.activities, acts);
}

// ── Past activities ("things I used to do") ──────────────────────────────────

export function getPastActivities(): PastActivity[] {
  return read<PastActivity[]>(KEYS.pastActivities) ?? [];
}

export function addPastActivity(text: string): PastActivity {
  const item: PastActivity = { id: crypto.randomUUID(), text: text.trim(), created_at: new Date().toISOString() };
  const all = getPastActivities();
  write(KEYS.pastActivities, [...all, item]);
  return item;
}

export function removePastActivity(id: string): void {
  write(KEYS.pastActivities, getPastActivities().filter(p => p.id !== id));
}

// ── Notification preferences ──────────────────────────────────────────────────

const NOTIFICATION_KEY = 'ba_notification_prefs';

export interface NotificationPrefs {
  enabled: boolean;
  minutesBefore: number;
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = { enabled: false, minutesBefore: 15 };

export function getNotificationPrefs(): NotificationPrefs {
  return read<NotificationPrefs>(NOTIFICATION_KEY) ?? DEFAULT_NOTIFICATION_PREFS;
}

export function setNotificationPrefs(prefs: NotificationPrefs): void {
  write(NOTIFICATION_KEY, prefs);
}

// ── Favourite catalogue activities ────────────────────────────────────────────

const FAV_KEY = 'ba_favourite_activities';

export function getFavouriteActivities(): string[] {
  return read<string[]>(FAV_KEY) ?? [];
}

export function toggleFavouriteActivity(id: string): string[] {
  const current = getFavouriteActivities();
  const updated = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  write(FAV_KEY, updated);
  return updated;
}
