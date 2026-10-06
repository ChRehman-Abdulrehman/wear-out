const mongoose = require('mongoose');

let dbConnection = null;

// Connection options for maximum stability and performance
const mongoOptions = {
  maxPoolSize: 50,        // Maintain up to 50 socket connections
  minPoolSize: 10,        // Keep minimum 10 connections open
  connectTimeoutMS: 30000, // 30s connect timeout
  socketTimeoutMS: 45000, // 45s socket inactivity timeout
  family: 4,              // Use IPv4 (avovert IPv6 issues on some hosts)
  heartbeatFrequencyMS: 10000, // Keep connections alive
  retryWrites: true,
  w: 'majority',          // Write concern for data safety
  writeConcern: { w: 'majority', wtimeoutMS: 10000 },
};

// Enhanced connectDB with error handling and monitoring
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wearout';

    const conn = await mongoose.connect(uri, mongoOptions);

    // Track connection status
    dbConnection = conn;

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Pool size: max=${conn.options.maxPoolSize}, min=${conn.options.minPoolSize}`);

    // Connection event listeners for monitoring
    conn.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    conn.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    conn.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected successfully');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB disconnected through SIGTERM');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB disconnect:', err);
        process.exit(1);
      }
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB disconnected through SIGINT');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB disconnect:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection FAILED:', err.message);
    // Don't process.exit - let the app start, health check will reveal the issue
    throw err;
  }
};

// Export connection status for health checks
const getConnectionStatus = () => {
  if (!dbConnection) return 'disconnected';
  const state = dbConnection.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return states[state] || 'unknown';
};

module.exports = { connectDB, getConnectionStatus };