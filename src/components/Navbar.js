import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) { /* ignore */ }
    logoutUser();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoIcon}>◉</span> Lost & Found
      </Link>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/report" style={styles.link}>Report Item</Link>
            <Link to="/search" style={styles.link}>Search</Link>
            <Link to="/matches" style={styles.link}>Matches</Link>
            <span style={styles.userName}>{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 40px', background: '#0a0a0a', borderBottom: '1px solid #1a1a1a',
    position: 'sticky', top: 0, zIndex: 100
  },
  logo: {
    fontSize: '20px', fontFamily: "'DM Serif Display', serif", color: '#f0f0f0',
    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
  },
  logoIcon: { color: '#4ade80', fontSize: '24px' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: {
    color: '#a0a0a0', textDecoration: 'none', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    transition: 'color 0.2s'
  },
  userName: {
    color: '#4ade80', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600
  },
  logoutBtn: {
    background: 'none', border: '1px solid #333', color: '#a0a0a0',
    padding: '6px 16px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', fontFamily: "'DM Sans', sans-serif"
  },
  signupBtn: {
    background: '#4ade80', color: '#0a0a0a', padding: '8px 20px',
    borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600
  }
};

export default Navbar;
