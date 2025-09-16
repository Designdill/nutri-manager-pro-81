import { useState, useEffect } from "react";

const FAVORITES_STORAGE_KEY = "settings-favorites";

export function useSettingsFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addFavorite = (tabId: string) => {
    const newFavorites = [...favorites, tabId];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const removeFavorite = (tabId: string) => {
    const newFavorites = favorites.filter(id => id !== tabId);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (tabId: string) => {
    if (favorites.includes(tabId)) {
      removeFavorite(tabId);
    } else {
      addFavorite(tabId);
    }
  };

  const isFavorite = (tabId: string) => favorites.includes(tabId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}