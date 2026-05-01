import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Verify: React.FC = () => {
  const { certId: paramCertId } = useParams<{ certId?: string }>();
  const [certId, setCertId] = useState(paramCertId || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashMode, setHashMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleVerify = useCallback(async (id?: string) => {
    const searchId = id || certId;
    if (!searchId.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await API.get(`/verify/${searchId.trim()}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally { setLoading(false); }
  }, [certId]);

  const handleFileVerify = useCallback(async () => {
    if (!file || !certId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        const res = await API.post('/verify/hash', { certId, fileContent });
        setResult(res.data);
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hash verification failed');
      setLoading(false);
    }
  }, [file, certId]);

  useEffect(() => {
    if (paramCertId) handleVerify(paramCertId);
  }, [paramCertId]); // eslint-disable-line

  const cert = result?.certificate;

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 60px', background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(212,175,55,0.05) 0%, transparent 60%), var(--navy)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeInUp 0.6s ease forwards' }}>
          <img src={logo} alt="CertAuth" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 40px)', color: 'var(--text-primary)', marginBottom: 12 }}>
            Certificate <span className="gold-text">Verification</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Enter a Certificate ID or scan a QR code to verify authenticity instantly.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, background: 'var(--navy-card)', padding: 6, borderRadius: 10, border: '1px solid var(--navy-border)' }}>
          {[{ label: '🔍 Search by ID', val: false }, { label: '📄 Verify Document', val: true }].map(m => (
            <button key={String(m.val)} onClick={() => setHashMode(m.val)}
              style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', borderRadius: 7, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, transition: 'all 0.2s', background: hashMode === m.val ? 'var(--gold)' : 'transparent', color: hashMode === m.val ? 'var(--navy)' : 'var(--text-secondary)' }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <div className="glass-card" style={{ padding: 32, border: '1px solid var(--navy-border)', marginBottom: 32 }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Certificate ID</label>
            <input className="form-input" type="text" placeholder="CERT-XXXXXXXX" value={certId} onChange={e => setCertId(e.target.value.toUpperCase())}
              onKeyPress={e => e.key === 'Enter' && !hashMode && handleVerify()}
              style={{ fontFamily: 'var(--font-display)', letterSpacing: 2 }} />
          </div>

          {hashMode && (
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Upload Document</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--navy-border)', borderRadius: 8, padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-border)'}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
                <p style={{ color: file ? 'var(--gold)' : 'var(--text-secondary)', fontSize: 14 }}>{file ? file.name : 'Click to upload PDF, DOC, PPT, or image'}</p>
                <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" />
              </div>
            </div>
          )}

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

          <button className="btn btn-gold" onClick={hashMode ? handleFileVerify : () => handleVerify()} disabled={loading || !certId} style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}>
            {loading ? <><span className="spinner" />Verifying...</> : '🔍 Verify Certificate'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="glass-card" style={{ padding: 36, border: `2px solid ${result.verified ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`, animation: 'fadeInUp 0.5s ease forwards' }}>
            {/* Status Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 10, background: result.verified ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', marginBottom: 28, border: `1px solid ${result.verified ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <div style={{ fontSize: 40 }}>{result.verified ? '✅' : '❌'}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: result.verified ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                  {result.verified ? 'CERTIFICATE VERIFIED' : 'VERIFICATION FAILED'}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  {result.verified ? 'This certificate is authentic and has not been tampered with.' : `Status: ${result.status?.toUpperCase()}`}
                </div>
              </div>
            </div>

            {cert && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  { label: 'Certificate ID', value: cert.certificateId },
                  { label: 'Student Name', value: cert.studentName },
                  { label: 'Roll Number', value: cert.rollNo || '—' },
                  { label: 'Course', value: cert.course },
                  { label: 'Institution', value: cert.institution },
                  { label: 'Grade', value: cert.grade || '—' },
                  { label: 'Issue Date', value: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                  { label: 'Issued By', value: cert.issuedBy || '—' },
                  { label: 'Verifications', value: String(cert.verificationCount) },
                  { label: 'Document Hash', value: cert.documentHash ? cert.documentHash.substring(0, 20) + '...' : '—' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px 0', borderBottom: '1px solid var(--navy-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: 14 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {result.hashMatch !== undefined && (
              <div className={`alert ${result.hashMatch ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 20 }}>
                {result.hashMatch ? '✅ Document hash matches — file is unmodified.' : '❌ Hash mismatch — document may have been tampered with!'}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {!result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 8 }}>
            {[
              { icon: '📱', tip: 'Scan the QR code on any physical or digital certificate to auto-fill the ID.' },
              { icon: '🔒', tip: 'All verifications are logged for audit trail and fraud detection.' },
              { icon: '⚡', tip: 'Results are returned in under 2 seconds from our global database.' },
            ].map(t => (
              <div key={t.tip} className="glass-card gold-border" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
