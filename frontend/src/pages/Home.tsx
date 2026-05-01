import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const features = [
  { icon: '🔐', title: 'SHA-256 Hashing', desc: 'Every certificate is fingerprinted with military-grade cryptographic hashing stored in our secure database.' },
  { icon: '📱', title: 'QR Code Verification', desc: 'Instant one-scan verification. Each certificate carries a unique QR code linking to our verification portal.' },
  { icon: '🏛️', title: 'Institution Portal', desc: 'A dedicated dashboard for colleges to upload student data, issue digital certificates, and manage records.' },
  { icon: '🔍', title: 'Public Verification', desc: 'Employers and recruiters can verify any certificate by Certificate ID or QR scan — no login required.' },
  { icon: '📧', title: 'Email Notifications', desc: 'Automated Nodemailer-powered emails for issuance, OTP verification, and status change alerts.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time charts tracking issued vs. verified documents, top institutions, and fraud attempts.' },
  { icon: '🔑', title: 'Two-Factor Auth', desc: 'TOTP-based 2FA for all institutional logins. Your issuance portal is protected by a second layer.' },
  { icon: '📄', title: 'Multi-Format Support', desc: 'Upload certificates in PDF, Word, PowerPoint, or image formats. Our engine hashes them all.' },
];

const stats = [
  { value: '100%', label: 'Tamper Detection' },
  { value: 'SHA-256', label: 'Encryption Standard' },
  { value: '<2s', label: 'Verification Speed' },
  { value: '24/7', label: 'Public Access' },
];

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      heroRef.current.style.backgroundPosition = `${50 + x * 0.3}% ${50 + y * 0.3}%`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 32px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.08) 0%, transparent 70%), var(--navy)',
      }}>
        {/* Particle decorations */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: [300, 200, 150, 400, 100, 250][i], height: [300, 200, 150, 400, 100, 250][i],
            left: `${[5, 70, 30, 60, 10, 80][i]}%`, top: `${[10, 20, 60, 70, 80, 40][i]}%`,
            background: `radial-gradient(circle, rgba(212,175,55,${[0.04, 0.03, 0.05, 0.02, 0.04, 0.03][i]}) 0%, transparent 70%)`,
            animation: `float ${[6, 8, 7, 9, 5, 7][i]}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`, pointerEvents: 'none'
          }} />
        ))}

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1, animation: 'fadeInUp 0.8s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            <img src={logo} alt="CertAuth" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', objectFit: 'cover', boxShadow: '0 0 30px rgba(212,175,55,0.4)', animation: 'float 4s ease-in-out infinite' }} />
          </div>

          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>SIH 2025 — Problem Statement #SIH25029</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1.1, marginBottom: 24, color: 'var(--text-primary)' }}>
            Academic<br /><span className="gold-text">Certificate</span><br />Authenticator
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8 }}>
            End-to-end cryptographic verification platform ensuring every academic credential is genuine. Zero forgery. Zero doubt.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-gold" to="/verify" style={{ fontSize: 15, padding: '14px 36px' }}>
              🔍 Verify Certificate
            </Link>
            <Link className="btn btn-outline" to="/signup" style={{ fontSize: 15, padding: '14px 36px' }}>
              🏛️ Institution Portal
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 64, padding: '24px', background: 'rgba(18,18,42,0.6)', border: '1px solid var(--navy-border)', borderRadius: 16, backdropFilter: 'blur(10px)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 28px)', color: 'var(--gold)', fontWeight: 700 }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px', background: 'var(--navy-mid)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: 16 }}>
              Platform <span className="gold-text">Capabilities</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Every feature engineered to combat academic fraud and empower legitimate verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={f.title} className="glass-card gold-border" style={{ padding: 28, transition: 'all 0.3s', cursor: 'default', animation: `fadeInUp 0.6s ease ${i * 0.08}s both` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glow)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--gold)', marginBottom: 10, letterSpacing: 0.5 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', color: 'var(--text-primary)', marginBottom: 16 }}>
            How It <span className="gold-text">Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 60 }}>Three simple steps. Bulletproof results.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Institution Issues', desc: 'College uploads the certificate document. System generates a SHA-256 hash + unique QR code.' },
              { step: '02', title: 'Student Receives', desc: 'Student gets an email with their Certificate ID, QR code, and a direct verification link.' },
              { step: '03', title: 'Employer Verifies', desc: 'Scan the QR or enter Certificate ID on our public portal. Results in under 2 seconds.' },
            ].map(step => (
              <div key={step.step} style={{ position: 'relative', padding: 32, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: 'rgba(212,175,55,0.1)', fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>{step.step}</div>
                <h3 style={{ color: 'var(--gold)', fontSize: 16, fontFamily: 'var(--font-display)', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, var(--navy-mid) 100%)', borderTop: '1px solid var(--navy-border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-primary)', marginBottom: 16 }}>
            Ready to <span className="gold-text">Authenticate?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
            Join the network of institutions making academic credentials trustworthy.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-gold" to="/signup" style={{ fontSize: 15, padding: '14px 36px' }}>Get Started Free</Link>
            <Link className="btn btn-outline" to="/about" style={{ fontSize: 15, padding: '14px 36px' }}>Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
