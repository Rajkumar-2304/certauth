import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const About: React.FC = () => (
  <div style={{ minHeight: '100vh', padding: '100px 32px 60px', background: 'var(--navy)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64, animation: 'fadeInUp 0.6s ease forwards' }}>
        <img src={logo} alt="CertAuth" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', objectFit: 'cover', marginBottom: 24, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }} />
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', marginBottom: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Smart India Hackathon 2025 · PS #SIH25029</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--text-primary)', marginBottom: 16 }}>
          About <span className="gold-text">CertAuth</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
          A digital ecosystem for verifying the genuineness of academic documents — ensuring only deserving candidates receive the opportunities they earned.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="glass-card" style={{ padding: 40, border: '1px solid rgba(212,175,55,0.2)', marginBottom: 40, background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 100%)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)', marginBottom: 16, letterSpacing: 1 }}>Problem Statement</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: 15 }}>
          The manual verification of academic documents is <strong style={{ color: 'var(--text-primary)' }}>time-consuming and vulnerable to forgery</strong>. 
          Employers, universities, and government agencies face challenges verifying certificates received from candidates. 
          Forged certificates lead to undeserving candidates securing jobs, admissions, and opportunities — undermining the integrity of education.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 24 }}>
          {[
            { label: 'PS ID', value: 'SIH25029' },
            { label: 'Theme', value: 'Smart Education' },
            { label: 'Organization', value: 'AICTE / MoE' },
            { label: 'Category', value: 'Smart Automation' },
          ].map(item => (
            <div key={item.label} style={{ padding: '12px 16px', background: 'rgba(212,175,55,0.05)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.1)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 14 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 24 }}>Technology <span className="gold-text">Stack</span></h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 }}>
        {[
          { layer: 'Frontend', tech: 'React + TypeScript', icon: '⚛️', desc: 'Component-based UI with hooks, useCallback, useState, useEffect, useRef' },
          { layer: 'Backend', tech: 'Node.js + Express', icon: '🚀', desc: 'RESTful API with JWT auth, rate limiting, and middleware pipeline' },
          { layer: 'Database', tech: 'MongoDB + Mongoose', icon: '🍃', desc: 'Document storage for certificate metadata and cryptographic hashes' },
          { layer: 'Security', tech: 'SHA-256 + JWT + 2FA', icon: '🔐', desc: 'Cryptographic hashing, token auth, TOTP-based two-factor authentication' },
          { layer: 'Email', tech: 'Nodemailer', icon: '📧', desc: 'SMTP email for OTP verification, certificate issuance notifications' },
          { layer: 'QR Code', tech: 'qrcode library', icon: '📱', desc: 'Auto-generated QR codes linking to the public verification portal' },
          { layer: 'Styling', tech: 'Custom CSS + Tailwind', icon: '🎨', desc: 'CSS variables, animations, responsive design without external UI libs' },
          { layer: 'Build', tech: 'Webpack (CRA)', icon: '📦', desc: 'Create React App bundles with Webpack under the hood' },
        ].map(item => (
          <div key={item.layer} className="glass-card gold-border" style={{ padding: 24, transition: 'all 0.3s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{item.layer}</div>
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{item.tech}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 24 }}>Key <span className="gold-text">Features</span></h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        {[
          { num: '01', title: 'Cryptographic Document Hashing', desc: 'Every uploaded certificate is processed through SHA-256 to generate a unique fingerprint. Any tampering—even a single byte—changes the hash, instantly revealing forgery.' },
          { num: '02', title: 'QR Code Integration', desc: 'Each issued certificate gets a unique QR code that links directly to our verification portal. Employers can scan in seconds without creating an account.' },
          { num: '03', title: 'Two-Factor Authentication', desc: 'Institutional accounts are protected by TOTP-based 2FA using Google Authenticator or any TOTP app, preventing unauthorized certificate issuance.' },
          { num: '04', title: 'Real-time Analytics', desc: 'Administrators and institutions get a live dashboard showing issued vs. verified certificates, fraud detection counts, and institution-wise breakdowns.' },
          { num: '05', title: 'Multi-Format Document Support', desc: 'Accept certificates in PDF, Microsoft Word, PowerPoint, or image formats. All are hashed and stored securely.' },
          { num: '06', title: 'Email Notification System', desc: 'Nodemailer sends automated emails for account verification OTPs, certificate issuance confirmations, and revocation alerts.' },
        ].map(f => (
          <div key={f.num} style={{ display: 'flex', gap: 24, padding: 24, borderLeft: '3px solid var(--gold)', background: 'rgba(212,175,55,0.02)', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'rgba(212,175,55,0.2)', fontWeight: 900, minWidth: 40 }}>{f.num}</div>
            <div>
              <h3 style={{ color: 'var(--gold)', fontSize: 15, fontFamily: 'var(--font-display)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 12 }}>
          Ready to experience it?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Try verifying a certificate or create your institution account.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-gold" to="/verify">🔍 Verify Now</Link>
          <Link className="btn btn-outline" to="/signup">🏛️ Create Account</Link>
        </div>
      </div>
    </div>
  </div>
);

export default About;
