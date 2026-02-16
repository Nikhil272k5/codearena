import { Server, Socket } from 'socket.io';
import { logger } from '../../utils/logger';

export function registerChatHandlers(io: Server, socket: Socket & { userId?: string; username?: string }): void {
    // Guild channel message
    socket.on('chat:message', (data: { channelId: string; message: string; guildId?: string }) => {
        if (!data.message || data.message.trim().length === 0) return;
        if (data.message.length > 2000) return;

        const chatMessage = {
            userId: socket.userId,
            username: socket.username,
            message: data.message.trim(),
            timestamp: Date.now(),
            channelId: data.channelId,
        };

        // Broadcast to channel
        io.to(`channel:${data.channelId}`).emit('chat:message', chatMessage);
        logger.debug('Chat message', { channelId: data.channelId, userId: socket.userId });
    });

    // Battle chat message
    socket.on('battle:chat', (data: { battleId: string; message: string }) => {
        if (!data.message || data.message.trim().length === 0) return;

        const chatMessage = {
            userId: socket.userId,
            username: socket.username,
            message: data.message.trim(),
            timestamp: Date.now(),
        };

        io.to(`battle:${data.battleId}`).emit('battle:chat', chatMessage);
    });

    // Join channel
    socket.on('channel:join', (data: { channelId: string }) => {
        socket.join(`channel:${data.channelId}`);
        socket.to(`channel:${data.channelId}`).emit('channel:user-joined', {
            userId: socket.userId,
            username: socket.username,
        });
    });

    // Leave channel
    socket.on('channel:leave', (data: { channelId: string }) => {
        socket.leave(`channel:${data.channelId}`);
        socket.to(`channel:${data.channelId}`).emit('channel:user-left', {
            userId: socket.userId,
        });
    });

    // Typing indicator
    socket.on('chat:typing', (data: { channelId: string }) => {
        socket.to(`channel:${data.channelId}`).emit('chat:typing', {
            userId: socket.userId,
            username: socket.username,
        });
    });
}
