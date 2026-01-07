import { authFetch } from "./authenticationService";

export async function fetchFavorites() {
  const res = await authFetch("/api/users/me/favorites/movies");
  if (!res.ok) throw new Error("Failed to load favourites");
  return res.json();
}

export async function fetchFavoritesCount() {
  const res = await authFetch("/api/users/me/favorites/movies/count");
  if (!res.ok) throw new Error("Failed to load favourites count");
  return res.json();
}

export async function addFavorite(movie) {
  const body = {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
  };

  const res = await authFetch("/api/users/me/favorites/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to add favourite");
  }

  return res.json();
}

export async function removeFavorite(movieId) {
  const res = await authFetch(`/api/users/me/favorites/movies/${movieId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to remove favourite");
  }

  return res.text();
}
