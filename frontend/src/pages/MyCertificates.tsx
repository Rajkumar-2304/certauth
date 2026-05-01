import React, { useState, useEffect, useCallback } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { generateCertificatePDF } from '../utils/generatePDF';
import logo from '../assets/logo.jpg';

const MyCertificates: React.FC = () => {
  const { user } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchCerts = useCallback(async () => {
    try {
      const res = await API.get('/certificates');
      setCerts(res.data.certificates);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const handleRevoke = useCallback(async (certId: string) => {
    if (!window.confirm(`Revoke certificate ${certId}? This cannot be undone.`)) return;
    setRevoking(certId);
    try {
      await API.put(`/certificates/${certId}/revoke`);
      setCerts(prev => prev.map(c => c.certificateId === certId ? { ...c, status: 'revoked' } : c));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Revoke failed');
    } finally { setRevoking(null); }
  }, []);

  // Unique courses for filter
  const uniqueCourses = Array.from(new Set(certs.map(c => c.course).filter(Boolean)));

  // Filter + Search + Sort
  const filtered = certs
    .filter(c => {
      const matchSearch =
        c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
        c.course?.toLowerCase().includes(search.toLowerCase()) ||
        c.institution?.toLowerCase().includes(search.toLowerCase()) ||
        c.rollNo?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchCourse = filterCourse === 'all' || c.course === filterCourse;
      return matchSearch && matchStatus && matchCourse;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') return a.studentName?.localeCompare(b.studentName);
      return 0;
    });

  const selectStyle: React.CSSProperties = {
    background: 'var(--navy-card)', border: '1px solid var(--navy-border)',
    color: 'var(--text-secondary)', padding: '10px 14px', borderRadius: 8,
    fontSize: 13, cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-body)'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 32px 60px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={logo} alt="CertAuth" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--text-primary)' }}>
                {user?.role === 'student' ? 'My' : 'Issued'} <span className="gold-text">Certificates</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{certs.length} total · {filtered.length} shown</p>
            </div>
          </div>
          {(user?.role === 'admin' || user?.role === 'institution') && (
            <Link className="btn btn-gold" to="/issue">+ Issue New</Link>
          )}
        </div>

        {/* Search & Filters */}
        <div className="glass-card" style={{ padding: 20, border: '1px solid var(--navy-border)', marginBottom: 24 }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input className="form-input" placeholder="Search by name, certificate ID, course, institution, roll number..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 44, width: '100%' }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18 }}>×</button>
            )}
          </div>

          {/* Filter Row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Status:</span>
              <select style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Course:</span>
              <select style={selectStyle} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                <option value="all">All Courses</option>
                {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Sort:</span>
              <select style={selectStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {(search || filterStatus !== 'all' || filterCourse !== 'all') && (
              <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterCourse('all'); }}
                style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                ✕ Clear Filters
              </button>
            )}

            <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)' }}>
              Showing <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{filtered.length}</span> of {certs.length}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: 'center', border: '1px solid var(--navy-border)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>No Certificates Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{search ? 'Try a different search term or clear filters' : 'No certificates yet'}</p>
          </div>
        ) : (
          <div className="glass-card" style={{ border: '1px solid var(--navy-border)', overflow: 'hidden' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Course</th>
                    <th>Institution</th>
                    <th>Grade</th>
                    <th>Issued</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(cert => (
                    <tr key={cert.certificateId}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--gold)', letterSpacing: 0.5 }}>{cert.certificateId}</span>
                      </td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{cert.studentName}</td>
                      <td>{cert.rollNo || '—'}</td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cert.course}</td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cert.institution}</td>
                      <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{cert.grade || '—'}</td>
                      <td>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td>
                        <span className={`badge badge-${cert.status === 'active' ? 'active' : cert.status === 'revoked' ? 'revoked' : 'expired'}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <Link to={`/verify/${cert.certificateId}`}
                            style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, fontSize: 11, textDecoration: 'none', fontWeight: 700 }}>
                            🔍 Verify
                          </Link>
                          <button onClick={() => generateCertificatePDF(cert)}
                            style={{ padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                            📄 PDF
                          </button>
                          {(user?.role === 'admin' || user?.role === 'institution') && cert.status === 'active' && (
                            <button onClick={() => handleRevoke(cert.certificateId)} disabled={revoking === cert.certificateId}
                              style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
                              {revoking === cert.certificateId ? '...' : '✕ Revoke'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;
