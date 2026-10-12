import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass-card" style={{ maxWidth: '500px', padding: '48px 32px' }}>
        <div style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '16px'
        }}>
          404
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          The requested document vault section does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="fa-solid fa-house"></i> Return to Safety
        </Link>
      </div>
    </div>
  );
};
