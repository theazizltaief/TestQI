'use client';

import { useEffect, useState } from 'react';
import { testsAPI } from '../../lib/api';
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

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTests();
  }, [filter]);

  const loadTests = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'all') {
        response = await testsAPI.getAll();
      } else if (filter === 'actifs') {
        response = await testsAPI.getActifs();
      } else {
        response = await testsAPI.searchByNiveau(filter);
      }
      setTests(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await testsAPI.toggle(id);
      loadTests();
    } catch (error) {
      console.error('Erreur lors de la modification du test:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
      try {
        await testsAPI.delete(id);
        loadTests();
      } catch (error) {
        console.error('Erreur lors de la suppression du test:', error);
      }
    }
  };

  const getBadgeClass = (niveau: string) => {
    if (niveau === 'Facile') return 'badge-easy';
    if (niveau === 'Moyen') return 'badge-medium';
    return 'badge-hard';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              Tests de QI
            </h1>
            <p style={{ color: '#6b7280' }}>
              Gérez tous vos tests de QI
            </p>
          </div>
          <Link href="/tests/create" className="btn-primary">
            ➕ Nouveau Test
          </Link>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: filter === 'all' ? '#0284c7' : '#e5e7eb',
              background: filter === 'all' ? '#e0f2fe' : 'white',
              color: filter === 'all' ? '#0369a1' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('actifs')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: filter === 'actifs' ? '#0284c7' : '#e5e7eb',
              background: filter === 'actifs' ? '#e0f2fe' : 'white',
              color: filter === 'actifs' ? '#0369a1' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Actifs
          </button>
          <button
            onClick={() => setFilter('Facile')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: filter === 'Facile' ? '#0284c7' : '#e5e7eb',
              background: filter === 'Facile' ? '#e0f2fe' : 'white',
              color: filter === 'Facile' ? '#0369a1' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Facile
          </button>
          <button
            onClick={() => setFilter('Moyen')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: filter === 'Moyen' ? '#0284c7' : '#e5e7eb',
              background: filter === 'Moyen' ? '#e0f2fe' : 'white',
              color: filter === 'Moyen' ? '#0369a1' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Moyen
          </button>
          <button
            onClick={() => setFilter('Difficile')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: filter === 'Difficile' ? '#0284c7' : '#e5e7eb',
              background: filter === 'Difficile' ? '#e0f2fe' : 'white',
              color: filter === 'Difficile' ? '#0369a1' : '#6b7280',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Difficile
          </button>
        </div>
      </div>

      {/* Liste des tests */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Chargement des tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Aucun test trouvé
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Créez votre premier test pour commencer
          </p>
          <Link href="/tests/create" className="btn-primary">
            Créer un Test
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {tests.map((test) => (
            <div key={test.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                      {test.titre}
                    </h3>
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
                  <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>
                    {test.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>⏱️ {test.dureeMinutes} minutes</span>
                    <span>📅 {new Date(test.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <Link
                  href={`/tests/${test.id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  👁️ Voir
                </Link>
                <Link
                  href={`/tests/${test.id}/questions`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#f3e8ff',
                    color: '#7e22ce',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  ❓ Questions
                </Link>
                <button
                  onClick={() => handleToggle(test.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: test.actif ? '#fee2e2' : '#dcfce7',
                    color: test.actif ? '#991b1b' : '#166534',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {test.actif ? '🔴 Désactiver' : '🟢 Activer'}
                </button>
                <button
                  onClick={() => handleDelete(test.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    marginLeft: 'auto'
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}