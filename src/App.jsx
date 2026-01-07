import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import Homepage from "./pages/Homepage";
import MoviePage from "./pages/MoviePage";
import Profile from "./pages/Profile";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TestQuizzes from "./pages/TestQuizzes";
import QuizGame from "./pages/QuizGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="home" />}></Route>
        <Route path="home" element={<Homepage></Homepage>}></Route>
        <Route path="movie/:id" element={<MoviePage></MoviePage>}></Route>
        <Route path="profile" element={<Profile></Profile>}></Route>
        <Route path="quizzes" element={<QuizzesPage></QuizzesPage>}></Route>
        <Route path="quiz" element={<QuizPage></QuizPage>}></Route>
        <Route path="quiz/:category" element={<QuizGame></QuizGame>}></Route>
        <Route path="login" element={<LoginPage></LoginPage>}></Route>
        <Route path="signup" element={<SignupPage></SignupPage>}></Route>
        <Route path="test-quizzes" element={<TestQuizzes></TestQuizzes>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;