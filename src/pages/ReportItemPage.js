import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';

const ReportItemPage = () => {
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Wallet', 'Phone', 'Keys', 'Bag', 'Laptop', 'Watch', 'Glasses', 'ID Card', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      if (date) formData.append('date', date);
      if (photo) formData.append('photo', photo);

      await createItem(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Report an Item</h1>
        <p style={styles.subtitle}>Help reunite lost items with their owners</p>

        {error && <div style={styles.error}>{error}</div>}

        {/* Type Toggle */}
        <div style={styles.toggleContainer}>
          <button onClick={() => setType('lost')}
            style={type === 'lost' ? styles.toggleActive('lost') : styles.toggle}>
            🔴 I Lost Something
          </button>
          <button onClick={() => setType('found')}
            style={type === 'found' ? styles.toggleActive('found') : styles.toggle}>
            🟢 I Found Something
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              style={styles.input} placeholder="e.g. Black leather wallet" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              style={styles.input} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              style={styles.input} placeholder="e.g. KFUPM Building 22" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Describe the item in detail..." />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
              style={styles.fileInput} />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Submitting...' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    background: '#0a0a0a', padding: '40px 20px'
  },
  card: {
    background: '#111', border: '1px solid #222', borderRadius: '16px',
    padding: '48px', width: '100%', maxWidth: '520px'
  },
  title: {
    fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: '#f0f0f0',
    margin: '0 0 8px'
  },
  subtitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#666', margin: '0 0 24px'
  },
  error: {
    background: '#2d1215', border: '1px solid #5c2b2e', color: '#f87171',
    padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
    fontFamily: "'DM Sans', sans-serif"
  },
  toggleContainer: { display: 'flex', gap: '12px', marginBottom: '24px' },
  toggle: {
    flex: 1, padding: '12px', background: '#0a0a0a', border: '1px solid #333',
    borderRadius: '8px', color: '#888', cursor: 'pointer', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500
  },
  toggleActive: (type) => ({
    flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    background: type === 'lost' ? '#2d1215' : '#0d2818',
    border: `1px solid ${type === 'lost' ? '#5c2b2e' : '#1a5c32'}`,
    color: type === 'lost' ? '#f87171' : '#4ade80'
  }),
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
  fileInput: {
    background: '#0a0a0a', border: '1px solid #333', borderRadius: '8px',
    padding: '12px', color: '#888', fontSize: '13px', fontFamily: "'DM Sans', sans-serif"
  },
  button: {
    background: '#4ade80', color: '#0a0a0a', border: 'none', borderRadius: '8px',
    padding: '14px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", marginTop: '8px'
  }
};

export default ReportItemPage;
