import React, { useState } from 'react';
import { api } from '../api/client';

export const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError('Selected file exceeds maximum limit of 10MB.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
      if (!title) {
        const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Document title is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('category', category);
      if (description.trim()) {
        formData.append('description', description.trim());
      }

      await api.documents.upload(formData);
      onSuccess();
      onClose();
      // Reset state
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Upload failed. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fa-solid fa-cloud-arrow-up" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
            Upload New Document
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
              <label className="form-label">Select Document File (Max 10MB)</label>
              <input
                type="file"
                className="form-input"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
                required
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Supported: PDF, PNG, JPG, JPEG, TXT, DOCX
              </span>
            </div>

            {file && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                <p><strong>Name:</strong> {file.name}</p>
                <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Document Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BTech Semester 1 Marksheet"
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
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or keywords..."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Uploading...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-up-from-bracket"></i> Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
