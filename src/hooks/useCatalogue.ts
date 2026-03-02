import { useState, useMemo } from 'react';
import { activities } from '../data/activities';
import type { Context } from '../lib/types';

export type EffortFilter = 'all' | 'low' | 'quick';

export function useCatalogue() {
  const [search, setSearch] = useState('');
  const [activeContext, setActiveContext] = useState<Context | 'all'>('all');
  const [effortFilter, setEffortFilter] = useState<EffortFilter>('all');

  const filtered = useMemo(() => {
    return activities.filter(a => {
      const matchesContext = activeContext === 'all' || a.context === activeContext;
      const matchesEffort =
        effortFilter === 'all' ||
        (effortFilter === 'low' && a.effort === 'low') ||
        (effortFilter === 'quick' && a.durationMinutes !== undefined && a.durationMinutes <= 5);
      const matchesSearch = search === '' ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchesContext && matchesEffort && matchesSearch;
    });
  }, [search, activeContext, effortFilter]);

  const groupedByContext = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const activity of filtered) {
      const key = activity.context;
      if (!groups[key]) groups[key] = [];
      groups[key].push(activity);
    }
    return groups;
  }, [filtered]);

  // Keep grouped by category:group for backward compat with catalogue page sub-grouping
  const groupedFiltered = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const activity of filtered) {
      const key = `${activity.category}:${activity.group}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(activity);
    }
    return groups;
  }, [filtered]);

  return {
    search,
    setSearch,
    activeContext,
    setActiveContext,
    effortFilter,
    setEffortFilter,
    filtered,
    groupedFiltered,
    groupedByContext,
  };
}
