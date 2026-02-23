import { useState, useCallback } from 'react';
import { getFavouriteActivities, toggleFavouriteActivity } from '../lib/localStore';

export function useFavourites() {
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set(getFavouriteActivities()));

  const toggle = useCallback((id: string) => {
    const updated = toggleFavouriteActivity(id);
    setFavourites(new Set(updated));
  }, []);

  const isFavourite = useCallback((id: string) => favourites.has(id), [favourites]);

  return { favourites, toggle, isFavourite };
}
