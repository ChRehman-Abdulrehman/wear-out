const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../middleware/upload');
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

// Admin: upload image for blog content
router.post('/admin/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
