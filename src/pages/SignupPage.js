import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const res = await signup({ name, email, phone, password });
      loginUser(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>Join the Lost & Found community</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              style={styles.input} placeholder="John Doe" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={styles.input} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Phone (optional)</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              style={styles.input} placeholder="+966 5x xxx xxxx" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={styles.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
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

export default SignupPage;
