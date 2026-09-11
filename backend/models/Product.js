const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
