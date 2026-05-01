import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [userId, setUserId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(form.email, form.password);
      if (res.require2FA) { setShow2FA(true); setUserId(res.userId); }
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  }, [form, login, navigate]);

  const handle2FA = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await API.post('/auth/verify-2fa', { userId, token: twoFAToken });
      if (res.data.token) {
        localStorage.setItem('certauth_token', res.data.token);
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA token');
    } finally { setLoading(false); }
  }, [userId, twoFAToken, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%), var(--navy)' }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp 0.6s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src={logo} alt="CertAuth" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', letterSpacing: 3 }}>CERTAUTH</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>Sign in to your account</p>
        </div>

        <div className="glass-card" style={{ padding: 36, border: '1px solid var(--navy-border)' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

          {!show2FA ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" name="email" placeholder="you@institution.edu" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                {loading ? <><span className="spinner" />Signing In...</> : '🔐 Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FA} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="alert alert-info">🔑 Enter the 6-digit code from your authenticator app</div>
              <div className="form-group">
                <label className="form-label">2FA Code</label>
                <input className="form-input" type="text" placeholder="000000" maxLength={6} value={twoFAToken} onChange={e => setTwoFAToken(e.target.value)} required style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }} />
              </div>
              <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? <><span className="spinner" />Verifying...</> : '✓ Verify & Login'}
              </button>
            </form>
          )}

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 700 }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
