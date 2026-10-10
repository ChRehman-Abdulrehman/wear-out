const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 30 },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: { type: Number, required: true, min: 0 }, // percent: 0-100, fixed: Rs off
    minOrder: { type: Number, default: 0, min: 0 }, // minimum subtotal to qualify
    maxDiscount: { type: Number, default: 0, min: 0 }, // cap for percent coupons (0 = no cap)
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    usageLimit: { type: Number, default: 0, min: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '', trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1, active: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
