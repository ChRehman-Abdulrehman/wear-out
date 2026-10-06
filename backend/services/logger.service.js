const winston = require('winston');
const mongoose = require('mongoose');

// Configure Winston logger for production-grade logging
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'wearout-backend' },
  transports: [
    // Write to combined log file
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 10 * 1024 * 1024, maxFiles: 5 }),
    // Write to error-specific file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 10 * 1024 * 1024, maxFiles: 5 })
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const correlationId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  req.correlationId = correlationId;
  req.logger = logger.child({ correlationId, path: req.path, method: req.method });

  req.logger.info('🟢 Request started');

  res.on('finish', () => {
    const duration = Date.now() - start;
    req.logger.info(
      `🔴 Request finished: ${req.method} ${req.path} -> ${res.statusCode} in ${duration}ms`
    );
  });

  next();
};

// Global error logger
const errorLogger = (err, req, res, next) => {
  const correlationId = req.correlationId || 'unknown';
  logger.error({
    error: err.message,
    stack: err.stack,
    correlationId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
  });
  next(err);
};

// Mongoose connection logger
const mongooseLogger = {
  connection: {
    open: () => logger.info('🟢 Mongoose connection opened'),
    close: () => logger.warn('⚠️ Mongoose connection closed'),
    error: (err) => logger.error('❌ Mongoose connection error:', err),
  },
};

// Export all logging utilities
module.exports = {
  logger,
  requestLogger,
  errorLogger,
  mongooseLogger,
};

// Safe JSON response helper for controllers
module.exports.safeResponse = (res, dataOrMessage, statusCode = 200) => {
  if (dataOrMessage && typeof dataOrMessage === 'object') {
    return res.status(statusCode).json({
      success: true,
      data: dataOrMessage,
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(statusCode).json({
    success: true,
    message: dataOrMessage,
    timestamp: new Date().toISOString(),
  });
};

// Async wrapper to prevent unhandled promise rejections
module.exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

// Memory pressure handler
const memoryMonitor = () => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);

  if (heapUsedMB > 400) { // 400MB warning
    logger.warn(`⚠️ High memory usage: ${heapUsedMB}MB of ${heapTotalMB}MB`);
    // Force GC if available
    if (global.gc) global.gc();
  }
};

// Check every 5 minutes
setInterval(memoryMonitor, 300000);

module.exports.memoryMonitor = memoryMonitor;