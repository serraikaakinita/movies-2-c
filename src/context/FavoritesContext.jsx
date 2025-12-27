import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoritesService";
import { isAuthenticated } from "../services/authenticationService";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setFavorites([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchFavorites()
      .then((data) => {
        if (!cancelled) setFavorites(data || []);
      })
      .catch(() => {
        if (!cancelled) setFavorites([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const favouritesIdsSet = useMemo(
    () => new Set(favorites.map((f) => f.movieId)),
    [favorites]
  );

  const isFavorite = (movieId) => favouritesIdsSet.has(movieId);

  const toggleFavorite = async (movie) => {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to use favourites");
    }

    const id = movie.id;

    if (isFavorite(id)) {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.movieId !== id));
    } else {
      const created = await addFavorite(movie);
      setFavorites((prev) => [...prev, created]);
    }
  };

  const value = {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
}
