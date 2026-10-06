const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    author: { type: String, default: 'Anonymous' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);
