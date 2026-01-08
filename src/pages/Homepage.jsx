import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Row from "../ui/Row";
import "./Homepage.css";
import MovieList from "../ui/components/MovieList/MovieList";
import SearchedMoviesView from "../ui/components/SearchedMoviesView";
import Navbar from "../ui/components/Navbar/Navbar";
import SearchBar from "../ui/components/SearchBar/SearchBar";
import Button from "../ui/Button";

function Homepage(props) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError("");

          const res = await fetch(
            `https://movies2cbackend-production.up.railway.app/api/search/movie?name=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.results);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          //setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div>
      <Row type="vertical" content="center">
        {/* <Row content="center" type="horizontal">
          <SearchBar query={query} setQuery={setQuery} />
        </Row> */}
        <Navbar
          user={props.user}
          onLogout={props.onLogout}
          query={query}
          setQuery={setQuery}
        />
        {query.length > 3 ? (
          <SearchedMoviesView movies={movies} />
        ) : (
          <MovieList />
        )}
      </Row>
    </div>
  );
}

export default Homepage;
