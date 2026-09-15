const Blog = require('../models/Blog');

// Public: get all published posts
exports.getBlogs = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 20 } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-content'),
      Blog.countDocuments(filter),
    ]);
    res.json({ blogs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Public: get single post by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Public: get categories
exports.getCategories = async (req, res) => {
  try {
    const cats = await Blog.distinct('category', { published: true });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get all posts (including drafts)
exports.adminGetBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create post
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, category, tags, published } = req.body;
    let finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await Blog.findOne({ slug: finalSlug });
    if (exists) return res.status(400).json({ message: 'Slug already exists' });
    const blog = new Blog({
      title,
      slug: finalSlug,
      excerpt,
      content,
      image: image || '',
      category: category || 'General',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags) : [],
      published: published === true || published === 'true',
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: update post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    const { title, slug, excerpt, content, image, category, tags, published } = req.body;
    if (title !== undefined) blog.title = title;
    if (slug !== undefined) blog.slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (image !== undefined) blog.image = image;
    if (category !== undefined) blog.category = category;
    if (tags !== undefined) blog.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags;
    if (published !== undefined) blog.published = published === true || published === 'true';
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: delete post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
