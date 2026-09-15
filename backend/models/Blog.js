const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ category: 1 });

module.exports = mongoose.model('Blog', blogSchema);
