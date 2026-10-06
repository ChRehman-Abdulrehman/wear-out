const { Queue } = require('bullmq');

const orderQueue = new Queue('orders', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
});

// Add order confirmation job to queue
async function addOrderConfirmationJob(orderId, delay = 0) {
  await orderQueue.add('send-order-confirmation', { orderId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    timeout: 30000,
    removeOnComplete: true,
    removeOnFail: false,
  });
}

// Process queue events
orderQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

orderQueue.on('failed', (job, error) => {
  console.error(`Job failed: ${job.id}`, error);
});

module.exports = { orderQueue, addOrderConfirmationJob };