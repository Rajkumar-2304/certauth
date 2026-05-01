import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.jpg';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    padding: '0 32px', height: '70px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all 0.4s ease',
    background: scrolled ? 'rgba(var(--navy-rgb, 10,10,26),0.95)' : 'transparent',
    borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    backgroundColor: scrolled ? 'var(--navy-mid)' : 'transparent',
  };

  const linkStyle = { color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' as const, transition: 'color 0.2s', padding: '4px 0' };
  const activeLinkStyle = { ...linkStyle, color: 'var(--gold)' };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <img src={logo} alt="CertAuth" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--gold)', letterSpacing: 2 }}>CERTAUTH</div>
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: -2 }}>Academic Validator</div>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Home</NavLink>
        <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>About</NavLink>
        <NavLink to="/verify" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Verify</NavLink>
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Dashboard</NavLink>
            <NavLink to="/certificates" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Certificates</NavLink>
            {(user?.role === 'admin' || user?.role === 'institution') && (
              <>
                <NavLink to="/issue" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Issue</NavLink>
                <NavLink to="/analytics" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Analytics</NavLink>
              </>
            )}
          </>
        )}
      </div>

      {/* Right side */}
      <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <div className="theme-toggle-ball">{theme === 'dark' ? '🌙' : '☀️'}</div>
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button className="btn btn-outline" style={{ padding: '8px 18px', fontSize: 12 }} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link className="btn btn-outline" style={{ padding: '8px 20px', fontSize: 12 }} to="/login">Login</Link>
            <Link className="btn btn-gold" style={{ padding: '8px 20px', fontSize: 12 }} to="/signup">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="theme-toggle show-mobile" onClick={toggleTheme} style={{ display: 'none' }}>
          <div className="theme-toggle-ball">{theme === 'dark' ? '🌙' : '☀️'}</div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
