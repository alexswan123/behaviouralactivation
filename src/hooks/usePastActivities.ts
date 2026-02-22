import { useState, useCallback } from 'react';
import type { PastActivity } from '../lib/types';
import { getPastActivities, addPastActivity, removePastActivity } from '../lib/localStore';

export function usePastActivities() {
  const [items, setItems] = useState<PastActivity[]>(() => getPastActivities());

  const add = useCallback((text: string) => {
    if (!text.trim()) return;
    const item = addPastActivity(text);
    setItems(prev => [...prev, item]);
  }, []);

  const remove = useCallback((id: string) => {
    removePastActivity(id);
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  return { items, add, remove };
}
