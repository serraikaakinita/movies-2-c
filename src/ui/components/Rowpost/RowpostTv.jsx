import React, { useEffect, useState } from "react";
import "./Rowpost.css";
import axios from "../Banner/axios";
import TvserieCard from "../TvserieList/TvserieCard";

const imageUrl = "https://image.tmdb.org/t/p/original";

function RowpostTv(props) {
  const [series, setSeries] = useState([]);
  useEffect(() => {
    axios.get(props.url).then((response) => {
      setSeries(response.data.results);
    });
  }, []);

  return (
    <div>
      <div className="postersRow">
        <h2>{props.title}</h2>
        <div className={props.isSmall ? "postersSM" : "posters"}>
          {series.map((series) => (
            <TvserieCard
              key={series.id}
              id={series.id}
              seriesName={series.title}
              seriesPoster={series.poster_path}
              seriesDate={series.release_date}
              seriesRating={series.vote_average}
              seriesDescription={series.overview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RowpostTv;
