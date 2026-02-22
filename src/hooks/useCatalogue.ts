import { useState, useMemo } from 'react';
import { activities } from '../data/activities';
import type { Category } from '../lib/types';

export function useCatalogue() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filtered = useMemo(() => {
    return activities.filter(a => {
      const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
      const matchesSearch = search === '' ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

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
    activeCategory,
    setActiveCategory,
    filtered,
    groupedFiltered,
  };
}
