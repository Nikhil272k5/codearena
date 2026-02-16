import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis | null = null;

export const getRedis = (): Redis | null => {
    if (redis) return redis;

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times: number) => {
                if (times > 3) {
                    logger.warn('Redis connection failed after 3 retries — continuing without Redis');
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        redis.on('connect', () => {
            logger.info('Redis connected successfully');
        });

        redis.on('error', (err) => {
            logger.error('Redis connection error', { error: err.message });
        });

        // Attempt connection (non-blocking)
        redis.connect().catch(() => {
            logger.warn('Redis unavailable — caching and rate limiting disabled');
            redis = null;
        });
    } catch (error) {
        logger.warn('Redis initialization failed — continuing without Redis');
        redis = null;
    }

    return redis;
};

export default getRedis;
