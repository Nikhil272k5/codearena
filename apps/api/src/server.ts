import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './utils/db-client';
import { getRedis } from './utils/redis-client';
import { initializeSocket } from './sockets/index';
import { logger } from './utils/logger';

// Controllers
import { register, login, getProfile } from './controllers/auth';
import { getUser, getLeaderboard, updateProfile } from './controllers/users';
import { createGuild, getGuilds, getGuild, joinGuild } from './controllers/guilds';
import { createBattle, getBattle, getBattles } from './controllers/battles';

// Middleware
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { validate } from './middleware/validation';

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URL ? [`https://${process.env.FRONTEND_URL.replace('https://', '')}`] : []),
].filter(Boolean) as string[];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(allowed => origin.startsWith(allowed) || origin.includes('.vercel.app'))) {
            return callback(null, true);
        }
        callback(null, true); // Allow all in development
    },
    credentials: true,
};

// Socket.IO setup
const io = new Server(server, {
    cors: corsOptions,
    pingTimeout: 60000,
    pingInterval: 25000,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimitMiddleware('api'));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'codearena-api',
    });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/register', validate('register'), register);
app.post('/api/auth/login', validate('login'), login);
app.get('/api/auth/profile', authMiddleware, getProfile);

// ============ USER ROUTES ============
app.get('/api/users/:id', getUser);
app.get('/api/leaderboard', getLeaderboard);
app.put('/api/users/profile', authMiddleware, updateProfile);

// ============ GUILD ROUTES ============
app.post('/api/guilds', authMiddleware, validate('createGuild'), createGuild);
app.get('/api/guilds', getGuilds);
app.get('/api/guilds/:id', getGuild);
app.post('/api/guilds/:id/join', authMiddleware, joinGuild);

// ============ BATTLE ROUTES ============
app.post('/api/battles', authMiddleware, createBattle);
app.get('/api/battles', getBattles);
app.get('/api/battles/:id', getBattle);

// ============ PROBLEMS ROUTES ============
app.get('/api/problems', async (req, res) => {
    try {
        const { Problem } = await import('./models/Problem');
        const difficulty = req.query.difficulty as string;
        const query: any = {};
        if (difficulty) query.difficulty = difficulty;

        const problems = await Problem.find(query)
            .select('slug title difficulty tags category stats')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ problems });
    } catch (error) {
        res.json({ problems: [] });
    }
});

// Initialize Socket.IO
initializeSocket(io);

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);

const startServer = async () => {
    // Connect to databases
    await connectDB();
    getRedis();

    server.listen(PORT, '0.0.0.0', () => {
        logger.info(`🚀 CodeArena API server running on port ${PORT}`);
        logger.info(`📡 Socket.IO ready for connections`);
        logger.info(`💚 Health check: http://localhost:${PORT}/health`);
    });
};

startServer().catch((error) => {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
});

export { app, server, io };
