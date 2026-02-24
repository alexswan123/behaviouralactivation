import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScheduledActivity } from '../lib/types';
import { getNotificationPrefs, setNotificationPrefs } from '../lib/localStore';
import {
  isSupported,
  hasPermission,
  requestPermission,
  showNotification,
  wasNotificationSent,
  markNotificationSent,
} from '../lib/notifications';
import { track } from '../lib/analytics';

const POLL_INTERVAL = 60_000; // 60 seconds

export function useNotifications(activities: ScheduledActivity[]) {
  const [prefs, setPrefs] = useState(getNotificationPrefs);
  const [supported] = useState(isSupported);
  const activitiesRef = useRef(activities);
  activitiesRef.current = activities;
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // Poll for upcoming activities
  useEffect(() => {
    if (!supported || !prefs.enabled || !hasPermission()) return;

    function check() {
      const p = prefsRef.current;
      if (!p.enabled) return;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      for (const act of activitiesRef.current) {
        if (act.completed) continue;
        if (act.scheduled_date !== todayStr) continue;
        if (!act.scheduled_time) continue;
        if (wasNotificationSent(act.id, act.scheduled_date)) continue;

        const [h, m] = act.scheduled_time.split(':').map(Number);
        const actTime = new Date(now);
        actTime.setHours(h, m, 0, 0);

        const diffMs = actTime.getTime() - now.getTime();
        const diffMin = diffMs / 60_000;

        // Fire if within the reminder window and not in the past
        if (diffMin > 0 && diffMin <= p.minutesBefore) {
          showNotification(act.activity_name, Math.round(diffMin));
          markNotificationSent(act.id, act.scheduled_date);
        }
      }
    }

    // Check immediately, then poll
    check();
    const id = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [supported, prefs.enabled]);

  const toggleReminders = useCallback(async () => {
    if (prefs.enabled) {
      const next = { ...prefs, enabled: false };
      setNotificationPrefs(next);
      setPrefs(next);
      track.remindersDisabled();
    } else {
      const granted = await requestPermission();
      if (granted) {
        const next = { ...prefs, enabled: true };
        setNotificationPrefs(next);
        setPrefs(next);
        track.remindersEnabled();
      }
      // If denied, prefs stay disabled — UI will show blocked state
    }
  }, [prefs]);

  const setMinutesBefore = useCallback((minutes: number) => {
    const next = { ...prefsRef.current, minutesBefore: minutes };
    setNotificationPrefs(next);
    setPrefs(next);
  }, []);

  return {
    enabled: prefs.enabled,
    supported,
    permissionDenied: supported && Notification.permission === 'denied',
    minutesBefore: prefs.minutesBefore,
    toggleReminders,
    setMinutesBefore,
  };
}
