const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBlogs,
  getBlogBySlug,
  getCategories,
  adminGetBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/categories', getCategories);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, adminGetBlogs);
router.post('/admin', protect, createBlog);
router.put('/admin/:id', protect, updateBlog);
router.delete('/admin/:id', protect, deleteBlog);

module.exports = router;
