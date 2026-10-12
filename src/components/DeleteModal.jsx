import React, { useState } from 'react';
import { api } from '../api/client';

export const DeleteModal = ({ isOpen, document, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !document) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await api.documents.delete(document.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Deletion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#fb7185' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
            Confirm Deletion
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.88rem'
            }}>
              {error}
            </div>
          )}

          <p style={{ color: 'var(--text-main)', marginBottom: '14px' }}>
            Are you sure you want to permanently delete <strong>{document.title}</strong>?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            This action will remove the file from secure cloud storage and erase its database metadata. This cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};
