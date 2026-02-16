import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../utils/redis-client';
import { logger } from '../utils/logger';

interface RateLimitConfig {
    points: number;
    duration: number;
    blockDuration: number;
}

const configs: Record<string, RateLimitConfig> = {
    submission: { points: 10, duration: 60, blockDuration: 60 },
    chat: { points: 20, duration: 10, blockDuration: 10 },
    api: { points: 100, duration: 60, blockDuration: 30 },
    auth: { points: 5, duration: 300, blockDuration: 600 },
};

export const rateLimitMiddleware = (type: string = 'api') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const redis = getRedis();
        if (!redis) {
            // No Redis — skip rate limiting
            next();
            return;
        }

        const config = configs[type] || configs.api;
        const key = `ratelimit:${type}:${req.ip}`;

        try {
            const current = await redis.incr(key);
            if (current === 1) {
                await redis.expire(key, config.duration);
            }

            if (current > config.points) {
                logger.warn('Rate limit exceeded', { type, ip: req.ip });
                res.status(429).json({
                    error: 'Rate limit exceeded',
                    retryAfter: config.blockDuration,
                });
                return;
            }

            next();
        } catch (error) {
            // Redis error — allow request through
            next();
        }
    };
};
