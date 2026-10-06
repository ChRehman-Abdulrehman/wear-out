const rateLimit = require('rate-limiter-flexible');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Order creation: 10 requests per minute per IP
const orderLimiter = rateLimit.rateLimiter({
  keyPrefix: 'order',
  points: 10,
  duration: 60,
});

// Review submission: 5 requests per minute per IP
const reviewLimiter = rateLimit.rateLimiter({
  keyPrefix: 'review',
  points: 5,
  duration: 60,
});

// Admin login: 5 attempts per 15 minutes per IP
const adminLoginLimiter = rateLimit.rateLimiter({
  keyPrefix: 'admin-login',
  points: 5,
  duration: 900,
});

// Seller login: 5 attempts per 15 minutes per IP
const sellerLoginLimiter = rateLimit.rateLimiter({
  keyPrefix: 'seller-login',
  points: 5,
  duration: 900,
});

// Express middleware wrappers for order limiting
exports.orderLimit = (req, res, next) => {
  rateLimit(orderLimiter, req, res, next).catch(() => {
    res.status(429).json({ message: 'Too many order attempts, please try again later.' });
  });
};

// Express middleware wrappers for review limiting
exports.reviewLimit = (req, res, next) => {
  rateLimit(reviewLimiter, req, res, next).catch(() => {
    res.status(429).json({ message: 'Too many review attempts, please try again later.' });
  });
};

// Express middleware wrappers for admin login limiting
exports.adminLoginLimit = (req, res, next) => {
  rateLimit(adminLoginLimiter, req, res, next).catch(() => {
    res.status(429).json({ message: 'Too many login attempts, please try again later.' });
  });
};

// Express middleware wrappers for seller login limiting
exports.sellerLoginLimit = (req, res, next) => {
  rateLimit(sellerLoginLimiter, req, res, next).catch(() => {
    res.status(429).json({ message: 'Too many login attempts, please try again later.' });
  });
};