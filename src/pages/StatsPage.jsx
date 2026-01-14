import { useState, useEffect } from "react";
import Navbar from "../ui/components/Navbar/Navbar";
import MovieStats from "../ui/components/MovieStats/MovieStats";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import "./StatsPage.css";


const TMDB_API_KEY = "b2cb3d2184382ec8c38fcbd9c2834e82"; 

export default function StatsPage({ user, onLogout }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  
  const [searchType, setSearchType] = useState("movie");

  const getPosterUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200x300?text=No+Image";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        let url = "";

        if (searchType === "movie") {
           
            url = `https://movies2cbackend-production.up.railway.app/api/search/movie?name=${query}`;
        } else {
          
            url = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`;
        }
        
        const res = await fetch(url, { signal: controller.signal });
        
        if (!res.ok) throw new Error("Network error");
        
        const data = await res.json();
        
      
        if (!data.results || data.results.length === 0) {
            setResults([]);
        } else {
         
            const filtered = searchType === "person" 
                ? data.results.filter(p => p.known_for_department === "Acting" && p.profile_path) 
                : data.results;
            setResults(filtered);
        }

      } catch (err) {
        if (err.name !== "AbortError") {
            console.error("Search error:", err);
            setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }

  
    const timeoutId = setTimeout(() => {
        if (query.length >= 3) fetchData();
    }, 500);

    return () => {
        clearTimeout(timeoutId);
        controller.abort();
    };
  }, [query, searchType]);

 
  const getStats = (item) => {
    if (item.kpi_box_office) {
      return { box: item.kpi_box_office, award: item.kpi_award_potential, star: item.kpi_star_power };
    }
    
    const seedString = item._id || item.id || item.title || item.name || "default";
    let seed = 0;
    const str = seedString.toString();
    for (let i = 0; i < str.length; i++) {
        seed += str.charCodeAt(i);
    }
    return {
      box: (seed * 37) % 80 + 20, 
      award: (seed * 19) % 90 + 10,
      star: (seed * 53) % 70 + 30
    };
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuery("");
    setResults([]);
  };

  const handleBack = () => {
    setSelectedItem(null);
    setQuery("");
    setResults([]);
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setQuery("");
    setResults([]);
    setSelectedItem(null);
  };

  const stats = selectedItem ? getStats(selectedItem) : null;

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="stats-page-container">
        {!selectedItem && (
          <div className="search-section">
            <h1 className="stats-title">Analytics & Projections</h1>
            
           
            <div className="type-toggle-container">
                <button 
                    className={`toggle-btn ${searchType === "movie" ? "active" : ""}`}
                    onClick={() => handleTypeChange("movie")}
                >
                    Movies
                </button>
                <button 
                    className={`toggle-btn ${searchType === "person" ? "active" : ""}`}
                    onClick={() => handleTypeChange("person")}
                >
                    Actors
                </button>
            </div>

            <p className="stats-subtitle">
                {searchType === "movie" 
                    ? "Movie Search" 
                    : "Actor Search"}
            </p>

            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                className="stats-search-input"
                placeholder={searchType === "movie" ? "π.χ. Avatar..." : "π.χ. Margot Robbie..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {loading && <p className="loading-text">Αναζήτηση...</p>}

            <div className="results-grid">
              {results.map((item) => (
                <div key={item.id} className="movie-result-card" onClick={() => handleSelectItem(item)}>
                  <img 
                    src={getPosterUrl(item.poster_path || item.poster || item.profile_path)} 
                    alt={item.title || item.name} 
                    className="result-poster"
                  />
                  <div className="result-info">
                    <h3>{item.title || item.name}</h3>
                    <span>
                        {searchType === "movie" 
                            ? (item.release_date || "").substring(0, 4)
                            : "Actor"
                        }
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {!loading && results.length === 0 && query.length > 2 && (
                <p className="no-results">Δεν βρέθηκαν αποτελέσματα.</p>
            )}
          </div>
        )}

        {selectedItem && stats && (
          <div className="stats-display-area animate-fade-in">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Νέα Αναζήτηση
            </button>
            
            <div className="movie-header">
                <img 
                  src={getPosterUrl(selectedItem.poster_path || selectedItem.poster || selectedItem.profile_path)} 
                  alt="poster" 
                  className="main-poster"
                />
                <div>
                    <h2>{selectedItem.title || selectedItem.name}</h2>
                    <p className="movie-desc">
                        {searchType === "movie" 
                            ? (selectedItem.overview ? selectedItem.overview.substring(0, 150) + "..." : "No description.")
                            : `Popularity Score: ${Math.round(selectedItem.popularity || 0)} • Department: ${selectedItem.known_for_department || "Acting"}`
                        }
                    </p>
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