'use client';

import { useEffect, useState } from 'react';
import { testsAPI, questionsAPI } from '../../../lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Test {
  id: number;
  titre: string;
  description: string;
  dureeMinutes: number;
  niveau: string;
  actif: boolean;
  dateCreation: string;
}

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dureeMinutes: 30,
    niveau: 'Facile',
    actif: true
  });

  useEffect(() => {
    loadTest();
  }, [params.id]);

  const loadTest = async () => {
    try {
      const [testResponse, countResponse] = await Promise.all([
        testsAPI.getById(Number(params.id)),
        questionsAPI.countByTest(Number(params.id))
      ]);
      setTest(testResponse.data);
      setQuestionCount(countResponse.data);
      setFormData({
        titre: testResponse.data.titre,
        description: testResponse.data.description,
        dureeMinutes: testResponse.data.dureeMinutes,
        niveau: testResponse.data.niveau,
        actif: testResponse.data.actif
      });
    } catch (error) {
      console.error('Erreur lors du chargement du test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await testsAPI.update(Number(params.id), formData);
      alert('Test mis à jour avec succès !');
      setEditing(false);
      loadTest();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
      try {
        await testsAPI.delete(Number(params.id));
        alert('Test supprimé avec succès !');
        router.push('/tests');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleToggle = async () => {
    try {
      await testsAPI.toggle(Number(params.id));
      loadTest();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#6b7280' }}>
          <Link href="/tests" style={{ color: '#6b7280', textDecoration: 'none' }}>Tests</Link>
          <span>/</span>
          <span>{test.titre}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                {test.titre}
              </h1>
              <span className={`badge ${getBadgeClass(test.niveau)}`}>
                {test.niveau}
              </span>
              {test.actif ? (
                <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>
                  ✅ Actif
                </span>
              ) : (
                <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                  ❌ Inactif
                </span>
              )}
            </div>
            <p style={{ color: '#6b7280' }}>
              Créé le {new Date(test.dateCreation).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: editing ? '#fee2e2' : '#e0f2fe',
                color: editing ? '#991b1b' : '#0369a1',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {editing ? '❌ Annuler' : '✏️ Modifier'}
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: '#fee2e2',
                color: '#991b1b',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, #e0f2fe, #bae6fd)' }}>
          <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Questions</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>{questionCount}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)' }}>
          <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Durée</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c2410c' }}>{test.dureeMinutes}m</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, #f3e8ff, #e9d5ff)' }}>
          <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Niveau</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7e22ce' }}>{test.niveau}</p>
        </div>
      </div>

      {/* Formulaire de modification */}
      {editing ? (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
            Modifier le Test
          </h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Titre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="input-field"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Durée (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.dureeMinutes}
                  onChange={(e) => setFormData({ ...formData, dureeMinutes: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Niveau *
                </label>
                <select
                  value={formData.niveau}
                  onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              💾 Enregistrer les modifications
            </button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            Description
          </h2>
          <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
            {test.description || 'Aucune description disponible'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
          Actions Rapides
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link
            href={`/tests/${test.id}/passer`}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            🎯 Passer le Test
          </Link>
          <Link
            href={`/tests/${test.id}/questions`}
            className="btn-primary"
          >
            ❓ Gérer les Questions ({questionCount})
          </Link>
          <button
            onClick={handleToggle}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: test.actif ? '#fee2e2' : '#dcfce7',
              color: test.actif ? '#991b1b' : '#166534',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {test.actif ? '🔴 Désactiver le Test' : '🟢 Activer le Test'}
          </button>
          <Link
            href="/tests"
            className="btn-secondary"
          >
            ⬅️ Retour à la liste
          </Link>
        </div>
      </div>
    </div>
  );
}