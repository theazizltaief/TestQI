'use client';

import { useState } from 'react';
import { testsAPI } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function CreateTestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dureeMinutes: 30,
    niveau: 'Facile'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await testsAPI.create(formData);
      alert('Test créé avec succès !');
      router.push(`/tests/${response.data.id}/questions`);
    } catch (err) {
      setError('Erreur lors de la création du test');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dureeMinutes' ? parseInt(value) : value
    }));
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Créer un Nouveau Test
        </h1>
        <p style={{ color: '#6b7280' }}>
          Remplissez les informations ci-dessous pour créer un test de QI
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Titre du Test *
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              placeholder="Ex: Test QI Débutant"
              className="input-field"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez le test..."
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Durée (minutes) *
              </label>
              <input
                type="number"
                name="dureeMinutes"
                value={formData.dureeMinutes}
                onChange={handleChange}
                required
                min="1"
                max="180"
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Niveau *
              </label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? '⏳ Création...' : '✅ Créer le Test'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}