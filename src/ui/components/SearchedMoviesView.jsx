import MovieCard from "./MovieList/MovieCard";
import "./SearchedMoviesView.css";

function SearchedMoviesView(props) {
  return (
    <div className="movie_cards">
      {props.movies.map((movie) => (
        <MovieCard
          id={movie.id}
          movieName={movie.title}
          moviePoster={movie.poster_path}
          movieDate={movie.release_date}
          movieRating={movie.vote_average}
          movieDescription={movie.overview}
        ></MovieCard>
      ))}
    </div>
  );
}
export default SearchedMoviesView;
