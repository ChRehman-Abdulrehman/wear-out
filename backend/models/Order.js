const mongoose = require('mongoose');

// The 5 order statuses used in the admin orders table.
// For the 4-category analytics/logistics breakdown we map:
//   Completed -> Completed
//   Order Placed + On Delivery -> On Delivery / In Transit
//   Returned  -> Returned
//   Cancelled -> Cancelled / Failed
const STATUS = ['Order Placed', 'On Delivery', 'Completed', 'Returned', 'Cancelled'];

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  shoePhone: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      age: { type: Number, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      whatsapp: { type: String, required: true },
      email: { type: String, required: true },
      gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    status: { type: String, enum: STATUS, default: 'Order Placed' },
    courier: { type: String, default: '' },
    deliveredAt: { type: Date },
    // unique token so a customer could later look up (future use)
    reference: { type: String, unique: true },
  },
  { timestamps: true }
);

orderSchema.index({ 'customer.whatsapp': 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Order', orderSchema);
module.exports.STATUS = STATUS;
