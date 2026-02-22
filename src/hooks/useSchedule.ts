import { useState, useEffect, useCallback } from 'react';
import type { Schedule, ScheduledActivity } from '../lib/types';
import { addDays, format } from '../lib/dateUtils';
import {
  getSchedule,
  saveSchedule,
  getActivities,
  upsertActivity,
  patchActivity,
  removeActivity,
  updateStartDate,
  updateDuration,
  clearAll,
  clearActivities,
} from '../lib/localStore';

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [activities, setActivities] = useState<ScheduledActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const sched = getSchedule();
    const acts = sched ? getActivities().filter(a => a.schedule_id === sched.id) : [];
    setSchedule(sched);
    setActivities(acts);
    setLoading(false);
  }, []);

  const createSchedule = useCallback(async (startDate: Date, duration = 10): Promise<Schedule> => {
    const sched: Schedule = {
      id: crypto.randomUUID(),
      session_id: 'local',
      start_date: format(startDate),
      duration,
      created_at: new Date().toISOString(),
    };
    saveSchedule(sched);
    setSchedule(sched);
    setActivities([]);
    return sched;
  }, []);

  const addActivity = useCallback(async (data: {
    dayNumber: number;
    activity_name: string;
    scheduled_time: string;
    catalogue_id?: string | null;
    category?: string | null;
  }): Promise<void> => {
    if (!schedule) throw new Error('No schedule loaded');
    const scheduledDate = format(addDays(new Date(schedule.start_date + 'T00:00:00'), data.dayNumber - 1));

    const activity: ScheduledActivity = {
      id: crypto.randomUUID(),
      schedule_id: schedule.id,
      day_number: data.dayNumber,
      scheduled_date: scheduledDate,
      scheduled_time: data.scheduled_time,
      activity_name: data.activity_name,
      catalogue_id: data.catalogue_id ?? null,
      category: (data.category as ScheduledActivity['category']) ?? null,
      pre_achievement: null,
      pre_connection: null,
      pre_enjoyment: null,
      post_achievement: null,
      post_connection: null,
      post_enjoyment: null,
      completed: false,
      notes: null,
      created_at: new Date().toISOString(),
    };

    upsertActivity(activity);
    setActivities(prev => [...prev, activity]);
  }, [schedule]);

  const updateActivity = useCallback(async (
    activityId: string,
    updates: Partial<ScheduledActivity>
  ): Promise<void> => {
    patchActivity(activityId, updates);
    setActivities(prev =>
      prev.map(a => a.id === activityId ? { ...a, ...updates } : a)
    );
  }, []);

  const deleteActivity = useCallback(async (activityId: string): Promise<void> => {
    removeActivity(activityId);
    setActivities(prev => prev.filter(a => a.id !== activityId));
  }, []);

  const changeStartDate = useCallback((newDate: string): void => {
    updateStartDate(newDate);
    const sched = getSchedule();
    const acts = sched ? getActivities().filter(a => a.schedule_id === sched.id) : [];
    setSchedule(sched);
    setActivities(acts);
  }, []);

  const resetSchedule = useCallback((): void => {
    clearAll();
    setSchedule(null);
    setActivities([]);
  }, []);

  const resetActivitiesOnly = useCallback((): void => {
    clearActivities();
    setActivities([]);
  }, []);

  const changeDuration = useCallback((newDuration: number): void => {
    updateDuration(newDuration);
    const sched = getSchedule();
    setSchedule(sched);
  }, []);

  return {
    schedule,
    activities,
    loading,
    error,
    createSchedule,
    addActivity,
    updateActivity,
    deleteActivity,
    changeStartDate,
    changeDuration,
    resetSchedule,
    resetActivitiesOnly,
  };
}
