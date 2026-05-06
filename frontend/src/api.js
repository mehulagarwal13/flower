import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register') || requestUrl.includes('/admin/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      const storedUser = localStorage.getItem('user');
      let redirectPath = '/login';

      try {
        if (storedUser && JSON.parse(storedUser)?.is_admin) {
          redirectPath = '/admin';
        }
      } catch {
        redirectPath = '/login';
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = redirectPath;
    }
    return Promise.reject(error);
  }
);

// ── Authentication APIs ──────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getMe: () => api.get('/admin/me'),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (orderId, status) => api.patch(`/admin/orders/${orderId}/status`, { status }),
  deleteOrder: (orderId) => api.delete(`/admin/orders/${orderId}`),
  getOrderFiles: (orderId) => api.get(`/admin/order/${orderId}/files`),
};

// ── Product APIs ─────────────────────────────────────────────────

export const productAPI = {
  getAll: (category) => api.get('/products', { params: { category } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.patch(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
};

// ── Order APIs ───────────────────────────────────────────────────

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  track: (orderIdOrPhone) => api.get(`/orders/track/${orderIdOrPhone}`),
  getAll: () => api.get('/admin/orders'),
  updateStatus: (orderId, status) => api.patch(`/admin/orders/${orderId}/status`, { status }),
  delete: (orderId) => api.delete(`/admin/orders/${orderId}`),
};

// ── File Upload APIs ─────────────────────────────────────────────

export const uploadAPI = {
  uploadForOrder: (orderId, file, fileType = 'photo') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    return api.post(`/upload/order/${orderId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadTemp: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/temp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getOrderFiles: (orderId) => api.get(`/admin/order/${orderId}/files`),
};

// ── Payment APIs (Razorpay) ──────────────────────────────────────

export const paymentAPI = {
  createRazorpayOrder: (data) => api.post('/payment/razorpay/order', data),
  verifyPayment: (data) => api.post('/payment/razorpay/verify', data),
};

export default api;
