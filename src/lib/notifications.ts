/**
 * Browser Notification API helpers for activity reminders.
 */

const SENT_KEY = 'ba_sent_notifications';

export function isSupported(): boolean {
  return 'Notification' in window;
}

export function hasPermission(): boolean {
  return isSupported() && Notification.permission === 'granted';
}

export async function requestPermission(): Promise<boolean> {
  if (!isSupported()) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function showNotification(activityName: string, minutesBefore: number): Promise<void> {
  if (!hasPermission()) return;
  const body = `${activityName} starts in ${minutesBefore} minutes`;

  // Use service worker notification when available (required for iOS PWA)
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification('Bloom', { body, icon: '/icon-192.png' });
    return;
  }

  const n = new Notification('Bloom', { body, icon: '/favicon.svg' });
  n.onclick = () => {
    window.focus();
    n.close();
  };
}

// ── Duplicate prevention ────────────────────────────────────────────────────

function getSentKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    if (!raw) return new Set();
    const entries = JSON.parse(raw) as { key: string; ts: number }[];
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    // Clean up old entries
    const fresh = entries.filter(e => e.ts > twoDaysAgo);
    if (fresh.length !== entries.length) {
      localStorage.setItem(SENT_KEY, JSON.stringify(fresh));
    }
    return new Set(fresh.map(e => e.key));
  } catch {
    return new Set();
  }
}

export function wasNotificationSent(activityId: string, date: string): boolean {
  return getSentKeys().has(`${activityId}-${date}`);
}

export function markNotificationSent(activityId: string, date: string): void {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    const entries: { key: string; ts: number }[] = raw ? JSON.parse(raw) : [];
    entries.push({ key: `${activityId}-${date}`, ts: Date.now() });
    localStorage.setItem(SENT_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

export function clearSentNotifications(): void {
  localStorage.removeItem(SENT_KEY);
}
