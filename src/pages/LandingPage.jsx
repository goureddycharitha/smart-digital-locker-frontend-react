import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '100px 0 80px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <i className="fa-solid fa-shield-halved"></i>
            Spring Boot 3 + MySQL + React Full-Stack Architecture
          </div>

          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '24px'
          }}>
            Your Personal, Secure <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Cloud Document Vault
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            Store, categorize, download, and safeguard your academic certificates, identity cards,
            and vital records with end-to-end authorization, file signature inspection, and zero data leaks.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                <i className="fa-solid fa-arrow-right"></i> Open My Locker
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-user-plus"></i> Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  <i className="fa-solid fa-right-to-bracket"></i> Sign In to Vault
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '14px' }}>
              Built for Security & Performance
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Engineered with enterprise security patterns to ensure your private files remain truly private.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <div className="glass-card">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '20px'
              }}>
                <i className="fa-solid fa-file-shield"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>Magic-Byte Inspection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Validates true binary signatures (PDF, PNG, JPEG, DOCX) to block spoofed or malicious uploads.
              </p>
            </div>

            <div className="glass-card">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '20px'
              }}>
                <i className="fa-solid fa-key"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>BCrypt & JWT Auth</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Passwords hashed with 12-round BCrypt. Protected REST APIs guarded by stateless JSON Web Tokens.
              </p>
            </div>

            <div className="glass-card">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '20px'
              }}>
                <i className="fa-solid fa-database"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>MySQL Relational Store</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Strict foreign keys, cascade safety, and parameterized Spring Data JPA queries eliminate SQL injection.
              </p>
            </div>

            <div className="glass-card">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#22d3ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                marginBottom: '20px'
              }}>
                <i className="fa-solid fa-download"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '10px' }}>Controlled Streaming</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Files are stored with UUID tokens outside web roots and streamed with verified ownership headers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Breakdown Section */}
      <section id="security" style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                DEFENSE-IN-DEPTH ARCHITECTURE
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '18px' }}>
                Engineered with Enterprise Principles
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Every document upload, download, and query is verified against the authenticated user's ID at the service layer, preventing Insecure Direct Object References (IDOR).
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i>
                  <span>Path Traversal Protection via normalized filesystem boundaries</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i>
                  <span>10MB upload threshold enforced at servlet and service layers</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i>
                  <span>Spring Security 6 with stateless JWT Bearer token filter</span>
                </li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '36px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Live Security Metrics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span>BCrypt Hashing Rounds</span>
                    <span style={{ color: '#818cf8', fontWeight: 600 }}>12 Rounds</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span>Automated Backend Tests</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>100% Passing</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span>JWT Signature Key Length</span>
                    <span style={{ color: '#22d3ee', fontWeight: 600 }}>256-bit Secure</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                    <div style={{ width: '100%', height: '100%', background: '#06b6d4', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="glass-card" style={{ padding: '48px 32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>
              Ready to secure your documents?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Create your free digital locker account in seconds.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              <i className="fa-solid fa-lock"></i> Create Free Locker Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
