import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
};

// User API
export const userAPI = {
  getStats: async () => {
    const response = await apiClient.get('/users/stats');
    return response.data;
  }
};

// Calculations API
export const calculationsAPI = {
  create: async (calculationData) => {
    const response = await apiClient.post('/calculations', calculationData);
    return response.data;
  },
  
  getAll: async (params = {}) => {
    const response = await apiClient.get('/calculations', { params });
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/calculations/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/calculations/${id}`);
    return response.data;
  }
};

// Profiles API
export const profilesAPI = {
  create: async (profileData) => {
    const response = await apiClient.post('/profiles', profileData);
    return response.data;
  },
  
  getByType: async (type) => {
    const response = await apiClient.get(`/profiles/${type}`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/profiles/${id}`);
    return response.data;
  }
};

export default apiClient;