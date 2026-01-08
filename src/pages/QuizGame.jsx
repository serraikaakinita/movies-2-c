import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../ui/components/Navbar/Navbar";
import "./QuizGame.css";

function QuizGame() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(
          `http://localhost:8080/api/quizzes/category/${encodeURIComponent(category)}`
        );
        const quizzes = await res.json();
        
        if (quizzes.length > 0) {
          setQuiz(quizzes[0]);
        } else {
          console.error('No quiz found for category:', category);
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadQuiz();
  }, [category]);

  useEffect(() => {
    if (!quiz || showResults) return;
    
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, [quiz, showResults]);

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimer(30);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(optionIndex);
    
    const isCorrect = optionIndex === quiz.questions[currentQuestion].correctOptionIndex;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimer(30);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const getOptionClass = (index) => {
    if (selectedAnswer === null) return "";
    if (index === quiz.questions[currentQuestion].correctOptionIndex) return "correct";
    if (index === selectedAnswer) return "wrong";
    return "";
  };

  const calculateScorePercentage = () => {
    if (!quiz || quiz.questions.length === 0) return 0;
    return Math.round((score / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="quiz-game">
        <Navbar />
        <div className="quiz-loading">
          <div className="loading-spinner"></div>
          <p>Loading {category} quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-game">
        <Navbar />
        <div className="quiz-error">
          <h2>Quiz not found</h2>
          <p>Could not load quiz for category: {category}</p>
          <button onClick={() => navigate('/quizzes')}>Back to Categories</button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = calculateScorePercentage();
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    return (
      <div className="quiz-game">
        <Navbar />
        <div className="quiz-results">
          <div className="results-container">
            <h1>🎬 Quiz Completed!</h1>
            <div className="results-card">
              <h2>{quiz.title}</h2>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{score}/{quiz.questions.length}</span>
                  <span className="score-percentage">{percentage}%</span>
                </div>
                <div className="score-message">
                  {isExcellent && "🏆 Excellent! You're a movie master!"}
                  {isGood && !isExcellent && "👍 Good job! You know your movies!"}
                  {!isGood && "📚 Keep watching movies and try again!"}
                </div>
              </div>
              
              <div className="results-breakdown">
                <h3>Quiz Details:</h3>
                <p><strong>Category:</strong> {quiz.category}</p>
                <p><strong>Difficulty:</strong> Mixed</p>
                <p><strong>Questions:</strong> {quiz.questions.length}</p>
              </div>
              
              <div className="results-actions">
                <button 
                  className="play-again-btn"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setSelectedAnswer(null);
                    setShowResults(false);
                    setTimer(30);
                  }}
                >
                  ↻ Play Again
                </button>
                <button 
                  className="back-btn"
                  onClick={() => navigate('/quizzes')}
                >
                  ← Back to Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-game">
      <Navbar />
      
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-info">
            <h1>{quiz.title}</h1>
            <p className="quiz-description">{quiz.description}</p>
          </div>
          
          <div className="quiz-stats">
            <div className="stat-box">
              <span className="stat-label">Question</span>
              <span className="stat-value">{currentQuestion + 1}/{quiz.questions.length}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-box timer-box">
              <span className="stat-label">Time</span>
              <span className={`stat-value ${timer <= 10 ? 'timer-warning' : ''}`}>
                {timer}s
              </span>
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion + 1}</span>
            <span className="question-difficulty">{question.difficulty}</span>
          </div>
          
          <h2 className="question-text">{question.questionText}</h2>
          
          <div className="options-grid">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${getOptionClass(index)}`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {selectedAnswer !== null && index === question.correctOptionIndex && (
                  <span className="correct-indicator">✓</span>
                )}
              </button>
            ))}
          </div>
          
          {selectedAnswer !== null && (
            <div className="explanation">
              {selectedAnswer === question.correctOptionIndex ? (
                <div className="correct-explanation">
                  ✅ Correct! Well done.
                </div>
              ) : (
                <div className="wrong-explanation">
                  ❌ The correct answer is: {question.options[question.correctOptionIndex]}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="quiz-navigation">
          <button 
            className="nav-btn"
            onClick={() => navigate('/quizzes')}
          >
            ← Exit Quiz
          </button>
          <div className="question-indicator">
            {quiz.questions.map((_, idx) => (
              <div 
                key={idx}
                className={`indicator-dot ${
                  idx === currentQuestion ? 'active' : 
                  idx < currentQuestion ? 'answered' : ''
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizGame;