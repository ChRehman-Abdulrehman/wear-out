const mongoose = require('mongoose');

// Status array for validation
const STATUS = ['Order Placed', 'On Delivery', 'Completed', 'Return code', 'Cancelled'];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    image: { type: String, default: '' },
    shoeSize: { type: String, default: '' },
  },
  { _id: false }
);

// Optimized order schema with better indexing
const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true, trim: true, maxlength: 100 },
      age: { type: Number, required: true, min: 1, max: 120 },
      city: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      whatsapp: { type: String, required: true, match: /^\+?[0-9]{7,15}$/ },
      email: { type: String, required: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: STATUS, default: 'Order Placed' },
    courier: { type: String, default: '', trim: true },
    deliveredAt: { type: Date },
    reference: { type: String, unique: true, sparse: true, lowercase: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Composite indexes for common admin/seller queries
orderSchema.index({ shopkeeper: 1, status: 1, createdAt: -1 });
orderSchema.index({ 'customer.whatsapp': 1, createdAt: -1 });
orderSchema.index({ 'customer.email': 1, createdAt: -1 });
orderSchema.index({ reference: 1 });

// Virtual for item count
orderSchema.virtual('itemCount').get(function () {
  if (!this.items) return 0;
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Virtual for total items types
orderSchema.virtual('uniqueProductCount').get(function () {
  if (!this.items) return 0;
  const unique = new Set(this.items.map((item) => item.product.toString()));
  return unique.size;
});

// Pre-save hook to generate reference if not provided
orderSchema.pre('save', async function (next) {
  if (!this.reference) {
    const generateRef = () => 'WO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    let ref = generateRef();
    const exists = await mongoose.model('Order').findOne({ reference: ref });
    if (exists) ref = generateRef() + '-' + Date.now().toString(36).slice(-3).toUpperCase();
    this.reference = ref;
  }
  next();
});

// Static method for seller orders filtered by their products
orderSchema.statics.getSellerOrders = async function (shopkeeperId, filters = {}) {
  const myProducts = await mongoose.model('Product').find({ shopkeeper: shopkeeperId }).select('_id');
  const myProductIds = myProducts.map((p) => p._id);

  const filter = { 'items.product': { $in: myProductIds } };
  Object.assign(filter, filters);

  return this.find(filter)
    .sort({ createdAt: -1 })
    .lean();
};

// Static method for status analytics
orderSchema.statics.getStatusAnalytics = async function (shopkeeperId = null) {
  const match = {};
  if (shopkeeperId) {
    const myProducts = await mongoose.model('Product').find({ shopkeeper: shopkeeperId }).select('_id');
    const myProductIds = myProducts.map((p) => p._id);
    match['items.product'] = { $in: myProductIds };
  }

  return this.aggregate([
    { match },
    {
      $group: {
        _status: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
module.exports.STATUS = STATUS;