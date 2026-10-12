import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <i className="fa-solid fa-vault"></i>
          </div>
          <span>Smart Digital Locker</span>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <i className="fa-solid fa-chart-pie"></i> Dashboard
              </Link>
              <Link to="/documents" className={`nav-link ${location.pathname === '/documents' ? 'active' : ''}`}>
                <i className="fa-solid fa-folder-open"></i> My Documents
              </Link>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <i className="fa-solid fa-user-shield"></i> Profile
              </Link>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link">
                <i className="fa-solid fa-layer-group"></i> Features
              </a>
              <a href="/#security" className="nav-link">
                <i className="fa-solid fa-shield-halved"></i> Security
              </a>
              <a href="/#about" className="nav-link">
                <i className="fa-solid fa-circle-info"></i> About
              </a>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-user" style={{ marginRight: '6px' }}></i>
                {user?.fullName || 'User'}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-right-to-bracket"></i> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <i className="fa-solid fa-user-plus"></i> Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
