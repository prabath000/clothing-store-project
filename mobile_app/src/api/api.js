import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
const PRODUCTION_URL = 'https://clothing-store-api-xxxx.onrender.com/api'; // Replace with your actual Render URL
const DEVELOPMENT_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5000/api' 
  : 'http://localhost:5000/api';

const BASE_URL = __DEV__ ? DEVELOPMENT_URL : PRODUCTION_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Product Endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

// Cart Endpoints
export const cartAPI = {
  get: (userId) => api.get(`/cart/${userId}`),
  add: (data) => api.post('/cart/add', data),
  update: (id, data) => api.put(`/cart/update/${id}`, data),
  remove: (id) => api.delete(`/cart/remove/${id}`),
};

// Order Endpoints
export const orderAPI = {
  create: (data) => api.post('/orders/create', data),
  getMyOrders: (userId) => api.get(`/orders/${userId}`),
  getById: (id) => api.get(`/orders/order/${id}`),
  updateStatus: (id, data) => api.put(`/orders/update/${id}`, data),
};

// Wishlist Endpoints
export const wishlistAPI = {
  get: (userId) => api.get(`/wishlist/${userId}`),
  add: (data) => api.post('/wishlist/add', data),
  remove: (id) => api.delete(`/wishlist/remove/${id}`),
};

// Review Endpoints
export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
  add: (data) => api.post('/reviews/add', data),
  update: (id, data) => api.put(`/reviews/update/${id}`, data),
  remove: (id) => api.delete(`/reviews/delete/${id}`),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getOrders: () => api.get('/admin/orders'),
  getReviews: () => api.get('/admin/reviews'),
};

// Payment Endpoints
export const paymentAPI = {
  create: (data) => api.post('/payments/create', data),
  get: (userId) => api.get(`/payments/${userId}`),
};

export default api;
