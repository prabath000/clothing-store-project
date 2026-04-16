import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Vercel Production URL - replace with your actual Vercel URL after deploying
const VERCEL_URL = 'https://YOUR-PROJECT-NAME.vercel.app/api';

// Use Vercel URL always (works on physical device without PC server)
const BASE_URL = VERCEL_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor to add JWT Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 [${config.method.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for better error logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.config.method.toUpperCase()}] ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.log(`❌ [${error.config?.method.toUpperCase()}] ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    if (error.response?.data) {
      console.log('Error Data:', JSON.stringify(error.response.data));
    }
    return Promise.reject(error);
  }
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
  create: (data, config = {}) => api.post('/products', data, config),
  update: (id, data, config = {}) => api.put(`/products/${id}`, data, config),
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
  removeUser: (id) => api.delete(`/admin/users/${id}`),
  getOrders: () => api.get('/admin/orders'),
  getReviews: () => api.get('/admin/reviews'),
  removeReview: (id) => api.delete(`/admin/reviews/${id}`),
};

// Payment Endpoints
export const paymentAPI = {
  create: (data) => api.post('/payments/create', data),
  get: (userId) => api.get(`/payments/${userId}`),
};

export default api;
