import axios from 'axios';

const base = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');
const BASE = base ? `${base}/api` : '/api';
const client = axios.create({ baseURL: BASE });
const sellerClient = axios.create({ baseURL: BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('wearout_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/admin/login')) {
      localStorage.removeItem('wearout_admin_token');
      localStorage.removeItem('wearout_admin_email');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

sellerClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wearout_seller_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

sellerClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/seller') && !window.location.pathname.includes('/seller/login')) {
      localStorage.removeItem('wearout_seller_token');
      window.location.href = '/seller/login';
    }
    return Promise.reject(err);
  }
);

export const api = {
  // public config
  getConfig: () => client.get('/admin/config').then((r) => r.data),

  // products
  getProducts: (params = {}) => client.get('/products', { params }).then((r) => r.data),
  getProduct: (id) => client.get(`/products/${id}`).then((r) => r.data),

  // orders
  createOrder: (payload) => client.post('/orders', payload).then((r) => r.data),

  // reviews
  submitReview: (payload) => client.post('/reviews', payload).then((r) => r.data),
  getApprovedReviews: (productId) => client.get(`/reviews/product/${productId}`).then((r) => r.data),
  getProductRating: (productId) => client.get(`/reviews/product/${productId}/rating`).then((r) => r.data),

  // admin auth
  login: (email, password) => client.post('/admin/login', { email, password }).then((r) => r.data),
  me: () => client.get('/admin/me').then((r) => r.data),

  // admin products
  createProduct: (formData) =>
    client.post('/products', formData).then((r) => r.data),
  updateProduct: (id, formData) =>
    client.put(`/products/${id}`, formData).then((r) => r.data),
  deleteProduct: (id) => client.delete(`/products/${id}`).then((r) => r.data),

  // admin orders
  getOrders: (params = {}) => client.get('/orders', { params }).then((r) => r.data),
  updateOrderStatus: (id, status, courier) =>
    client.put(`/orders/${id}/status`, { status, courier }).then((r) => r.data),

  // admin reviews
  getPendingReviews: () => client.get('/reviews/pending').then((r) => r.data),
  setReviewStatus: (id, status) => client.put(`/reviews/${id}/status`, { status }).then((r) => r.data),
  deleteReview: (id) => client.delete(`/reviews/${id}`).then((r) => r.data),

  // analytics
  getDashboard: (month, year) => client.get('/analytics/dashboard', { params: { month, year } }).then((r) => r.data),
  getCustomers: () => client.get('/analytics/customers').then((r) => r.data),
  getLogistics: (month, year) => client.get('/analytics/logistics', { params: { month, year } }).then((r) => r.data),

  // courier
  getCouriers: () => client.get('/courier/couriers').then((r) => r.data),
  toggleCourier: (id) => client.post(`/courier/couriers/${id}/toggle`).then((r) => r.data),
  getOptimizer: () => client.get('/courier/optimizer').then((r) => r.data),

  // admin shopkeepers
  getShopkeepers: () => client.get('/admin/shopkeepers').then((r) => r.data),
  getPendingShopkeepers: () => client.get('/admin/shopkeepers/pending').then((r) => r.data),
  updateShopkeeperStatus: (id, status) => client.put(`/admin/shopkeepers/${id}/status`, { status }).then((r) => r.data),

  // admin featured requests
  getFeaturedRequests: () => client.get('/admin/featured-requests').then((r) => r.data),
  approveFeatured: (id) => client.put(`/admin/featured-requests/${id}/approve`).then((r) => r.data),
  rejectFeatured: (id) => client.put(`/admin/featured-requests/${id}/reject`).then((r) => r.data),

  // seller auth
  sellerSignup: (data) => client.post('/seller/signup', data).then((r) => r.data),
  sellerLogin: (email, password) => client.post('/seller/login', { email, password }).then((r) => r.data),
  sellerGetProfile: (token) => sellerClient.get('/seller/me', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),

  // seller products
  sellerGetProducts: (token) => sellerClient.get('/seller/products', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerCreateProduct: (token, formData) =>
    sellerClient.post('/seller/products', formData, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerUpdateProduct: (token, id, formData) =>
    sellerClient.put(`/seller/products/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerDeleteProduct: (token, id) => sellerClient.delete(`/seller/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerRequestFeatured: (token, id) => sellerClient.put(`/seller/products/${id}/request-featured`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),

  // seller orders
  sellerGetOrders: (token) => sellerClient.get('/seller/orders', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerUpdateOrderStatus: (token, id, status) =>
    sellerClient.put(`/seller/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),

  // seller analytics
  sellerGetDashboard: (token) => sellerClient.get('/seller/analytics', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  sellerGetCustomers: (token) => sellerClient.get('/seller/customers', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),

  // blog (public)
  getBlogs: (params = {}) => client.get('/blog', { params }).then((r) => r.data),
  getBlogBySlug: (slug) => client.get(`/blog/${slug}`).then((r) => r.data),
  getBlogCategories: () => client.get('/blog/categories').then((r) => r.data),

  // blog (admin)
  adminGetBlogs: () => client.get('/blog/admin/all').then((r) => r.data),
  adminCreateBlog: (data) => client.post('/blog/admin', data).then((r) => r.data),
  adminUpdateBlog: (id, data) => client.put(`/blog/admin/${id}`, data).then((r) => r.data),
  adminDeleteBlog: (id) => client.delete(`/blog/admin/${id}`).then((r) => r.data),
};

export default api;
