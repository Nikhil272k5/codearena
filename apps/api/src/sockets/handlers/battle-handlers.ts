import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { Battle } from '../../models/Battle';
import { roomManager } from '../../services/room-manager';
import { queueManager } from '../../services/matchmaking/queue-manager';
import { EloCalculator } from '../../services/matchmaking/elo-calculator';
import { DockerExecutor } from '../../services/code-executor/docker-executor';

const eloCalculator = new EloCalculator();
const executor = new DockerExecutor();

export function registerBattleHandlers(io: Server, socket: Socket & { userId?: string; username?: string }): void {
    // Join matchmaking queue
    socket.on('matchmaking:join', async (data: { rating: number; type?: string }) => {
        const type = data.type || '1v1';
        const matcher = queueManager.getMatcher(type);

        const opponent = matcher.addToQueue({
            userId: socket.userId!,
            username: socket.username!,
            rating: data.rating,
            joinedAt: Date.now(),
            socketId: socket.id,
        });

        if (opponent) {
            const battleId = uuidv4();
            roomManager.createRoom(battleId);

            // Notify both players
            io.to(socket.id).emit('battle:matched', {
                battleId,
                opponent: { username: opponent.username, rating: opponent.rating },
            });

            io.to(opponent.socketId).emit('battle:matched', {
                battleId,
                opponent: { username: socket.username, rating: data.rating },
            });

            logger.info('Match created', { battleId, players: [socket.userId, opponent.userId] });
        } else {
            socket.emit('matchmaking:queued', { position: matcher.getQueueSize() });
        }
    });

    // Leave matchmaking queue
    socket.on('matchmaking:leave', () => {
        queueManager.removeFromAll(socket.userId!);
        socket.emit('matchmaking:left');
    });

    // Join battle room
    socket.on('battle:join', async (data: { battleId: string }) => {
        socket.join(`battle:${data.battleId}`);
        roomManager.joinRoom(data.battleId, {
            userId: socket.userId!,
            username: socket.username!,
            socketId: socket.id,
            role: 'player',
        });

        socket.to(`battle:${data.battleId}`).emit('battle:player-joined', {
            userId: socket.userId,
            username: socket.username,
        });

        logger.info('Player joined battle', { battleId: data.battleId, userId: socket.userId });
    });

    // Mark ready
    socket.on('battle:ready', (data: { battleId: string }) => {
        io.to(`battle:${data.battleId}`).emit('battle:player-ready', {
            userId: socket.userId,
        });

        const players = roomManager.getPlayers(data.battleId);
        const allReady = players.length >= 2;
        if (allReady) {
            // Start countdown
            io.to(`battle:${data.battleId}`).emit('battle:countdown', { seconds: 3 });
            setTimeout(() => {
                io.to(`battle:${data.battleId}`).emit('battle:start', { timestamp: Date.now() });
                startBattleTimer(io, data.battleId, 1800);
            }, 3000);
        }
    });

    // Code submission
    socket.on('submission:submit', async (data: { battleId: string; code: string; language: string }) => {
        socket.emit('submission:queue', { status: 'queued' });
        socket.emit('submission:running', { status: 'running' });

        try {
            const result = await executor.execute({
                code: data.code,
                language: data.language as any,
                testCases: [
                    { input: '1 2\n3', expectedOutput: '3' },
                    { input: '10 20\n30', expectedOutput: '30' },
                ],
                timeLimit: 10000,
                memoryLimit: 256,
            });

            socket.emit('submission:result', result);

            // Broadcast progress to battle room
            io.to(`battle:${data.battleId}`).emit('progress:update', {
                userId: socket.userId,
                testsPassed: result.totalPassed,
                totalTests: result.totalTests,
                executionTime: result.overallExecutionTime,
            });

            logger.info('Submission processed', {
                battleId: data.battleId,
                userId: socket.userId,
                passed: result.totalPassed,
                total: result.totalTests,
            });
        } catch (error: any) {
            socket.emit('submission:result', {
                success: false,
                error: error.message,
                testResults: [],
                totalPassed: 0,
                totalTests: 0,
                overallExecutionTime: 0,
            });
        }
    });

    // Code change notification (size only, not content)
    socket.on('code:changed', (data: { battleId: string; size: number; lineCount: number }) => {
        socket.to(`battle:${data.battleId}`).emit('code:changed', {
            userId: socket.userId,
            size: data.size,
            lineCount: data.lineCount,
        });
    });

    // Typing indicator
    socket.on('code:typing', (data: { battleId: string }) => {
        socket.to(`battle:${data.battleId}`).emit('code:typing', {
            userId: socket.userId,
        });
    });

    // Leave battle
    socket.on('battle:leave', (data: { battleId: string }) => {
        socket.leave(`battle:${data.battleId}`);
        roomManager.leaveRoom(data.battleId, socket.userId!);
        socket.to(`battle:${data.battleId}`).emit('battle:player-left', {
            userId: socket.userId,
        });
    });
}

function startBattleTimer(io: Server, battleId: string, duration: number): void {
    let remaining = duration;

    const interval = setInterval(() => {
        remaining--;

        if (remaining <= 0) {
            clearInterval(interval);
            io.to(`battle:${battleId}`).emit('battle:timeout', { battleId });
            return;
        }

        if (remaining === 60) {
            io.to(`battle:${battleId}`).emit('battle:time-warning', { remaining: 60 });
        }

        // Send tick every 10 seconds to reduce traffic
        if (remaining % 10 === 0) {
            io.to(`battle:${battleId}`).emit('battle:tick', { remaining });
        }
    }, 1000);
}
