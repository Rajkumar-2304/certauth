import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Footer: React.FC = () => (
  <footer style={{ background: 'var(--navy-mid)', borderTop: '1px solid var(--navy-border)', padding: '48px 32px 24px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img src={logo} alt="CertAuth" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 16, letterSpacing: 2 }}>CERTAUTH</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            Securing academic futures through cryptographic certificate validation. SIH Problem Statement #SIH25029.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-display)' }}>Quick Links</h4>
          {[['/', 'Home'], ['/about', 'About'], ['/verify', 'Verify Certificate'], ['/login', 'Login'], ['/signup', 'Sign Up']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, marginBottom: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target as any).style.color = 'var(--gold)'}
              onMouseLeave={e => (e.target as any).style.color = 'var(--text-secondary)'}>{label}</Link>
          ))}
        </div>

        {/* Tech Stack */}
        <div>
          <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-display)' }}>Technology</h4>
          {['React + TypeScript', 'Node.js + Express', 'MongoDB Atlas', 'SHA-256 Hashing', 'QR Code Generation', 'Nodemailer 2FA', 'JWT Authentication'].map(t => (
            <div key={t} style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 6 }}>• {t}</div>
          ))}
        </div>

        {/* SIH Info */}
        <div>
          <h4 style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-display)' }}>SIH 2025</h4>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 2 }}>
            <div>PS ID: <span style={{ color: 'var(--gold)' }}>SIH25029</span></div>
            <div>Theme: <span style={{ color: 'var(--text-primary)' }}>Smart Education</span></div>
            <div>Org: <span style={{ color: 'var(--text-primary)' }}>AICTE / MoE</span></div>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6 }}>
              <div style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>AUTHENTICITY VALIDATOR</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2 }}>FOR ACADEMIA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>© 2025 CertAuth. Built for Smart India Hackathon.</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Secured with SHA-256 Cryptographic Hashing</p>
      </div>
    </div>
  </footer>
);

export default Footer;
