import React, { useState } from "react";
import "../MovieList/MovieList.css";
import { useEffect } from "react";

import Rowpost from "../Rowpost/Rowpost";
import TvserieCard from "./TvserieCard";
import RowpostTv from "../Rowpost/RowpostTv";
// import Bannertv from "../Banner/Bannertv";

const TvserieList = () => {
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [comedySeries, setComedySeries] = useState([]);
  const [actionSeries, setActionSeries] = useState([]);

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/tvseries/trending`
    )
      .then((res) => res.json())
      .then((data) => setTrendingSeries(data.results));
  }, []);

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/tv/genre?genreId=35`
    )
      .then((res) => res.json())
      .then((data) => setComedySeries(data.results));
  }, []);

  useEffect(function () {
    fetch(
      `https://movies2cbackend-production.up.railway.app/api/tv/genre?genreId=10759`
    )
      .then((res) => res.json())
      .then((data) => setActionSeries(data.results));
  }, []);

  return (
    <section className="movie_list">
      {/* <Bannertv url={`tv/trending`} /> */}
      <header className="align_center movie_list_header">
        <h2 className="align_center movie_list_heading">Popular Series</h2>
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
          style={{ "--items": trendingSeries.length }}
        >
          {trendingSeries.map((series, i) => (
            <article style={{ "--i": i }} key={i}>
              <TvserieCard
                id={series.id}
                seriesName={series.title}
                seriesPoster={series.poster_path}
                seriesDate={series.release_date}
                seriesRating={series.vote_average}
                seriesDescription={series.overview}
              />
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

      <RowpostTv url={`tv/genre?genreId=35`} title="Comedy" />

      <RowpostTv url={`tv/genre?genreId=10759`} title="Action" />
    </section>
  );
};
export default TvserieList;
