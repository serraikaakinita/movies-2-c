import TvserieCard from "./TvserieList/TvserieCard";
import "./SearchedMoviesView.css";

function SearchedSeriesView(props) {
  return (
    <div className="movie_cards">
      {props.series.map((series) => (
        <TvserieCard
          id={series.id}
          seriesName={series.title}
          seriesPoster={series.poster_path}
          seriesDate={series.release_date}
          seriesRating={series.vote_average}
          seriesDescription={series.overview}
        />
      ))}
    </div>
  );
}
export default SearchedSeriesView;
