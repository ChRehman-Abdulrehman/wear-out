const mongoose = require('mongoose');

const RETURN_STATUSES = ['Pending', 'Approved', 'Rejected', 'Done'];
const RETURN_TYPES = ['Return', 'Exchange'];

const returnRequestSchema = new mongoose.Schema(
  {
    orderReference: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: RETURN_TYPES, default: 'Return' },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    customer: {
      fullName: { type: String, required: true, trim: true, maxlength: 100 },
      whatsapp: { type: String, required: true, trim: true, maxlength: 20 },
    },
    status: { type: String, enum: RETURN_STATUSES, default: 'Pending' },
    adminNote: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

returnRequestSchema.index({ orderReference: 1 });
returnRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
module.exports.RETURN_STATUSES = RETURN_STATUSES;
module.exports.RETURN_TYPES = RETURN_TYPES;
