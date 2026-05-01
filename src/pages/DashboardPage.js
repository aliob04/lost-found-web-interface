import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getItems, getStats } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([getItems(), getStats()]);
        setItems(itemsRes.data.items || []);
        setStats(statsRes.data.overview || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user?.name}</h1>
        <Link to="/report" style={styles.reportBtn}>+ Report Item</Link>
      </div>

      {/* Stats */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{stats.total_items || 0}</span>
            <span style={styles.statLabel}>Total Items</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statNum, color: '#f87171' }}>{stats.lost_items || 0}</span>
            <span style={styles.statLabel}>Lost</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statNum, color: '#4ade80' }}>{stats.found_items || 0}</span>
            <span style={styles.statLabel}>Found</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statNum, color: '#fbbf24' }}>{stats.matched_items || 0}</span>
            <span style={styles.statLabel}>Matched</span>
          </div>
        </div>
      )}

      {/* My Items */}
      <h2 style={styles.sectionTitle}>My Reported Items</h2>
      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>You haven't reported any items yet.</p>
          <Link to="/report" style={styles.emptyBtn}>Report your first item</Link>
        </div>
      ) : (
        <div style={styles.itemsGrid}>
          {items.map((item) => (
            <div key={item.id} style={styles.itemCard}>
              {item.photo_url && (
                <img src={item.photo_url} alt={item.title} style={styles.itemImage} />
              )}
              <div style={styles.itemBody}>
                <div style={styles.itemBadge(item.type)}>
                  {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                </div>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemMeta}>{item.category} · {item.location}</p>
                <p style={styles.itemStatus}>
                  Status: <span style={{ color: item.status === 'matched' ? '#4ade80' : '#888' }}>
                    {item.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  loading: {
    minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#666', fontFamily: "'DM Sans', sans-serif", fontSize: '16px'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'
  },
  title: {
    fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: '#f0f0f0', margin: 0
  },
  reportBtn: {
    background: '#4ade80', color: '#0a0a0a', padding: '10px 24px', borderRadius: '8px',
    textDecoration: 'none', fontSize: '14px', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif"
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px'
  },
  statCard: {
    background: '#111', border: '1px solid #222', borderRadius: '12px',
    padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px'
  },
  statNum: {
    fontSize: '32px', fontWeight: 700, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif"
  },
  statLabel: {
    fontSize: '13px', color: '#666', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: '#f0f0f0',
    marginBottom: '20px'
  },
  emptyState: {
    background: '#111', border: '1px solid #222', borderRadius: '12px',
    padding: '60px', textAlign: 'center'
  },
  emptyText: { color: '#666', fontSize: '15px', fontFamily: "'DM Sans', sans-serif", margin: '0 0 16px' },
  emptyBtn: {
    background: '#222', color: '#f0f0f0', padding: '10px 24px', borderRadius: '8px',
    textDecoration: 'none', fontSize: '14px', fontFamily: "'DM Sans', sans-serif"
  },
  itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  itemCard: {
    background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden'
  },
  itemImage: { width: '100%', height: '160px', objectFit: 'cover' },
  itemBody: { padding: '16px' },
  itemBadge: (type) => ({
    display: 'inline-block', fontSize: '12px', fontWeight: 600, marginBottom: '8px',
    fontFamily: "'DM Sans', sans-serif",
    color: type === 'lost' ? '#f87171' : '#4ade80'
  }),
  itemTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600,
    color: '#f0f0f0', margin: '0 0 6px'
  },
  itemMeta: { fontSize: '13px', color: '#666', fontFamily: "'DM Sans', sans-serif", margin: '0 0 4px' },
  itemStatus: { fontSize: '13px', color: '#888', fontFamily: "'DM Sans', sans-serif", margin: 0 }
};

export default DashboardPage;
