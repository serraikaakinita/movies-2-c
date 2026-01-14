import React from "react";
import "../MovieList/MovieCard.css";
import { useFavorites } from "../../../context/FavoritesContext";

function TvserieCard(props) {
  const {
    id,
    seriesName,
    seriesPoster,
    seriesDate,
    seriesRating,
    seriesDescription,
  } = props;

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite({
        id,
        title: seriesName,
        poster_path: seriesPoster,
        release_date: seriesDate,
        vote_average: seriesRating,
        overview: seriesDescription,
      });
    } catch (err) {
      alert(err.message || "Failed to update favourites");
    }
  };

  const truncatedDescription = React.useMemo(() => {
    if (!seriesDescription) return "";
    const words = seriesDescription.split(/\s+/);
    if (words.length <= 50) return seriesDescription;
    return words.slice(0, 50).join(" ") + "...";
  }, [seriesDescription]);

  return (
    <a href={`/tv/:${id}`} className="movie_card">
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
          "https://media.themoviedb.org/t/p/w220_and_h330_face/" + seriesPoster
        }
        alt={seriesName}
        className="movie_poster"
      />

      <div className="movie_overlay">
        <h3 className="movie_overlay_title">{seriesName}</h3>

        <div className="movie_overlay_meta">
          <span>{seriesDate}</span>
          <span>⭐ {seriesRating}</span>
        </div>

        <p className="movie_overlay_description">{truncatedDescription}</p>
      </div>
    </a>
  );
}

export default TvserieCard;
