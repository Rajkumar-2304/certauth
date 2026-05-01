import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { icon: '🔍', title: 'Verify Certificate', desc: 'Publicly verify any certificate by ID or document hash.', to: '/verify', color: '#3b82f6' },
    { icon: '📋', title: 'My Certificates', desc: 'View all certificates associated with your account.', to: '/certificates', color: '#22c55e' },
    ...(user?.role === 'admin' || user?.role === 'institution' ? [
      { icon: '🎓', title: 'Issue Certificate', desc: 'Issue a new digital certificate with QR code & hash.', to: '/issue', color: '#d4af37' },
      { icon: '📊', title: 'Analytics', desc: 'Real-time stats on issued and verified certificates.', to: '/analytics', color: '#a855f7' },
    ] : []),
  ];

  const roleColors: Record<string, string> = {
    admin: '#ef4444',
    institution: '#d4af37',
    student: '#22c55e',
    employer: '#3b82f6',
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 32px 60px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Welcome Banner */}
        <div className="glass-card" style={{ padding: '36px 40px', marginBottom: 40, border: '1px solid rgba(212,175,55,0.2)', background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(18,18,42,0.9) 100%)', animation: 'fadeInUp 0.5s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src={logo} alt="CertAuth" style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 28px)', color: 'var(--text-primary)' }}>
                  Welcome back, <span style={{ color: 'var(--gold)' }}>{user?.name}</span>
                </h1>
                <span className="badge" style={{ background: `${roleColors[user?.role || 'student']}20`, color: roleColors[user?.role || 'student'], border: `1px solid ${roleColors[user?.role || 'student']}40` }}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>{user?.email}</p>
            </div>
            <div style={{ textAlign: 'right', display: 'none' }} className="hide-mobile">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>SIH 2025</div>
              <div style={{ color: 'var(--gold)', fontSize: 11 }}>PS #SIH25029</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Your Role', value: user?.role || '—', icon: '👤' },
            { label: 'Platform', value: 'CERTAUTH', icon: '🏛️' },
            { label: 'Security', value: 'SHA-256', icon: '🔐' },
            { label: 'Status', value: 'Active', icon: '✅' },
          ].map(stat => (
            <div key={stat.label} className="glass-card gold-border" style={{ padding: 20, textAlign: 'center', animation: 'fadeInUp 0.5s ease forwards' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {cards.map((card, i) => (
            <Link key={card.title} to={card.to} style={{ textDecoration: 'none', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
              <div className="glass-card" style={{ padding: 28, border: '1px solid var(--navy-border)', transition: 'all 0.3s', height: '100%' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = card.color; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 8px 30px ${card.color}20`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--navy-border)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${card.color}15`, border: `1px solid ${card.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-primary)', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{card.desc}</p>
                <div style={{ color: card.color, fontSize: 12, fontWeight: 700, marginTop: 16, letterSpacing: 0.5 }}>→ Go there</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
