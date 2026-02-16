import { Server, Socket } from 'socket.io';
import { logger } from '../../utils/logger';

type UserStatus = 'offline' | 'online' | 'idle' | 'coding' | 'thinking' | 'debugging' | 'submitting' | 'in-battle';

const userStates = new Map<string, { status: UserStatus; lastActivity: number }>();

export function registerPresenceHandlers(io: Server, socket: Socket & { userId?: string; username?: string }): void {
    // Set initial online status
    userStates.set(socket.userId!, { status: 'online', lastActivity: Date.now() });
    io.emit('presence:update', {
        userId: socket.userId,
        username: socket.username,
        status: 'online',
        timestamp: Date.now(),
    });

    // Status update
    socket.on('presence:update', (data: { status: UserStatus }) => {
        userStates.set(socket.userId!, { status: data.status, lastActivity: Date.now() });
        io.emit('presence:update', {
            userId: socket.userId,
            username: socket.username,
            status: data.status,
            timestamp: Date.now(),
        });
    });

    // Activity heartbeat
    socket.on('presence:heartbeat', () => {
        const state = userStates.get(socket.userId!);
        if (state) {
            state.lastActivity = Date.now();
        }
    });

    // Get online users
    socket.on('presence:get-online', () => {
        const onlineUsers = Array.from(userStates.entries())
            .filter(([, state]) => state.status !== 'offline')
            .map(([userId, state]) => ({
                userId,
                status: state.status,
            }));
        socket.emit('presence:online-users', onlineUsers);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        userStates.set(socket.userId!, { status: 'offline', lastActivity: Date.now() });
        io.emit('presence:update', {
            userId: socket.userId,
            username: socket.username,
            status: 'offline',
            timestamp: Date.now(),
        });
        logger.info('User disconnected', { userId: socket.userId });
    });
}

// Auto-idle checker (runs every 30 seconds)
export function startIdleChecker(io: Server): void {
    setInterval(() => {
        const now = Date.now();
        userStates.forEach((state, userId) => {
            if (state.status !== 'offline' && state.status !== 'idle' && now - state.lastActivity > 5 * 60 * 1000) {
                state.status = 'idle';
                io.emit('presence:update', {
                    userId,
                    status: 'idle',
                    timestamp: now,
                });
            }
        });
    }, 30000);
}

export function getOnlineCount(): number {
    let count = 0;
    userStates.forEach((state) => {
        if (state.status !== 'offline') count++;
    });
    return count;
}
