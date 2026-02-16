import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { registerBattleHandlers } from './handlers/battle-handlers';
import { registerChatHandlers } from './handlers/chat-handlers';
import { registerPresenceHandlers, startIdleChecker } from './handlers/presence-handlers';
import { registerVoiceHandlers } from './handlers/voice-handlers';
import { queueManager } from '../services/matchmaking/queue-manager';
import { roomManager } from '../services/room-manager';

export function initializeSocket(io: Server): void {
    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        if (!token) {
            // Allow anonymous spectators
            (socket as any).userId = `anon-${socket.id}`;
            (socket as any).username = 'Spectator';
            return next();
        }

        try {
            const secret = process.env.JWT_SECRET || 'codearena-secret';
            const decoded = jwt.verify(token as string, secret) as { userId: string; username: string };
            (socket as any).userId = decoded.userId;
            (socket as any).username = decoded.username;
            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        const userId = (socket as any).userId;
        const username = (socket as any).username;
        logger.info('Socket connected', { socketId: socket.id, userId, username });

        // Register all handlers
        registerBattleHandlers(io, socket as any);
        registerChatHandlers(io, socket as any);
        registerPresenceHandlers(io, socket as any);
        registerVoiceHandlers(io, socket as any);

        // Spectator events
        socket.on('spectate:join', (data: { battleId: string }) => {
            socket.join(`spectate:${data.battleId}`);
            roomManager.joinRoom(data.battleId, {
                userId,
                username,
                socketId: socket.id,
                role: 'spectator',
            });
            io.to(`battle:${data.battleId}`).emit('spectator:joined', {
                userId,
                username,
                count: roomManager.getSpectators(data.battleId).length,
            });
        });

        socket.on('spectate:react', (data: { battleId: string; emoji: string }) => {
            io.to(`battle:${data.battleId}`).emit('spectate:reaction', {
                userId,
                emoji: data.emoji,
                timestamp: Date.now(),
            });
        });

        // Global disconnect cleanup
        socket.on('disconnect', () => {
            queueManager.removeFromAll(userId);
            roomManager.removeUserFromAll(userId);
        });
    });

    // Start idle checker
    startIdleChecker(io);

    logger.info('Socket.IO initialized with all handlers');
}
