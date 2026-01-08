import React, { useEffect, useState } from "react";
import "./Rowpost.css";
import axios from "../Banner/axios";
import MovieCard from "../MovieList/MovieCard";

const imageUrl = "https://image.tmdb.org/t/p/original";

function Rowpost(props) {
  const [movie, setMovie] = useState([]);
  useEffect(() => {
    axios.get(props.url).then((response) => {
      setMovie(response.data.results);
    });
  }, []);

  return (
    <div>
      <div className="postersRow">
        <h2>{props.title}</h2>
        <div className={props.isSmall ? "postersSM" : "posters"}>
          {movie.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              movieName={movie.title}
              moviePoster={movie.poster_path}
              movieDate={movie.release_date}
              movieRating={movie.vote_average}
              movieDescription={movie.overview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rowpost;
