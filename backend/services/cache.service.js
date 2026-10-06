const Redis = require('ioredis');

let redisClient = null;

function getRedis() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl);
    redisClient.on('error', (err) => {
      console.error('Redis error:', err.message);
    });
  }
  return redisClient;
}

// Cache-aside pattern: get or set with TTL
async function getOrSet(key, ttlSeconds, fetcher) {
  const redis = getRedis();
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      return JSON.parse(cached);
    }
    const fresh = await fetcher();
    await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
    return fresh;
  } catch (err) {
    // If Redis fails, just fall through to the fetcher without caching
    console.warn('Redis cache miss/error, fetching from DB:', err.message);
    return await fetcher();
  }
}

// Invalidate cache by pattern
async function invalidate(pattern) {
  const redis = getRedis();
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error('Cache invalidation error:', err.message);
  }
}

// Close Redis connection on app shutdown
async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
}

module.exports = { getOrSet, invalidate, closeRedis };