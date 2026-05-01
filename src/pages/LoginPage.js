import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Log in to your Lost & Found account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={styles.input} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={styles.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0a', padding: '20px'
  },
  card: {
    background: '#111', border: '1px solid #222', borderRadius: '16px',
    padding: '48px', width: '100%', maxWidth: '420px'
  },
  title: {
    fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: '#f0f0f0',
    margin: '0 0 8px'
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#666', margin: '0 0 32px'
  },
  error: {
    background: '#2d1215', border: '1px solid #5c2b2e', color: '#f87171',
    padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
    fontFamily: "'DM Sans', sans-serif"
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#888', fontWeight: 500
  },
  input: {
    background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px',
    padding: '12px 16px', color: '#f0f0f0', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", outline: 'none'
  },
  button: {
    background: '#4ade80', color: '#0a0a0a', border: 'none', borderRadius: '8px',
    padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", marginTop: '8px'
  },
  footer: {
    textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#666',
    fontFamily: "'DM Sans', sans-serif"
  },
  link: { color: '#4ade80', textDecoration: 'none' }
};

export default LoginPage;
