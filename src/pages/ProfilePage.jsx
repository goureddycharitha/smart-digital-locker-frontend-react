import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (fullName.trim().length < 2) {
      setProfileError('Full name must be at least 2 characters.');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await api.users.updateProfile({ fullName: fullName.trim() });
      if (res && res.data) {
        updateUser(res.data);
      }
      setProfileSuccess('Profile name updated successfully.');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      setPasswordError('Password must contain 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.users.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully. Your session remains secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Password update failed.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
          Account & Security Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '36px' }}>
          Manage your personal details and account credentials.
        </p>

        {/* User Card */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--primary-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#fff'
            }}>
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.fullName || 'User'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
              <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                <span className="badge badge-identity">
                  <i className="fa-solid fa-shield"></i> {user?.role || 'ROLE_USER'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>
            <i className="fa-solid fa-user-pen" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
            Update Profile Information
          </h3>

          {profileSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px',
              fontSize: '0.88rem', border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i>
              {profileSuccess}
            </div>
          )}

          {profileError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px',
              fontSize: '0.88rem', border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Email address is uniquely bound to your account and cannot be modified.
              </span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>
            <i className="fa-solid fa-lock" style={{ color: 'var(--accent-amber)', marginRight: '8px' }}></i>
            Change Account Password
          </h3>

          {passwordSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px',
              fontSize: '0.88rem', border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i>
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px',
              fontSize: '0.88rem', border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
