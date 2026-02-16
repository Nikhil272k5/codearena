import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists with that email or username' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            username,
            email,
            passwordHash,
            stats: { rating: 1000, wins: 0, losses: 0, draws: 0, totalMatches: 0, winStreak: 0, bestStreak: 0, totalSubmissions: 0, successRate: 0 },
            wallet: { tokens: 500, transactions: [{ type: 'earn', amount: 500, reason: 'Welcome bonus', timestamp: new Date() }] },
        });

        await user.save();

        // Generate token
        const secret = process.env.JWT_SECRET || 'codearena-secret';
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        logger.info('New user registered', { userId: user._id, username });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                stats: user.stats,
                wallet: { tokens: user.wallet.tokens },
            },
        });
    } catch (error: any) {
        logger.error('Registration failed', { error: error.message });
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Update last seen
        user.lastSeen = new Date();
        await user.save();

        const secret = process.env.JWT_SECRET || 'codearena-secret';
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        logger.info('User logged in', { userId: user._id, username: user.username });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                stats: user.stats,
                wallet: { tokens: user.wallet.tokens },
                preferences: user.preferences,
            },
        });
    } catch (error: any) {
        logger.error('Login failed', { error: error.message });
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
