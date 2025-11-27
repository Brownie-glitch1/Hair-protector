import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Hair Profile APIs
export const hairProfileAPI = {
  create: (data) => api.post('/hair-profiles', data),
  get: () => api.get('/hair-profiles'),
  update: (data) => api.put('/hair-profiles', data),
  delete: () => api.delete('/hair-profiles'),
};

// Scan APIs
export const scanAPI = {
  scanByIngredients: (data) => api.post('/scans/ingredients', data),
  scanByBarcode: (data) => api.post('/scans/barcode', data),
  scanByImage: (formData) => 
    api.post('/scans/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: (params) => api.get('/scans/history', { params }),
  getScan: (scanId) => api.get(`/scans/${scanId}`),
  deleteScan: (scanId) => api.delete(`/scans/${scanId}`),
};

// Product APIs
export const productAPI = {
  create: (data) => api.post('/products', data),
  search: (query) => api.get('/products/search', { params: { q: query } }),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  get: (productId) => api.get(`/products/${productId}`),
};

// Ingredient APIs
export const ingredientAPI = {
  search: (query) => api.get('/ingredients/search', { params: { q: query } }),
  get: (name) => api.get(`/ingredients/${name}`),
  list: (category) => 
    api.get('/ingredients', category ? { params: { category } } : {}),
};

export default api;