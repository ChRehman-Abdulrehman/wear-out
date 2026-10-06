const sanitizeHtml = require('sanitize-html');
const Review = require('../models/Review');
const Order = require('../models/Order');

const clean = (str) => sanitizeHtml(str || '', { allowedTags: [], allowedAttributes: {} });

exports.submitReview = async (req, res) => {
  try {
    const { product, rating, comment, author, reference, email } = req.body;

    // Optional purchase verification: if order reference given, verify it contains this product
    let verified = false;
    if (reference && String(reference).trim()) {
      const order = await Order.findOne({ reference: String(reference).trim().toUpperCase() });
      if (order && order.items.some((it) => it.product.toString() === product)) {
        if (!email || order.customer.email.toLowerCase() === String(email).toLowerCase()) {
          verified = true;
        }
      }
      if (!verified) {
        return res.status(400).json({ message: 'Order reference could not be verified for this product' });
      }
    }

    const review = new Review({
      product,
      rating: Number(rating),
      comment: clean(comment),
      author: clean(author) || 'Anonymous',
      status: 'Pending',
      verified,
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted and awaiting approval', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'Approved' }).sort({
      createdAt: -1,
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductRating = async (req, res) => {
  try {
    const agg = await Review.aggregate([
      { $match: { product: new (require('mongoose').Types.ObjectId)(req.params.productId), status: 'Approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json(agg[0] || { avg: 0, count: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Pending' }).populate('product', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setReviewStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' | 'Rejected'
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
