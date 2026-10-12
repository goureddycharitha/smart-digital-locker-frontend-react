import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const EditDocumentModal = ({ isOpen, document, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setCategory(document.category || 'Other');
      setDescription(document.description || '');
      setError('');
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.documents.update(document.id, {
        title: title.trim(),
        category,
        description: description.trim()
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
            Edit Document Metadata
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '0.88rem',
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}>
                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Document Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Identity">Identity</option>
                <option value="Financial">Financial</option>
                <option value="Medical">Medical</option>
                <option value="Certificates">Certificates</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
