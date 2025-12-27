import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Row from "../ui/Row";
import "./Homepage.css";
import MovieList from "../ui/components/MovieList/MovieList";
import SearchedMoviesView from "../ui/components/SearchedMoviesView";

function Homepage() {
  const location = useLocation();
  const[searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchTerm(q);
  }, [location.search]);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setMovies([]);
      setError("");
      return;
    }

  const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");

          const url =
            `https://movies2cbackend-production.up.railway.app/api/search/movie?name=${encodeURIComponent}`;
            //`http://localhost:8080/api/search/movie?name=${encodeURIComponent(trimmed)}`;
          console.log("Fetching...", url)

          const res = await fetch(url,{signal: controller.signal});
          if (!res.ok) throw new Error("Failed to fetch movies");

          const data = await res.json();

          const results = Array.isArray(data)
            ? data
            : data.results || data.movies || data.Search || [];

          setMovies(results);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Error:", err.message);
            setError(err.message || "Something Went Wrong");
          }
        } 
      }
       
      fetchMovies();

      return () => controller.abort();
    }, [searchTerm]);


  return (
    <div>
      <Row type="vertical" content="center">
        {searchTerm.trim() ? (
          <SearchedMoviesView movies={movies} />
        ) : (
          <MovieList/>
        )}
        {error && <p style={{color: "red"}}>{error}</p>}
      </Row>
    </div>
  );
}

export default Homepage;
