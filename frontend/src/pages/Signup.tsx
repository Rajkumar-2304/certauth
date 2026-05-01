import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Signup: React.FC = () => {
  const { signup, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', role: 'student', institution: '', rollNo: '', admissionNo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await signup(form);
      setUserId(res.userId);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  }, [form, signup]);

  const handleOtpSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await verifyOtp(userId, otp);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  }, [userId, otp, verifyOtp, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%), var(--navy)' }}>
      <div style={{ width: '100%', maxWidth: 520, animation: 'fadeInUp 0.6s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src={logo} alt="CertAuth" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', letterSpacing: 3 }}>CERTAUTH</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 36, border: '1px solid var(--navy-border)' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

          {step === 'form' ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" name="email" placeholder="you@institution.edu" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" name="role" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="institution">Institution</option>
                  <option value="employer">Employer / Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {(form.role === 'student' || form.role === 'institution') && (
                <div className="form-group">
                  <label className="form-label">Institution Name</label>
                  <input className="form-input" name="institution" placeholder="IIT Delhi / Anna University" value={form.institution} onChange={handleChange} />
                </div>
              )}

              {form.role === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input className="form-input" name="rollNo" placeholder="20CS001" value={form.rollNo} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admission No</label>
                    <input className="form-input" name="admissionNo" placeholder="ADM2020001" value={form.admissionNo} onChange={handleChange} />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" name="password" placeholder="Min. 8 chars" value={form.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
                </div>
              </div>

              <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                {loading ? <><span className="spinner" />Creating Account...</> : '🚀 Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="alert alert-success">
                ✅ OTP sent to your email! Check your inbox.
              </div>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <input className="form-input" type="text" placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required style={{ textAlign: 'center', fontSize: 32, letterSpacing: 12, fontFamily: 'var(--font-display)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>OTP expires in 10 minutes</span>
              </div>
              <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? <><span className="spinner" />Verifying...</> : '✓ Verify & Continue'}
              </button>
            </form>
          )}

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
