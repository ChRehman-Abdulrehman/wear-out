const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    provider: {
      type: String,
      enum: ['stripe'],
      default: 'stripe',
    },
    providerPaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    rawWebhookPayload: {
      type: Object,
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for quick lookup by provider payment ID
paymentSchema.index({ providerPaymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);