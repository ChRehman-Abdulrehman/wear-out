require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const Sentry = require('@sentry/node');

const { connectDB } = require('./config/db');
const { ensureAdminExists } = require('./controllers/adminController');
const Courier = require('./models/Courier');

const app = express();

// Initialize Sentry if DSN provided
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
}

// Apply request logger BEFORE routes
const requestLogger = require('./services/logger.service').requestLogger;
app.use(requestLogger);

// Trust first proxy (needed for correct client IP behind load balancer / rate limiting)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['https://wearout.shop', 'https://www.wearout.shop'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  })
);

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Local uploads directory (fallback for non-Cloudinary images)
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courier', require('./routes/courier'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/seller', require('./routes/shopkeepers'));
app.use('/api/seller', require('./routes/sellers'));
app.use('/api/admin', require('./routes/adminShopkeepers'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/orders', require('./routes/track'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/settings', require('./routes/settings'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = global.getConnectionStatus || 'unknown';
    res.json({ ok: true, db: dbStatus });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Health check failed' });
  }
});

// Sentry error handler - must be after routes
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global error logger
const errorLogger = require('./services/logger.service').errorLogger;

// Global error handler (AFTER routes and Sentry)
app.use(errorLogger);

// Fallback error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode >= 500 ? 'Internal server error' : err.message || 'Unknown error';

  // Stack traces ONLY in explicit development — never leak otherwise
const errorDetails = process.env.NODE_ENV === 'development' ? {
    error: err.message,
    stack: err.stack,
  } : {};

  res.status(statusCode).json({
    success: false,
    error: message,
    ...errorDetails,
    timestamp: new Date().toISOString(),
  });
});

// Seed default couriers
async function seedCouriers() {
  try {
    const defaults = [
      { name: 'TCS', rating: 4.2 },
      { name: 'Leopard Courier', rating: 4.0 },
      { name: 'M&P', rating: 4.4 },
    ];
    for (const c of defaults) {
      await Courier.updateOne({ name: c.name }, { $setOnInsert: { name: c.name, rating: c.rating } }, { upsert: true });
    }
    console.log('📦 Default couriers seeded/verified');
  } catch (err) {
    // Use console.error since logger may not be fully initialized
    console.error('❌ Error seeding couriers:', err.message);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await seedCouriers();
    try { await ensureAdminExists(); } catch (e) { console.error('⚠️ ensureAdminExists:', e.message); }
    app.listen(PORT, () => {
      const memory = process.memoryUsage();
      console.log(`🚀 Wear Out API running on port ${PORT}`);
      console.log(`💾 Memory: ${Math.round(memory.heapUsed / 1024 / 1024)}MB heap used`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Application does not crash by default
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  // Exit with failure code
  process.exit(1);
});

module.exports = app;