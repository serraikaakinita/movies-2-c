import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import MoviePage from "./pages/MoviePage";
import Profile from "./pages/Profile";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import QuizGame from "./pages/QuizGame";
import FeedPage from "./pages/FeedPage";
import TvseriesPage from "./pages/TvseriesPage";
import SeriePage from "./pages/SeriePage";
import ActorMatch from "./pages/ActorMatch";

import { useEffect, useState } from "react";
import {
  getToken,
  isTokenExpired,
  Logout,
  getStoredUser,
} from "./services/authenticationService";
import Navbar from "./ui/components/Navbar/Navbar";
import { FavoritesProvider } from "./context/FavoritesContext";

import StatsPage from "./pages/StatsPage";

function AppContent() {
  const [user, setUser] = useState(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      Logout();
      return null;
    }

    const stored = getStoredUser();
    return stored ?? null;
  });

  const location = useLocation();

  useEffect(() => {
    function syncUser() {
      setUser(getStoredUser());
    }
    window.addEventListener("auth_changed", syncUser);
    return () => window.removeEventListener("auth_changed", syncUser);
  }, []);

  const handleLogout = () => {
    Logout();
    setUser(null);
  };

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* {!hideNavbar && (
        <Navbar
          user={user}
          onLogout={handleLogout}
        />
      )} */}
      <main className="page-wrapper">
        <Routes>
          <Route path="/feed" element={<FeedPage />} />

          <Route
            path="/analytics"
            element={<StatsPage user={user} onLogout={handleLogout} />}
          />

          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route
            path="/home"
            element={<Homepage user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/tv"
            element={<TvseriesPage user={user} onLogout={handleLogout} />}
          />

          <Route
            path="/movie/:id"
            element={<MoviePage user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/tv/:id"
            element={<SeriePage user={user} onLogout={handleLogout} />}
          />

          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route
            path="/profile"
            element={
              user ? <Profile user={user} /> : <Navigate replace to="/login" />
            }
          />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:category" element={<QuizGame />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route
            path="/actor-match"
            element={<ActorMatch user={user} onLogout={handleLogout} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </BrowserRouter>
  );
}
