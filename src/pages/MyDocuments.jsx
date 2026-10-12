import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { UploadModal } from '../components/UploadModal';
import { EditDocumentModal } from '../components/EditDocumentModal';
import { DeleteModal } from '../components/DeleteModal';

export const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.documents.list({
        page,
        limit: 10,
        search,
        category: category === 'ALL' ? '' : category
      });
      if (res && res.data) {
        setDocuments(res.data.documents || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalCount(res.data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDocuments();
  };

  const handleDownload = async (id) => {
    setDownloadingId(id);
    try {
      await api.documents.download(id);
    } catch (err) {
      alert('Download error: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const getBadgeClass = (catName) => {
    const cat = (catName || 'Other').toLowerCase();
    switch (cat) {
      case 'academic': return 'badge-academic';
      case 'identity': return 'badge-identity';
      case 'financial': return 'badge-financial';
      case 'medical': return 'badge-medical';
      case 'certificates': return 'badge-certificates';
      default: return 'badge-other';
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
              My Secure Documents
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Total {totalCount} document{totalCount === 1 ? '' : 's'} stored in your encrypted locker.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="btn btn-primary"
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Document
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '260px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search documents by title or file name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                <i className="fa-solid fa-magnifying-glass"></i> Search
              </button>
            </form>

            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Identity">Identity</option>
                <option value="Financial">Financial</option>
                <option value="Medical">Medical</option>
                <option value="Certificates">Certificates</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="glass-card" style={{ padding: '32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', marginBottom: '16px' }}></i>
              <p>Retrieving documents from vault...</p>
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', color: 'var(--text-dim)'
              }}>
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '8px' }}>No documents found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                {search || category ? 'Try adjusting your search criteria or filter.' : 'Your digital locker is empty. Start by uploading a file.'}
              </p>
              <button onClick={() => setIsUploadOpen(true)} className="btn btn-primary btn-sm">
                <i className="fa-solid fa-plus"></i> Upload Document
              </button>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '12px 16px' }}>Title & Original File</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Size</th>
                      <th style={{ padding: '12px 16px' }}>Uploaded At</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '8px',
                              background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.1rem'
                            }}>
                              <i className="fa-solid fa-file-shield"></i>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#fff' }}>{doc.title}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{doc.originalFileName}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`badge ${getBadgeClass(doc.category)}`}>
                            {doc.category}
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleDownload(doc.id)}
                              className="btn btn-secondary btn-sm"
                              title="Download Document"
                              disabled={downloadingId === doc.id}
                            >
                              {downloadingId === doc.id ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa-solid fa-download"></i>
                              )}
                            </button>
                            <button
                              onClick={() => setEditingDoc(doc)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Metadata"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={() => setDeletingDoc(doc)}
                              className="btn btn-danger btn-sm"
                              title="Delete Permanently"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-glass)'
                }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-secondary btn-sm"
                  >
                    &larr; Previous
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-secondary btn-sm"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDocuments}
      />

      <EditDocumentModal
        isOpen={Boolean(editingDoc)}
        document={editingDoc}
        onClose={() => setEditingDoc(null)}
        onSuccess={fetchDocuments}
      />

      <DeleteModal
        isOpen={Boolean(deletingDoc)}
        document={deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onSuccess={fetchDocuments}
      />
    </div>
  );
};
