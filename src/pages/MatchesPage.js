import React, { useState, useEffect } from 'react';
import { getAllMatches } from '../services/api';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getAllMatches();
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <div style={styles.loading}>Loading matches...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Matches</h1>
      <p style={styles.subtitle}>Items that have been matched together</p>

      {matches.length === 0 ? (
        <div style={styles.emptyState}>No matches found yet. Matches appear when a lost and found item are paired.</div>
      ) : (
        <div style={styles.list}>
          {matches.map((match) => (
            <div key={match.id} style={styles.matchCard}>
              <div style={styles.matchHeader}>
                <span style={styles.scoreTag}>{match.score}% match</span>
                <span style={styles.statusTag(match.status)}>{match.status}</span>
              </div>

              <div style={styles.matchBody}>
                <div style={styles.matchSide}>
                  <span style={styles.sideLabel}>🔴 Lost</span>
                  <h3 style={styles.sideTitle}>{match.lost_title}</h3>
                </div>
                <div style={styles.matchArrow}>⟷</div>
                <div style={styles.matchSide}>
                  <span style={styles.sideLabel}>🟢 Found</span>
                  <h3 style={styles.sideTitle}>{match.found_title}</h3>
                </div>
              </div>

              <div style={styles.matchFooter}>
                Matched on {new Date(match.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  loading: {
    minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#666', fontFamily: "'DM Sans', sans-serif"
  },
  title: {
    fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: '#f0f0f0',
    margin: '0 0 8px'
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#666', margin: '0 0 32px'
  },
  emptyState: {
    background: '#111', border: '1px solid #222', borderRadius: '12px',
    padding: '60px', textAlign: 'center', color: '#666', fontFamily: "'DM Sans', sans-serif"
  },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  matchCard: {
    background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden'
  },
  matchHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #1a1a1a'
  },
  scoreTag: {
    background: '#0d2818', color: '#4ade80', padding: '4px 12px', borderRadius: '20px',
    fontSize: '13px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
  },
  statusTag: (status) => ({
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize',
    background: status === 'confirmed' ? '#0d2818' : status === 'rejected' ? '#2d1215' : '#1a1a0d',
    color: status === 'confirmed' ? '#4ade80' : status === 'rejected' ? '#f87171' : '#fbbf24'
  }),
  matchBody: {
    display: 'flex', alignItems: 'center', padding: '20px', gap: '16px'
  },
  matchSide: { flex: 1 },
  sideLabel: { fontSize: '12px', fontFamily: "'DM Sans', sans-serif", color: '#888' },
  sideTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600,
    color: '#f0f0f0', margin: '4px 0 0'
  },
  matchArrow: {
    fontSize: '20px', color: '#333', fontWeight: 700
  },
  matchFooter: {
    padding: '12px 20px', borderTop: '1px solid #1a1a1a', fontSize: '12px',
    color: '#555', fontFamily: "'DM Sans', sans-serif"
  }
};

export default MatchesPage;
