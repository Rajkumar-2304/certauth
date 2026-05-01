import React, { useState, useCallback, useRef } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const IssueCertificate: React.FC = () => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    studentName: '', studentEmail: '', rollNo: '', admissionNo: '',
    course: '', institution: user?.institution || '',
    grade: '', expiryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
      if (file) formData.append('document', file);
      const res = await API.post('/certificates/issue', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(res.data.certificate);
      setForm(f => ({ ...f, studentName: '', studentEmail: '', rollNo: '', admissionNo: '', course: '', grade: '', expiryDate: '' }));
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to issue certificate');
    } finally { setLoading(false); }
  }, [form, file]);

  return (
    <div style={{ minHeight: '100vh', padding: '100px 32px 60px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeInUp 0.5s ease forwards' }}>
          <img src={logo} alt="CertAuth" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-primary)', marginBottom: 8 }}>
            Issue <span className="gold-text">Certificate</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Generate a cryptographically signed digital certificate with QR code.</p>
        </div>

        {success && (
          <div className="alert alert-success" style={{ marginBottom: 24, padding: 24, flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
              ✅ Certificate Issued Successfully!
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>Certificate ID: <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', letterSpacing: 1 }}>{success.certificateId}</span></div>
              <div style={{ fontSize: 13 }}>SHA-256 Hash: <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{success.documentHash?.substring(0, 40)}...</span></div>
            </div>
            {success.qrCode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={success.qrCode} alt="QR" style={{ width: 100, height: 100, borderRadius: 8, border: '2px solid rgba(34,197,94,0.3)' }} />
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>QR code for public verification. Student notified via email.</div>
              </div>
            )}
          </div>
        )}

        {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>⚠️ {error}</div>}

        <div className="glass-card" style={{ padding: 36, border: '1px solid var(--navy-border)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid var(--navy-border)', paddingBottom: 12 }}>Student Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Student Full Name *</label>
                <input className="form-input" name="studentName" placeholder="John Doe" value={form.studentName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Student Email</label>
                <input className="form-input" type="email" name="studentEmail" placeholder="student@college.edu" value={form.studentEmail} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input className="form-input" name="rollNo" placeholder="20CS001" value={form.rollNo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Admission Number</label>
                <input className="form-input" name="admissionNo" placeholder="ADM2020001" value={form.admissionNo} onChange={handleChange} />
              </div>
            </div>

            <div className="divider" style={{ margin: '0' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase' }}>Certificate Details</h3>

            <div className="form-group">
              <label className="form-label">Course / Program *</label>
              <input className="form-input" name="course" placeholder="B.Tech Computer Science & Engineering" value={form.course} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Institution *</label>
              <input className="form-input" name="institution" placeholder="Anna University, Chennai" value={form.institution} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Grade / CGPA</label>
                <input className="form-input" name="grade" placeholder="8.5 / 10" value={form.grade} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
              </div>
            </div>

            <div className="divider" style={{ margin: '0' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase' }}>Document Upload (Optional)</h3>

            <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--navy-border)', borderRadius: 10, padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--navy-border)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
              <p style={{ color: file ? 'var(--gold)' : 'var(--text-secondary)', fontWeight: file ? 700 : 400 }}>{file ? `✓ ${file.name}` : 'Upload PDF, Word, PPT, or Image'}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>Max 10MB. SHA-256 hash will be generated.</p>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png" />
            </div>

            <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px' }}>
              {loading ? <><span className="spinner" />Issuing Certificate...</> : '🎓 Issue Certificate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;
