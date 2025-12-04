import React, { useState } from "react";
import "./App.css";
import Navbar from "./ui/components/Navbar/Navbar";
import MovieList from "./ui/components/MovieList/MovieList";
import SearchBar from "./ui/components/SearchBar/SearchBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [movies, setMovies] = useState([]);
  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://movies2cbackend-production.up.railway.app/api/search/movie?title=${query}`
      );

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <Navbar />
              <SearchBar onSearch={handleSearch} />
              <MovieList movies={movies} />
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import { BrowserRouter, Navigate, Route, Routes } from "react-router";
// import "./App.css";
// import Homepage from "./pages/Homepage";
// import MoviePage from "./pages/MoviePage";
// import Profile from "./pages/Profile";
// import QuizzesPage from "./pages/QuizzesPage";
// import QuizPage from "./pages/QuizPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route index element={<Navigate replace to="home" />}></Route>
//         <Route path="home" element={<Homepage></Homepage>}></Route>
//         <Route path="movie/:id" element={<MoviePage></MoviePage>}></Route>
//         <Route path="profile" element={<Profile></Profile>}></Route>
//         <Route path="quizzes" element={<QuizzesPage></QuizzesPage>}></Route>
//         <Route path="quiz" element={<QuizPage></QuizPage>}></Route>
//         <Route path="login" element={<LoginPage></LoginPage>}></Route>
//         <Route path="signup" element={<SignupPage></SignupPage>}></Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
