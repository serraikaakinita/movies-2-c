import React, { useState } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import { useEffect } from "react";

const MovieList = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [animationMovies, setAnimationMovies]= useState([]);
  const [horrorMovies, setHorrorMovies]= useState([]);
  const [criminalMovies, setCriminalMovies]= useState([]);

 useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/trending`
    )
      .then((res) => res.json())
      .then((data) => setTrendingMovies(data.results));
  }, []); 

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/genre?genreId=35`
    )
      .then((res) => res.json())
      .then((data) => setComedyMovies(data.results));
  }, []);

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/genre?genreId=28`
    )
      .then((res) => res.json())
      .then((data) => setActionMovies(data.results));
  }, []);

    useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/genre?genreId=16`
    )
      .then((res) => res.json())
      .then((data) => setAnimationMovies(data.results));
  }, []);

    useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/genre?genreId=27`
    )
      .then((res) => res.json())
      .then((data) => setHorrorMovies(data.results));
  }, []);

    useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/movies/genre?genreId=80`
    )
      .then((res) => res.json())
      .then((data) => setCriminalMovies(data.results));
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

      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Comedie Movies</h2>
        <div className="align_center movie_list_fs">
          {/* <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul> */}
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": comedyMovies.length }}
        >
          {comedyMovies.map((movie, i) => (
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

       <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Action Movies</h2>
        <div className="align_center movie_list_fs">
          {/* <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul> */}
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": actionMovies.length }}
        >
          {actionMovies.map((movie, i) => (
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

      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Animation Movies</h2>
        <div className="align_center movie_list_fs">
          {/* <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul> */}
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": animationMovies.length }}
        >
          {animationMovies.map((movie, i) => (
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

      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Horror Movies</h2>
        <div className="align_center movie_list_fs">
          {/* <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul> */}
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": horrorMovies.length }}
        >
          {horrorMovies.map((movie, i) => (
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

      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Crime Movies</h2>
        <div className="align_center movie_list_fs">
          {/* <ul className="align_center movie_filter">
            <li className="movie_filter_item">Trending</li>
          </ul> */}
        </div>
      </header>
      <div className="carousel_container">
        <div
          className="carousel"
          mask="true"
          style={{ "--items": criminalMovies.length }}
        >
          {criminalMovies.map((movie, i) => (
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

    </section>
    
  );
};
export default MovieList;
