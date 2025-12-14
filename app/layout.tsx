import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TestQI - Plateforme de Tests de QI",
  description: "Gérez et passez des tests de QI interactifs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div style={{ minHeight: '100vh' }}>
          <header style={{
            background: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderBottom: '4px solid',
            borderImage: 'linear-gradient(to right, #0284c7, #9333ea) 1'
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'linear-gradient(to bottom right, #0284c7, #9333ea)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🧠</span>
                  </div>
                  <div>
                    <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                      TestQI
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Plateforme Intelligence</p>
                  </div>
                </div>
                <nav style={{ display: 'flex', gap: '1.5rem' }}>
                  <a href="/" style={{ color: '#374151', fontWeight: 600, textDecoration: 'none' }}>
                    Accueil
                  </a>
                  <a href="/tests" style={{ color: '#374151', fontWeight: 600, textDecoration: 'none' }}>
                    Tests
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
            {children}
          </main>

          <footer style={{ background: '#111827', color: 'white', padding: '2rem 0', marginTop: '4rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
              <p style={{ color: '#9ca3af' }}>
                © 2025 TestQI - Projet Mini SOA
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}