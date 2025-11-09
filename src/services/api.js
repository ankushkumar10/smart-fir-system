// src/services/api.js
import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// FIR endpoints
const firService = {
  // Citizen endpoints
  createFIR: (firData) => api.post('/fir', firData),
  uploadEvidence: (firId, formData) => {
    return api.post(`/fir/${firId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getCitizenFIRs: () => api.get('/fir/citizen'),
  getCitizenFIRById: (firId) => api.get(`/fir/citizen/${firId}`),
  
  // Police endpoints
  getAllFIRs: (params) => api.get('/fir', { params }),
  getFIRById: (firId) => api.get(`/fir/${firId}`),
  updateFIRStatus: (firId, status) => api.patch(`/fir/${firId}/status`, { status }),
  assignFIR: (firId, officerId) => api.patch(`/fir/${firId}/assign`, { officerId }),
  addNotes: (firId, notes) => api.post(`/fir/${firId}/notes`, { notes }),
  searchFIRs: (query) => api.get(`/fir/search`, { params: { q: query } }),
  exportFIR: (firId) => api.get(`/fir/${firId}/export`, { responseType: 'blob' }),
};

// Notification endpoints
const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Analytics endpoints
const analyticsService = {
  getCrimeStatistics: (params) => api.get('/analytics/statistics', { params }),
  getHeatmapData: (params) => api.get('/analytics/heatmap', { params }),
  getCategoryDistribution: () => api.get('/analytics/categories'),
  getTimeSeriesData: (timeFrame) => api.get('/analytics/timeseries', { params: { timeFrame } }),
};

// Utility functions
const utilService = {
  // NLP categorization suggestion
  getCategorySuggestion: (description) => api.post('/utils/categorize', { description }),
  // Geocoding
  getAddressFromCoords: (lat, lng) => api.get('/utils/geocode', { params: { lat, lng } }),
  getCoordsFromAddress: (address) => api.get('/utils/geocode', { params: { address } }),
};

export {
  api as default,
  authService,
  firService,
  notificationService,
  analyticsService,
  utilService
};