'use client';

import { useEffect, useState } from 'react';
import { testsAPI, questionsAPI } from '../../../../lib/api';
import { useParams } from 'next/navigation';
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
  niveau: string;
}

export default function QuestionsPage() {
  const params = useParams();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    enonce: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    bonneReponse: 'A',
    points: 1
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const testResponse = await testsAPI.getById(Number(params.id));
      setTest(testResponse.data);

      // Gérer le cas où il n'y a pas de questions (204 No Content)
      try {
        const questionsResponse = await questionsAPI.getByTestId(Number(params.id));
        setQuestions(questionsResponse.data || []);
      } catch (error: any) {
        // Si 204 No Content ou erreur, on met un tableau vide
        if (error.response?.status === 204) {
          setQuestions([]);
        } else {
          console.error('Erreur lors du chargement des questions:', error);
          setQuestions([]);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await questionsAPI.update(editingId, formData);
        alert('Question mise à jour avec succès !');
      } else {
        await questionsAPI.create(Number(params.id), formData);
        alert('Question créée avec succès !');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'opération');
    }
  };

  const handleEdit = (question: Question) => {
    setFormData({
      enonce: question.enonce,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      bonneReponse: question.bonneReponse,
      points: question.points
    });
    setEditingId(question.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      try {
        await questionsAPI.delete(id);
        alert('Question supprimée avec succès !');
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      enonce: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      bonneReponse: 'A',
      points: 1
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Chargement...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Test introuvable</h3>
        <Link href="/tests" className="btn-primary">
          Retour aux tests
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          <Link href="/tests" style={{ color: '#6b7280', textDecoration: 'none' }}>Tests</Link>
          <span>/</span>
          <Link href={`/tests/${params.id}`} style={{ color: '#6b7280', textDecoration: 'none' }}>
            {test.titre}
          </Link>
          <span>/</span>
          <span>Questions</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Questions du Test
            </h1>
            <p style={{ color: '#6b7280' }}>
              {questions.length} question{questions.length !== 1 ? 's' : ''} • {test.niveau}
            </p>
          </div>
            <button
                onClick={() => {
                  if (showForm) {
                    resetForm(); // Si on ferme, on reset
                  } else {
                    setShowForm(true); // Si on ouvre, on active le formulaire
                  }
                }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: showForm ? '#fee2e2' : 'linear-gradient(to right, #0284c7, #9333ea)',
              color: showForm ? '#991b1b' : 'white',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            {showForm ? '❌ Annuler' : '➕ Nouvelle Question'}
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(to bottom right, #f0f9ff, #faf5ff)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
            {editingId ? '✏️ Modifier la Question' : '➕ Nouvelle Question'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Énoncé de la Question *
              </label>
              <textarea
                value={formData.enonce}
                onChange={(e) => setFormData({ ...formData, enonce: e.target.value })}
                required
                rows={3}
                placeholder="Ex: Quel est le nombre suivant dans la série : 2, 4, 8, 16, ?"
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Option A *
                </label>
                <input
                  type="text"
                  value={formData.optionA}
                  onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                  required
                  placeholder="Première option"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Option B *
                </label>
                <input
                  type="text"
                  value={formData.optionB}
                  onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                  required
                  placeholder="Deuxième option"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Option C *
                </label>
                <input
                  type="text"
                  value={formData.optionC}
                  onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                  required
                  placeholder="Troisième option"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Option D *
                </label>
                <input
                  type="text"
                  value={formData.optionD}
                  onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                  required
                  placeholder="Quatrième option"
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Bonne Réponse *
                </label>
                <select
                  value={formData.bonneReponse}
                  onChange={(e) => setFormData({ ...formData, bonneReponse: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Points *
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  required
                  min="1"
                  max="10"
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">
                {editingId ? '💾 Mettre à jour' : '✅ Créer la Question'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                ❌ Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des questions */}
      {questions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❓</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Aucune question
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Créez votre première question pour ce test
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            ➕ Créer une Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((question, index) => (
            <div key={question.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      background: 'linear-gradient(to right, #0284c7, #9333ea)',
                      color: 'white',
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                    <span className="badge" style={{ background: '#fef9c3', color: '#854d0e' }}>
                      {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                    {question.enonce}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div
                        key={option}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          background: question.bonneReponse === option ? '#dcfce7' : '#f3f4f6',
                          border: '2px solid',
                          borderColor: question.bonneReponse === option ? '#16a34a' : 'transparent',
                          fontSize: '0.875rem'
                        }}
                      >
                        <span style={{ fontWeight: 'bold', marginRight: '0.5rem', color: '#374151' }}>{option}.</span>
                        <span style={{ color: '#1f2937' }}>{question[`option${option}` as keyof Question]}</span>
                        {question.bonneReponse === option && <span style={{ marginLeft: '0.5rem' }}>✅</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(question)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Retour */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href={`/tests/${params.id}`} className="btn-secondary">
          ⬅️ Retour au test
        </Link>
      </div>
    </div>
  );
}