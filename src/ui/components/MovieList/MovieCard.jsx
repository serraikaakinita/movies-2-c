import React from "react";
import "./MovieCard.css";
import { useFavorites } from "../../../context/FavoritesContext";

function MovieCard(props) {
  const {
    id,
    movieName,
    moviePoster,
    movieDate,
    movieRating,
    movieDescription,
  } = props;

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite({
        id,
        title: movieName,
        poster_path: moviePoster,
        release_date: movieDate,
        vote_average: movieRating,
        overview: movieDescription,
      });
    } catch (err) {
      alert(err.message || "Failed to update favourites");
    }
  };

  const truncatedDescription = React.useMemo(() => {
    if (!movieDescription) return "";
    const words = movieDescription.split(/\s+/);
    if (words.length <= 50) return movieDescription;
    return words.slice(0, 50).join(" ") + "...";
  }, [movieDescription]);

  return (
    <a href={`/movie/:${id}`} className="movie_card">
      <div className="movie_fav_icon_wrapper">
        <button
          className={`movie_fav_icon ${fav ? "movie_fav_icon--active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>


      <img
        src={
          "https://media.themoviedb.org/t/p/w220_and_h330_face/" + moviePoster
        }
        alt={movieName}
        className="movie_poster"
      />


      <div className="movie_overlay">
        <h3 className="movie_overlay_title">{movieName}</h3>

        <div className="movie_overlay_meta">
          <span>{movieDate}</span>
          <span>⭐ {movieRating}</span>
        </div>

        <p className="movie_overlay_description">{truncatedDescription}</p>
      </div>
    </a>
  );
}

export default MovieCard;
