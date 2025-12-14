'use client';

import { useEffect, useState } from 'react';
import { testsAPI, questionsAPI } from '../../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: number;
  enonce: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  bonneReponse: string;
  points: number;
}

interface Test {
  id: number;
  titre: string;
  description: string;
  dureeMinutes: number;
  niveau: string;
}

export default function PasserTestPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0, points: 0, maxPoints: 0 });

  useEffect(() => {
    loadData();
  }, [params.id]);

  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, finished, timeLeft]);

  const loadData = async () => {
    try {
      const [testResponse, questionsResponse] = await Promise.all([
        testsAPI.getById(Number(params.id)),
        questionsAPI.getByTestId(Number(params.id))
      ]);
      setTest(testResponse.data);
      
      try {
        setQuestions(questionsResponse.data || []);
      } catch {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (test) {
      setStarted(true);
      setTimeLeft(test.dureeMinutes * 60);
    }
  };

  const handleResponse = (questionId: number, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    let correct = 0;
    let points = 0;
    let maxPoints = 0;

    questions.forEach(question => {
      maxPoints += question.points;
      if (responses[question.id] === question.bonneReponse) {
        correct++;
        points += question.points;
      }
    });

    setScore({
      correct,
      total: questions.length,
      points,
      maxPoints
    });
    setFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBadgeClass = (niveau: string) => {
    if (niveau === 'Facile') return 'badge-easy';
    if (niveau === 'Moyen') return 'badge-medium';
    return 'badge-hard';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Chargement du test...</p>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {!test ? 'Test introuvable' : 'Ce test ne contient aucune question'}
        </h3>
        <Link href="/tests" className="btn-primary">
          Retour aux tests
        </Link>
      </div>
    );
  }

  // Écran d'accueil
  if (!started) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧠</div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            {test.titre}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span className={`badge ${getBadgeClass(test.niveau)}`}>
              {test.niveau}
            </span>
          </div>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.125rem' }}>
            {test.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #e0f2fe, #bae6fd)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Questions</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>{questions.length}</p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Durée</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c2410c' }}>{test.dureeMinutes} min</p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #fef9c3, #fde68a)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Points Max</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#854d0e' }}>
                {questions.reduce((sum, q) => sum + q.points, 0)}
              </p>
            </div>
          </div>

          <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '2px solid #fcd34d' }}>
            <p style={{ color: '#92400e', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Instructions importantes :</p>
            <ul style={{ color: '#78350f', textAlign: 'left', paddingLeft: '1.5rem', margin: 0 }}>
              <li>Le chronomètre démarre dès que vous cliquez sur "Commencer"</li>
              <li>Vous pouvez naviguer entre les questions</li>
              <li>Le test se termine automatiquement à la fin du temps imparti</li>
              <li>Assurez-vous d'avoir répondu à toutes les questions avant de terminer</li>
            </ul>
          </div>

          <button onClick={handleStart} className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            🚀 Commencer le Test
          </button>
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (finished) {
    const percentage = (score.points / score.maxPoints) * 100;
    const qi = Math.round(85 + (percentage / 100) * 30); // Simulation QI entre 85 et 115

    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : percentage >= 40 ? '👍' : '📚'}
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Test Terminé !
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>
                {score.correct}/{score.total}
              </p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #e0f2fe, #bae6fd)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Points</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
                {score.points}/{score.maxPoints}
              </p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #fef9c3, #fde68a)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>Pourcentage</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#854d0e' }}>
                {percentage.toFixed(1)}%
              </p>
            </div>
            <div className="card" style={{ background: 'linear-gradient(to bottom right, #f3e8ff, #e9d5ff)' }}>
              <p style={{ color: '#4b5563', fontWeight: 600, fontSize: '0.875rem' }}>QI Estimé</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7e22ce' }}>
                {qi}
              </p>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            background: percentage >= 60 ? '#dcfce7' : '#fee2e2',
            marginBottom: '2rem'
          }}>
            <p style={{ fontWeight: 600, color: percentage >= 60 ? '#166534' : '#991b1b' }}>
              {percentage >= 80 && '🌟 Excellent travail ! Vous maîtrisez parfaitement ce niveau.'}
              {percentage >= 60 && percentage < 80 && '✅ Très bien ! Vous avez de bonnes capacités de raisonnement.'}
              {percentage >= 40 && percentage < 60 && '👍 Bon effort ! Continuez à pratiquer pour améliorer votre score.'}
              {percentage < 40 && '📚 Continuez à vous entraîner. La pratique améliore les performances.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push(`/tests/${params.id}/passer`)} className="btn-primary">
              🔄 Recommencer
            </button>
            <Link href="/tests" className="btn-secondary">
              📋 Retour aux tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Écran du test en cours
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      {/* Barre de progression et timer */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Question {currentQuestionIndex + 1} sur {questions.length}
            </p>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            background: timeLeft < 60 ? '#fee2e2' : '#dcfce7',
            color: timeLeft < 60 ? '#991b1b' : '#166534',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
        <div style={{ width: '100%', height: '0.5rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(to right, #0284c7, #9333ea)',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{
            background: 'linear-gradient(to right, #0284c7, #9333ea)',
            color: 'white',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            {currentQuestionIndex + 1}
          </span>
          <span className="badge" style={{ background: '#fef9c3', color: '#854d0e' }}>
            {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
          </span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', marginBottom: '2rem', lineHeight: 1.5 }}>
          {currentQuestion.enonce}
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {['A', 'B', 'C', 'D'].map((option) => {
            const isSelected = responses[currentQuestion.id] === option;
            return (
              <button
                key={option}
                onClick={() => handleResponse(currentQuestion.id, option)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '2px solid',
                  borderColor: isSelected ? '#0284c7' : '#e5e7eb',
                  background: isSelected ? '#e0f2fe' : 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{
                  fontWeight: 'bold',
                  marginRight: '0.75rem',
                  color: isSelected ? '#0369a1' : '#6b7280'
                }}>
                  {option}.
                </span>
                <span style={{ color: '#1f2937' }}>
                  {currentQuestion[`option${option}` as keyof Question]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: currentQuestionIndex === 0 ? '#f3f4f6' : 'white',
            color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151',
            fontWeight: 600,
            border: '2px solid #e5e7eb',
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ⬅️ Précédent
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleFinish} className="btn-primary">
              ✅ Terminer le Test
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary">
              Suivant ➡️
            </button>
          )}
        </div>
      </div>

      {/* Indicateur de progression des réponses */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
          Réponses : {Object.keys(responses).length}/{questions.length}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: responses[q.id] ? '#10b981' : idx === currentQuestionIndex ? '#0284c7' : '#e5e7eb',
                color: responses[q.id] || idx === currentQuestionIndex ? 'white' : '#6b7280',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}