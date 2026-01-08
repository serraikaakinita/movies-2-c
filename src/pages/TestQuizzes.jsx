import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../ui/components/Navbar/Navbar";

function TestQuizzes() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Κατηγορίες
        const categoriesRes = await fetch('http://localhost:8080/api/quizzes/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        
        // Test 2: Όλα τα quizzes
        const quizzesRes = await fetch('http://localhost:8080/api/quizzes');
        if (!quizzesRes.ok) throw new Error('Failed to fetch quizzes');
        const quizzesData = await quizzesRes.json();
        setQuizzes(quizzesData);
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Connection test failed:', err);
      } finally {
        setLoading(false);
      }
    }
    
    testConnection();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>Testing backend connection...</h2>
          <p>Connecting to http://localhost:8080</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <button 
          onClick={() => navigate('/quizzes')}
          style={{
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '40px',
            fontSize: '16px'
          }}
        >
          ← Back to Main Quizzes Page
        </button>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          🎬 Backend Connection Test
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          Testing connectivity with Spring Boot backend at localhost:8080
        </p>
        
        {error ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '40px'
          }}>
            <h2 style={{ color: '#ef4444' }}>❌ Connection Error</h2>
            <p style={{ color: '#fca5a5' }}>{error}</p>
            <p style={{ color: '#94a3b8', marginTop: '20px' }}>
              Make sure your backend is running at http://localhost:8080
            </p>
          </div>
        ) : (
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px'
          }}>
            <h2 style={{ color: '#10b981', marginBottom: '30px' }}>✅ Connection Successful!</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#f8fafc', marginBottom: '20px' }}>📋 Categories ({categories.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categories.map((cat, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '15px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #8b5cf6'
                    }}>
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#f8fafc', marginBottom: '20px' }}>🎯 Quizzes ({quizzes.length})</h3>
                <div style={{ color: '#94a3b8', marginBottom: '20px' }}>
                  Total Questions: {quizzes.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {quizzes.map((quiz, index) => (
                    <div key={quiz.id || index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{ color: '#f8fafc', marginBottom: '8px' }}>{quiz.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px' }}>
                        {quiz.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#8b5cf6' }}>{quiz.category}</span>
                        <span style={{ color: '#10b981' }}>{quiz.questions?.length || 0} questions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94a3b8' }}>
                Backend URL: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  http://localhost:8080
                </code>
              </p>
              <button 
                onClick={() => navigate('/quizzes')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🚀 Go to Main Quizzes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestQuizzes;