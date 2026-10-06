const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0, max: 100000 },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'At least one size is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Shirts', 'Trousers', 'Caps', 'Watches', 'Accessories', 'Shoes', 'Un Stitch'],
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    gender: { type: String, enum: ['Male', 'Female', 'Unisex'], default: 'Unisex' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    featuredPending: { type: Boolean, default: false },
    shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper', default: null },
    shopName: { type: String, default: '' },
    // Performance fields for caching
    cacheVersion: { type: Number, default: 0 }, // Increment on changes to invalidate cache
    updatedAtTS: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Composite indexes for most common query patterns
productSchema.index({ category: 1, gender: 1, featured: 1, status: 1, createdAt: -1 });
productSchema.index({ shopkeeper: 1, status: 1, featured: 1 });

// Text search index (single text index — MongoDB allows one per collection)
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for safe JSON output (exclude internal fields)
productSchema.virtual('safeImage').get(function () {
  return this.image || this.images?.[0] || '';
});

// Method to increment cache version (for cache invalidation)
productSchema.methods.incrementCacheVersion = function () {
  this.cacheVersion = (this.cacheVersion || 0) + 1;
  return this.cacheVersion;
};

// Static method for featured products with caching support
productSchema.statics.getFeaturedProducts = async function (limit = 20, cacheKey = 'featured') {
  // This can be wrapped with Redis cache in controller
  return this.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean(); // lean() = no Mongoose docs, faster for read-only
};

// Static method for search with filters
productSchema.statics.searchProducts = async function (filters = {}) {
  const { category, gender, priceMin, priceMax, search, page = 1, limit = 50 } = filters;
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) filter.category = category;
  if (gender) filter.gender = gender;
  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) filter.price.$gte = priceMin;
    if (priceMax !== undefined) filter.price.$lte = priceMax;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const [products, total] = await Promise.all([
    this.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    this.countDocuments(filter),
  ]);

  return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

module.exports = mongoose.model('Product', productSchema);