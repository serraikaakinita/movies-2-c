import React, { useState } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import { useEffect } from "react";

const MovieList = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/trending`
    )
      .then((res) => res.json())
      .then((data) => setTrendingMovies(data.results));
  }, []);

  return (
    <section className="movie_list">
      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Popular Movies</h2>
        <div className="align_center movie_list_fs">
          <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul>
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": trendingMovies.length }}
        >
          {trendingMovies.map((movie, i) => (
            <article style={{ "--i": i }} key={i}>
              <MovieCard
                id={movie.id}
                movieName={movie.title}
                moviePoster={movie.poster_path}
                movieDate={movie.release_date}
                movieRating={movie.vote_average}
                movieDescription={movie.overview}
              ></MovieCard>
            </article>
          ))}
        </div>
      </div>
      {/* <div className="movie_cards">
        {trendingMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movieName={movie.title}
            moviePoster={movie.poster_path}
            movieDate={movie.release_date}
            movieRating={movie.vote_average}
            movieDescription={movie.overview}
          ></MovieCard>
        ))}
      </div> */}
    </section>
  );
};
export default MovieList;
