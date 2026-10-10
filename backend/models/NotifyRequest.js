const mongoose = require('mongoose');

const notifyRequestSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, default: '' },
    contact: { type: String, required: true, trim: true, maxlength: 120 }, // phone or email
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

notifyRequestSchema.index({ product: 1, contact: 1 });

module.exports = mongoose.model('NotifyRequest', notifyRequestSchema);
