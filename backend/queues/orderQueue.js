// Queue disabled when Redis not available — orders still work, just no email job
let orderQueue = null;
let queueEnabled = false;

try {
  const { Queue } = require('bullmq');
  orderQueue = new Queue('orders', {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      connectTimeout: 1000,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
  orderQueue.on('error', () => {});
  orderQueue.on('ready', () => { queueEnabled = true; });
} catch (e) {
  console.warn('Queue unavailable (Redis not running):', e.message);
}

async function addOrderConfirmationJob(orderId, delay = 0) {
  if (!queueEnabled || !orderQueue) return;
  try {
    await Promise.race([
      orderQueue.add('send-order-confirmation', { orderId }, { timeout: 5000 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('queue-timeout')), 5000)),
    ]);
  } catch (err) {
    console.warn('Queue job skipped (Redis not available):', err.message);
  }
}

module.exports = { orderQueue, addOrderConfirmationJob };
