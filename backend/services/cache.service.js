const Redis = require('ioredis');

let redisClient = null;
let redisAvailable = false;

function getRedis() {
  if (!redisClient && redisAvailable !== 'disabled') {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      connectTimeout: 1000,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) {
          redisAvailable = 'disabled';
          return null; // stop retrying
        }
        return Math.min(times * 200, 1000);
      },
      lazyConnect: false,
    });
    redisClient.on('error', () => {});
    redisClient.on('ready', () => { redisAvailable = true; });
    redisClient.on('end', () => { redisClient = null; });
  }
  if (redisAvailable === 'disabled') return null;
  return redisClient;
}

// Cache-aside pattern: get or set with TTL
async function getOrSet(key, ttlSeconds, fetcher) {
  const redis = getRedis();
  if (!redis) return await fetcher();
  try {
    const cached = await Promise.race([
      redis.get(key),
      new Promise((_, reject) => setTimeout(() => reject(new Error('redis-timeout')), 500)),
    ]);
    if (cached !== null) {
      return JSON.parse(cached);
    }
    const fresh = await fetcher();
    await Promise.race([
      redis.setex(key, ttlSeconds, JSON.stringify(fresh)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('redis-timeout')), 500)),
    ]).catch(() => {});
    return fresh;
  } catch (err) {
    return await fetcher();
  }
}

// Invalidate cache by pattern
async function invalidate(pattern) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await Promise.race([
      (async () => {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) await redis.del(...keys);
      })(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('redis-timeout')), 500)),
    ]);
  } catch (err) {}
}

// Close Redis connection on app shutdown
async function closeRedis() {
  if (redisClient) {
    try { await redisClient.quit(); } catch (e) {}
    redisClient = null;
  }
}

module.exports = { getOrSet, invalidate, closeRedis };