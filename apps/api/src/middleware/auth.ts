import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
    userId?: string;
    username?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || 'codearena-secret';
        const decoded = jwt.verify(token, secret) as { userId: string; username: string };
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (error) {
        logger.warn('Invalid token attempt', { ip: req.ip });
        res.status(401).json({ error: 'Invalid token.' });
    }
};
