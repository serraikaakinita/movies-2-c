import { useEffect, useState } from "react";
import Row from "../ui/Row";

function QuizzesPage() {
  const [query, setQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQuizzes() {
      try {
        setError("");

        const res = await fetch(
          `https://movies2cbackend-production.up.railway.app/api/search/quizzes?name=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Quiz not found");

        setQuizzes(data.results || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
    }

    if (query.length < 3) {
      setQuizzes([]);
      setError("");
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

  const categories = [
    { id: 1, title: "Χόλιγουντ Κλασικά", icon: "🎬", color: "#ef4444" },
    { id: 2, title: "Νικητές Όσκαρ", icon: "🏆", color: "#f59e0b" },
    { id: 3, title: "Επιστημονική Φαντασία", icon: "🚀", color: "#06b6d4" },
    { id: 4, title: "Κωμωδίες", icon: "😂", color: "#f97316" },
    { id: 5, title: "Δράμα & Ρομάντζο", icon: "❤️", color: "#a855f7" },
    { id: 6, title: "Δράση & Περιπέτεια", icon: "💥", color: "#10b981" },
  ];

  const parallaxX = mousePosition.x * 20 - 10;
  const parallaxY = mousePosition.y * 20 - 10;

  return (
    <div style={styles.container}>
      <div style={styles.particles}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
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
        style={{
          ...styles.mouseLight,
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        }}
      />


      <div style={styles.content}>
        <div style={styles.header}>
          {query.length > 0 ? (
            <div style={styles.searchResults}>
              <h3 style={styles.resultsTitle}>
                {quizzes.length > 0
                  ? `✨ Βρέθηκαν ${quizzes.length} quizzes`
                  : "🎭 Δεν βρέθηκαν αποτελέσματα"}
              </h3>
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  style={{
                    ...styles.quizCard,
                    animationDelay: `${index * 0.1}s`,
                  }}
                  className="fade-in"
                >
                  <div style={styles.quizIcon}>🎬</div>
                  <div>
                    <h4 style={styles.quizTitle}>{quiz.title}</h4>
                    <p style={styles.quizDesc}>
                      {quiz.description || "Κινηματογραφικό quiz"}
                    </p>
                  </div>
                  <div style={styles.quizArrow}>→</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={styles.titleContainer}>
                <h1 style={styles.title}>
                  <span style={styles.titleText}>
                    Cinema
                    <span style={styles.titleHighlight}>Quizzes</span>
                  </span>
                </h1>
                <div style={styles.titleUnderline} />
              </div>

              <p style={styles.subtitle}>
                Επιλέξτε μια κατηγορία για να ξεκινήσετε την κινηματογραφική σας
                διαδρομή
                <span style={styles.subtitleIcon}> 🍿</span>
              </p>

              <div style={styles.grid}>
                {categories.map((cat) => {
                  const isHovered = hoveredId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      style={{
                        ...styles.categoryCard,
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
                    >
                      <div
                        style={{
                          ...styles.iconGlow,
                          opacity: isHovered ? 1 : 0,
                          background: `radial-gradient(circle, ${cat.color}30, transparent 70%)`,
                        }}
                      />

                      <div
                        style={{
                          ...styles.iconWrapper,
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
                          style={{
                            ...styles.icon,
                            transform: isHovered ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          {cat.icon}
                        </span>
                      </div>

                      <h3 style={styles.categoryTitle}>{cat.title}</h3>

                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: isHovered ? "100%" : "60%",
                            background: `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          ...styles.arrow,
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
                          style={{
                            ...styles.shineEffect,
                            background: `linear-gradient(90deg, transparent, ${cat.color}20, transparent)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={styles.footer}>
                <div style={styles.footerContent}>
                  <span style={styles.footerIcon}>🎞️</span>
                  <span style={styles.footerText}>
                    Κάθε quiz είναι μια μοναδική κινηματογραφική εμπειρία
                  </span>
                  <span style={styles.footerIcon}>✨</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.vignette}></div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    position: "relative",
    overflow: "hidden",
    marginTop: "-100px",
    paddingTop: "100px",
    zIndex:0,
  },

  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 1,
  },
  particle: {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    animation: "particleFloat 15s linear infinite",
    filter: "blur(40px)",
  },
  mouseLight: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
    transition: "transform 0.1s ease-out",
    filter: "blur(40px)",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    position: "relative",
    zIndex: 2,
  },
  header: {
    textAlign: "center",
    marginTop: "60px",
  },
  titleContainer: {
    marginBottom: "30px",
    position: "relative",
  },
  title: {
    fontSize: "4rem",
    fontWeight: "300",
    letterSpacing: "1px",
    marginBottom: "16px",
    animation: "float 6s ease-in-out infinite",
  },
  titleText: {
    background: "linear-gradient(45deg, #f8fafc, #cbd5e1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "block",
  },
  titleHighlight: {
    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  titleUnderline: {
    width: "120px",
    height: "3px",
    background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)",
    margin: "0 auto",
    borderRadius: "2px",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#94a3b8",
    marginBottom: "80px",
    fontWeight: "300",
    letterSpacing: "0.5px",
  },
  subtitleIcon: {
    animation: "float 3s ease-in-out infinite",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  categoryCard: {
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid",
    borderRadius: "20px",
    padding: "40px 30px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  iconGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    transition: "opacity 0.4s ease",
    filter: "blur(20px)",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 25px",
    border: "2px solid",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  icon: {
    fontSize: "36px",
    transition: "transform 0.3s ease",
    display: "block",
  },
  categoryTitle: {
    color: "#f8fafc",
    fontSize: "1.3rem",
    fontWeight: "500",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  progressBar: {
    width: "100%",
    height: "4px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    margin: "25px auto",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.6s ease",
  },
  arrow: {
    color: "#64748b",
    fontSize: "1.8rem",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  shineEffect: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    transition: "left 0.6s ease",
  },
  searchResults: {
    marginTop: "60px",
  },
  resultsTitle: {
    color: "#e2e8f0",
    fontSize: "2rem",
    fontWeight: "400",
    marginBottom: "40px",
    letterSpacing: "0.5px",
  },
  quizCard: {
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    color: "#e2e8f0",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    opacity: 0,
  },
  quizIcon: {
    fontSize: "28px",
    opacity: 0.8,
  },
  quizTitle: {
    fontSize: "1.1rem",
    fontWeight: "500",
    margin: 0,
  },
  quizDesc: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    margin: "4px 0 0",
  },
  quizArrow: {
    marginLeft: "auto",
    fontSize: "1.5rem",
    opacity: 0.5,
    transition: "all 0.3s ease",
  },
  footer: {
    marginTop: "100px",
    paddingTop: "40px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  footerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    color: "#64748b",
    fontSize: "1rem",
    letterSpacing: "0.5px",
  },
  footerIcon: {
    fontSize: "1.2rem",
    animation: "float 3s ease-in-out infinite",
    animationDelay: "var(--delay, 0s)",
  },
  footerText: {
    fontStyle: "italic",
  },
  vignette: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.3) 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
};

export default QuizzesPage;
