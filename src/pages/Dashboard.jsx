import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { UploadModal } from '../components/UploadModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.documents.list({ page: 1, limit: 5 });
      if (res && res.data) {
        setDocuments(res.data.documents || []);
        if (res.data.pagination) setTotalCount(res.data.pagination.total);
        if (res.data.summary) {
          setTotalBytes(res.data.summary.totalBytes || 0);
          setCategoriesCount(res.data.summary.categoriesCount || {});
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const getBadgeClass = (category) => {
    const cat = (category || 'Other').toLowerCase();
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
        {/* Header Banner */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '36px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Welcome back, {user?.fullName || 'Scholar'}!
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Here is an overview of your encrypted digital vault and documents.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn btn-primary"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Upload Document
            </button>
            <Link to="/documents" className="btn btn-secondary">
              <i className="fa-solid fa-folder-open"></i> Manage All
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Total Documents</span>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fa-solid fa-file-invoice"></i>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalCount}</div>
            <span style={{ color: '#34d399', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-shield-check"></i> 100% Protected
            </span>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Vault Storage Used</span>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fa-solid fa-hard-drive"></i>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {(totalBytes / (1024 * 1024)).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>MB</span>
            </div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Limit: 10 MB per file</span>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Active Categories</span>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)', color: '#34d399',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fa-solid fa-tags"></i>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {Object.keys(categoriesCount).length}
            </div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Academic, Identity, Financial...</span>
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '10px', color: 'var(--primary)' }}></i>
              Recent Documents
            </h2>
            <Link to="/documents" style={{ color: '#818cf8', fontSize: '0.9rem', fontWeight: 600 }}>
              View All Documents &rarr;
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }}></i>
              <p>Loading your documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', color: 'var(--text-dim)'
              }}>
                <i className="fa-solid fa-folder-plus"></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>No documents uploaded yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Upload your first marksheet, degree certificate, or identity proof now.
              </p>
              <button onClick={() => setIsUploadOpen(true)} className="btn btn-primary btn-sm">
                <i className="fa-solid fa-plus"></i> Upload Document
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px 16px' }}>Document Name</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>File Size</th>
                    <th style={{ padding: '12px 16px' }}>Date Uploaded</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '16px', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i className="fa-solid fa-file-pdf" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
                          <div>
                            <div>{doc.title}</div>
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
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="btn btn-secondary btn-sm"
                          disabled={downloadingId === doc.id}
                        >
                          {downloadingId === doc.id ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-download"></i>
                          )}
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};
