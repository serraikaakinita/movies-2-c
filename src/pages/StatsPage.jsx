import { useState, useEffect } from "react";
import Navbar from "../ui/components/Navbar/Navbar";
import MovieStats from "../ui/components/MovieStats/MovieStats";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import "./StatsPage.css";

export default function StatsPage({ user, onLogout }) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPosterUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200x300?text=No+Image";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/search/movie?name=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        
        if (data.Response === "False" || !data.results) {
            setMovies([]);
        } else {
            setMovies(data.results);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      return;
    }
    fetchMovies();
    return () => controller.abort();
  }, [query]);

  const getMovieStats = (movie) => {
    if (movie.kpi_box_office) {
      return { box: movie.kpi_box_office, award: movie.kpi_award_potential, star: movie.kpi_star_power };
    }
    const seedString = movie._id || movie.id || movie.title || "default";
    let seed = 0;
    for (let i = 0; i < seedString.toString().length; i++) {
        seed += seedString.toString().charCodeAt(i);
    }
    return {
      box: (seed * 37) % 80 + 20, 
      award: (seed * 19) % 90 + 10,
      star: (seed * 53) % 70 + 30
    };
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setQuery("");
    setMovies([]);
  };

  const handleBack = () => {
    setSelectedMovie(null);
    setQuery("");
    setMovies([]);
  };

  const stats = selectedMovie ? getMovieStats(selectedMovie) : null;

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="stats-page-container">
        {!selectedMovie && (
          <div className="search-section">
            <h1 className="stats-title">Analytics & Projections</h1>
            <p className="stats-subtitle">Αναζήτησε ταινία για να δεις την ανάλυση </p>

            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                className="stats-search-input"
                placeholder="Πληκτρολόγησε τίτλο ταινίας (π.χ. Avatar)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {loading && <p className="loading-text">Αναζήτηση...</p>}

            <div className="results-grid">
              {movies.map((movie) => (
                <div key={movie._id || movie.id} className="movie-result-card" onClick={() => handleSelectMovie(movie)}>
                  <img 
                    src={getPosterUrl(movie.poster_path || movie.poster)} 
                    alt={movie.title} 
                    className="result-poster"
                  />
                  <div className="result-info">
                    <h3>{movie.title || movie.name}</h3>
                    <span>{(movie.release_date || "").substring(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {query.length > 2 && movies.length === 0 && !loading && (
                <p className="no-results">Δεν βρέθηκαν ταινίες.</p>
            )}
          </div>
        )}

        {selectedMovie && stats && (
          <div className="stats-display-area animate-fade-in">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Νέα Αναζήτηση
            </button>
            
            <div className="movie-header">
                <img 
                  src={getPosterUrl(selectedMovie.poster_path || selectedMovie.poster)} 
                  alt="poster" 
                  className="main-poster"
                />
                <div>
                    <h2>{selectedMovie.title || selectedMovie.name}</h2>
                    <p className="movie-desc">{selectedMovie.overview ? selectedMovie.overview.substring(0, 150) + "..." : "No description available."}</p>
                </div>
            </div>

            <MovieStats 
              boxOffice={Math.floor(stats.box)}
              awardPotential={Math.floor(stats.award)}
              starPower={Math.floor(stats.star)}
            />
          </div>
        )}
      </div>
    </>
  );
}