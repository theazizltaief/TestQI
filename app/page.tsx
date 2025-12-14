'use client';

import { useEffect, useState } from 'react';
import { testsAPI } from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    totalTests: 0,
    activeTests: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [allTests, activeCount] = await Promise.all([
        testsAPI.getAll(),
        testsAPI.countActifs(),
      ]);
      setStats({
        totalTests: allTests.data.length || 0,
        activeTests: activeCount.data || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{
          display: 'inline-block',
          padding: '1rem',
          background: 'linear-gradient(to bottom right, #e0f2fe, #f3e8ff)',
          borderRadius: '9999px',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '5rem' }}>🧠</span>
        </div>
        <h1 className="gradient-text" style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          Testez Votre QI
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          marginBottom: '2rem',
          maxWidth: '42rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Découvrez votre potentiel intellectuel avec nos tests de QI professionnels et scientifiquement validés
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href="/tests" className="btn-primary">
            Voir les Tests
          </a>
          <a href="/tests/create" className="btn-secondary">
            Créer un Test
          </a>
        </div>
      </section>

      {/* Stats Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Tests Totaux</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#0369a1' }}>{stats.totalTests}</p>
            </div>
            <div style={{ padding: '1rem', background: '#bae6fd', borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>🧠</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Tests Actifs</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#15803d' }}>{stats.activeTests}</p>
            </div>
            <div style={{ padding: '1rem', background: '#bbf7d0', borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>✅</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(to bottom right, #faf5ff, #f3e8ff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Niveaux</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#7e22ce' }}>3</p>
            </div>
            <div style={{ padding: '1rem', background: '#e9d5ff', borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>📊</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(to bottom right, #fff7ed, #fed7aa)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#4b5563', fontWeight: 600, marginBottom: '0.25rem' }}>Durée Moy.</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#c2410c' }}>45m</p>
            </div>
            <div style={{ padding: '1rem', background: '#fed7aa', borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>⏱️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#e0f2fe',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🧠</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Tests Variés
          </h3>
          <p style={{ color: '#4b5563' }}>
            Des questions de logique, mathématiques et raisonnement pour évaluer votre intelligence
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#f3e8ff',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>📈</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Progression
          </h3>
          <p style={{ color: '#4b5563' }}>
            Suivez votre évolution et améliorez vos capacités cognitives au fil du temps
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#dcfce7',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>✅</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
            Résultats Instantanés
          </h3>
          <p style={{ color: '#4b5563' }}>
            Obtenez vos résultats immédiatement après avoir terminé un test
          </p>
        </div>
      </section>
    </div>
  );
}