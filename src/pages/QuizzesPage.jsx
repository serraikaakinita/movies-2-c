import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../ui/components/Navbar/Navbar";
import SearchBar from "../ui/components/SearchBar/SearchBar";
import "./QuizzesPage.css";

function QuizzesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:8080/api/quizzes/categories');
        const data = await res.json();
        
        const categoryIcons = {
          "Hollywood Classics": "🎬",
          "Oscar Winners": "🏆",
          "Science Fiction": "🚀",
          "Comedy": "😂",
          "Drama & Romance": "❤️",
          "Action & Adventure": "💥"
        };
        
        const categoryColors = {
          "Hollywood Classics": "#ef4444",
          "Oscar Winners": "#f59e0b",
          "Science Fiction": "#06b6d4",
          "Comedy": "#f97316",
          "Drama & Romance": "#a855f7",
          "Action & Adventure": "#10b981"
        };
        
        const formattedCategories = data.map((category, index) => ({
          id: index + 1,
          title: category,
          icon: categoryIcons[category] || "🎬",
          color: categoryColors[category] || "#ef4444"
        }));
        
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([
          { id: 1, title: "Hollywood Classics", icon: "🎬", color: "#ef4444" },
          { id: 2, title: "Oscar Winners", icon: "🏆", color: "#f59e0b" },
          { id: 3, title: "Science Fiction", icon: "🚀", color: "#06b6d4" },
          { id: 4, title: "Comedy", icon: "😂", color: "#f97316" },
          { id: 5, title: "Drama & Romance", icon: "❤️", color: "#a855f7" },
          { id: 6, title: "Action & Adventure", icon: "💥", color: "#10b981" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuizzes() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/quizzes?title=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        setQuizzes(data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
        }
      }
    }

    if (query.length < 3) {
      setQuizzes([]);
      return;
    }

    fetchQuizzes();

    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/quiz/${encodeURIComponent(category.title)}`);
  };

  const handleQuizClick = (quiz) => {
    navigate(`/quiz/${encodeURIComponent(quiz.category)}`, { 
      state: { quizId: quiz.id } 
    });
  };

  const parallaxX = mousePosition.x * 20 - 10;
  const parallaxY = mousePosition.y * 20 - 10;

  if (loading) {
    return (
      <div className="quizzes-page">
        <div className="content" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <div className="title">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quizzes-page">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              background: `radial-gradient(circle, ${
                ["#ef4444", "#f59e0b", "#06b6d4", "#a855f7"][i % 4]
              }20, transparent)`,
            }}
          />
        ))}
      </div>

      <div
        className="mouse-light"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        }}
      />

      <div className="content">
        <div className="header">
          <div className="search-bar-container">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          {query.length > 0 ? (
            <div className="search-results">
              <h3 className="results-title">
                {quizzes.length > 0
                  ? `✨ Found ${quizzes.length} quizzes`
                  : "🎭 No results found"}
              </h3>
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="quiz-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleQuizClick(quiz)}
                >
                  <div className="quiz-icon">🎬</div>
                  <div>
                    <h4 className="quiz-title">{quiz.title}</h4>
                    <p className="quiz-desc">
                      {quiz.description || `${quiz.category} movie quiz`}
                    </p>
                  </div>
                  <div className="quiz-arrow">→</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="main-content">
              <div className="title-container">
                <h1 className="title">
                  <span className="title-text">
                    Cinema
                    <span className="title-highlight">Quizzes</span>
                  </span>
                </h1>
                <div className="title-underline" />
              </div>

              <p className="subtitle">
                Choose a category to start your cinematic journey
                <span className="subtitle-icon"> 🍿</span>
              </p>

              <div className="grid">
                {categories.map((cat) => {
                  const isHovered = hoveredId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="category-card"
                      style={{
                        borderColor: isHovered ? cat.color : "transparent",
                        boxShadow: isHovered
                          ? `0 20px 40px ${cat.color}20, 0 0 0 1px ${cat.color}20`
                          : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        transform: isHovered
                          ? "translateY(-8px) scale(1.02)"
                          : "translateY(0) scale(1)",
                      }}
                      onMouseEnter={() => setHoveredId(cat.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <div
                        className="icon-glow"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          background: `radial-gradient(circle, ${cat.color}30, transparent 70%)`,
                        }}
                      />

                      <div
                        className="icon-wrapper"
                        style={{
                          background: isHovered
                            ? `linear-gradient(135deg, ${cat.color}30, ${cat.color}10)`
                            : "rgba(255, 255, 255, 0.05)",
                          borderColor: isHovered
                            ? cat.color
                            : "rgba(255, 255, 255, 0.1)",
                          transform: isHovered
                            ? "scale(1.1) rotate(5deg)"
                            : "scale(1) rotate(0deg)",
                        }}
                      >
                        <span
                          className="icon"
                          style={{
                            transform: isHovered ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          {cat.icon}
                        </span>
                      </div>

                      <h3 className="category-title">{cat.title}</h3>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: isHovered ? "100%" : "60%",
                            background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
                          }}
                        />
                      </div>

                      <div
                        className="arrow"
                        style={{
                          color: isHovered ? cat.color : "#64748b",
                          transform: isHovered
                            ? "translateX(8px)"
                            : "translateX(0)",
                        }}
                      >
                        →
                      </div>

                      {isHovered && (
                        <div
                          className="shine-effect"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${cat.color}20, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="footer">
                <div className="footer-content">
                  <span className="footer-icon">🎞️</span>
                  <span className="footer-text">
                    Each quiz is a unique cinematic experience
                  </span>
                  <span className="footer-icon">✨</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="vignette"></div>
    </div>
  );
}

export default QuizzesPage;
