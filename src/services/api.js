import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Items
export const createItem = (formData) => api.post('/items', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getItems = (params) => api.get('/items', { params });
export const getItem = (id) => api.get(`/items/${id}`);

// Search
export const searchItems = (params) => api.get('/search', { params });
export const getRecentItems = (params) => api.get('/search/recent', { params });
export const getStats = () => api.get('/search/stats');

// Matches
export const getMatches = (itemId) => api.get(`/match/${itemId}`);
export const getAllMatches = () => api.get('/match');

// Notifications
export const getNotifications = (userId) => api.get(`/notify/${userId}`);

export default api;
