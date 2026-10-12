import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass)',
      padding: '40px 0',
      background: 'rgba(11, 15, 25, 0.95)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
            <i className="fa-solid fa-vault"></i>
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Smart Digital Locker</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Smart Digital Locker. Secured by Spring Boot, MySQL & React.
        </p>
        <div style={{ display: 'flex', gap: '18px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span><i className="fa-solid fa-shield-check" style={{ color: 'var(--accent-emerald)', marginRight: '6px' }}></i> AES-256 Storage</span>
          <span><i className="fa-solid fa-lock" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> JWT Auth</span>
        </div>
      </div>
    </footer>
  );
};
