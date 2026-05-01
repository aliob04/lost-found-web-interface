import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <span style={styles.badge}>SWE 455 — Cloud Applications Engineering</span>
        <h1 style={styles.heading}>Lost & Found</h1>
        <p style={styles.subheading}>
          Report lost items, browse found items, and get matched instantly.
          Built with event-driven microservices on Google Cloud.
        </p>

        <div style={styles.buttons}>
          {user ? (
            <>
              <Link to="/report" style={styles.primaryBtn}>Report an Item</Link>
              <Link to="/search" style={styles.secondaryBtn}>Search Items</Link>
            </>
          ) : (
            <>
              <Link to="/signup" style={styles.primaryBtn}>Get Started</Link>
              <Link to="/login" style={styles.secondaryBtn}>Log In</Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>📋</div>
          <h3 style={styles.featureTitle}>Report</h3>
          <p style={styles.featureDesc}>Report a lost or found item with photos, location, and category</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔍</div>
          <h3 style={styles.featureTitle}>Search</h3>
          <p style={styles.featureDesc}>Filter items by type, category, location, and keywords</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🤝</div>
          <h3 style={styles.featureTitle}>Match</h3>
          <p style={styles.featureDesc}>Automatic matching engine pairs lost items with found ones</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔔</div>
          <h3 style={styles.featureTitle}>Notify</h3>
          <p style={styles.featureDesc}>Get notified via email and real-time WebSocket when matched</p>
        </div>
      </div>

      {/* Architecture */}
      <div style={styles.arch}>
        <h2 style={styles.archTitle}>Event-Driven Architecture</h2>
        <div style={styles.archFlow}>
          <span style={styles.archStep}>Item Service</span>
          <span style={styles.archArrow}>→</span>
          <span style={styles.archStep}>Event Bridge</span>
          <span style={styles.archArrow}>→</span>
          <span style={styles.archStep}>Matching Service</span>
          <span style={styles.archArrow}>→</span>
          <span style={styles.archStep}>Event Bridge</span>
          <span style={styles.archArrow}>→</span>
          <span style={styles.archStep}>Notification</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#0a0a0a', minHeight: '100vh' },
  hero: {
    textAlign: 'center', padding: '100px 20px 80px', maxWidth: '700px', margin: '0 auto'
  },
  badge: {
    display: 'inline-block', background: '#111', border: '1px solid #222',
    borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#4ade80',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginBottom: '24px'
  },
  heading: {
    fontFamily: "'DM Serif Display', serif", fontSize: '56px', color: '#f0f0f0',
    margin: '0 0 16px', lineHeight: 1.1
  },
  subheading: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#888',
    margin: '0 0 40px', lineHeight: 1.6
  },
  buttons: { display: 'flex', justifyContent: 'center', gap: '16px' },
  primaryBtn: {
    background: '#4ade80', color: '#0a0a0a', padding: '14px 32px', borderRadius: '10px',
    textDecoration: 'none', fontSize: '16px', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif"
  },
  secondaryBtn: {
    background: 'transparent', border: '1px solid #333', color: '#f0f0f0',
    padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px',
    fontFamily: "'DM Sans', sans-serif"
  },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
    maxWidth: '900px', margin: '0 auto', padding: '0 20px 80px'
  },
  feature: {
    background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px',
    padding: '32px 24px', textAlign: 'center'
  },
  featureIcon: { fontSize: '32px', marginBottom: '16px' },
  featureTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600,
    color: '#f0f0f0', margin: '0 0 8px'
  },
  featureDesc: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#666',
    margin: 0, lineHeight: 1.5
  },
  arch: {
    background: '#111', borderTop: '1px solid #1a1a1a',
    padding: '60px 20px', textAlign: 'center'
  },
  archTitle: {
    fontFamily: "'DM Serif Display', serif", fontSize: '24px', color: '#f0f0f0',
    margin: '0 0 32px'
  },
  archFlow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
    flexWrap: 'wrap'
  },
  archStep: {
    background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px',
    padding: '10px 18px', fontSize: '13px', color: '#f0f0f0',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500
  },
  archArrow: { color: '#4ade80', fontSize: '18px', fontWeight: 700 }
};

export default HomePage;
