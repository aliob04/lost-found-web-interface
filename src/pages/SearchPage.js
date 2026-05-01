import React, { useState } from 'react';
import { searchItems } from '../services/api';

const SearchPage = () => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const categories = ['Wallet', 'Phone', 'Keys', 'Bag', 'Laptop', 'Watch', 'Glasses', 'ID Card', 'Other'];

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = { page, limit: 12 };
      if (type) params.type = type;
      if (category) params.category = category;
      if (location) params.location = location;
      if (keyword) params.keyword = keyword;

      const res = await searchItems(params);
      setResults(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Search Items</h1>

      {/* Filters */}
      <div style={styles.filters}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
          style={styles.input} placeholder="Location..." />

        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
          style={styles.input} placeholder="Keyword..." />

        <button onClick={() => handleSearch(1)} style={styles.searchBtn}>
          Search
        </button>
      </div>

      {/* Results */}
      {loading && <p style={styles.loadingText}>Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <div style={styles.emptyState}>No items found matching your criteria.</div>
      )}

      {results.length > 0 && (
        <>
          <p style={styles.resultCount}>{pagination?.totalItems || results.length} items found</p>
          <div style={styles.grid}>
            {results.map((item) => (
              <div key={item.id} style={styles.card}>
                {item.photo_url && (
                  <img src={item.photo_url} alt={item.title} style={styles.cardImage} />
                )}
                <div style={styles.cardBody}>
                  <span style={styles.badge(item.type)}>
                    {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                  </span>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardMeta}>{item.category} · {item.location}</p>
                  <p style={styles.cardDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  {item.description && (
                    <p style={styles.cardDesc}>
                      {item.description.length > 80 ? item.description.slice(0, 80) + '...' : item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button key={i + 1}
                  onClick={() => handleSearch(i + 1)}
                  style={pagination.currentPage === i + 1 ? styles.pageActive : styles.pageBtn}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  title: {
    fontFamily: "'DM Serif Display', serif", fontSize: '32px', color: '#f0f0f0',
    margin: '0 0 24px'
  },
  filters: {
    display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap'
  },
  select: {
    background: '#111', border: '1px solid #333', borderRadius: '8px',
    padding: '10px 14px', color: '#f0f0f0', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", outline: 'none', minWidth: '140px'
  },
  input: {
    background: '#111', border: '1px solid #333', borderRadius: '8px',
    padding: '10px 14px', color: '#f0f0f0', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", outline: 'none', flex: 1, minWidth: '140px'
  },
  searchBtn: {
    background: '#4ade80', color: '#0a0a0a', border: 'none', borderRadius: '8px',
    padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif"
  },
  loadingText: { color: '#666', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' },
  emptyState: {
    background: '#111', border: '1px solid #222', borderRadius: '12px',
    padding: '60px', textAlign: 'center', color: '#666', fontFamily: "'DM Sans', sans-serif"
  },
  resultCount: {
    color: '#888', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", marginBottom: '16px'
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'
  },
  card: {
    background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden'
  },
  cardImage: { width: '100%', height: '160px', objectFit: 'cover' },
  cardBody: { padding: '16px' },
  badge: (type) => ({
    display: 'inline-block', fontSize: '12px', fontWeight: 600, marginBottom: '8px',
    fontFamily: "'DM Sans', sans-serif",
    color: type === 'lost' ? '#f87171' : '#4ade80'
  }),
  cardTitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600,
    color: '#f0f0f0', margin: '0 0 6px'
  },
  cardMeta: { fontSize: '13px', color: '#666', fontFamily: "'DM Sans', sans-serif", margin: '0 0 4px' },
  cardDate: { fontSize: '12px', color: '#555', fontFamily: "'DM Sans', sans-serif", margin: '0 0 8px' },
  cardDesc: { fontSize: '13px', color: '#888', fontFamily: "'DM Sans', sans-serif", margin: 0 },
  pagination: {
    display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px'
  },
  pageBtn: {
    background: '#111', border: '1px solid #333', borderRadius: '6px',
    padding: '8px 14px', color: '#888', cursor: 'pointer', fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif"
  },
  pageActive: {
    background: '#4ade80', border: '1px solid #4ade80', borderRadius: '6px',
    padding: '8px 14px', color: '#0a0a0a', cursor: 'pointer', fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600
  }
};

export default SearchPage;
