// TestQuizzes.jsx
import { useState, useEffect } from "react";

function TestQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testBackend() {
      try {
        // Test 1: Κατηγορίες
        const categoriesRes = await fetch('http://localhost:8080/api/quizzes/categories');
        const categories = await categoriesRes.json();
        console.log('Categories:', categories);
        
        // Test 2: Όλα τα quizzes
        const quizzesRes = await fetch('http://localhost:8080/api/quizzes');
        const allQuizzes = await quizzesRes.json();
        console.log('All quizzes:', allQuizzes);
        
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Backend error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    testBackend();
  }, []);

  if (loading) return <div>Testing backend connection...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎬 Backend Connection Test</h1>
      <p>Total Quizzes: {quizzes.length}</p>
      
      {quizzes.map(quiz => (
        <div key={quiz.id} style={{
          border: '1px solid #ccc',
          padding: '15px',
          margin: '10px',
          borderRadius: '8px'
        }}>
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <p><strong>Category:</strong> {quiz.category}</p>
          <p><strong>Questions:</strong> {quiz.questions?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}

export default TestQuizzes;