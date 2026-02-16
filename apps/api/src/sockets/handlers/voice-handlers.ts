import { Server, Socket } from 'socket.io';
import { logger } from '../../utils/logger';

export function registerVoiceHandlers(io: Server, socket: Socket & { userId?: string; username?: string }): void {
    // User ready for voice in a battle/channel
    socket.on('voice:ready', (data: { roomId: string }) => {
        socket.join(`voice:${data.roomId}`);
        socket.to(`voice:${data.roomId}`).emit('voice:user-joined', {
            userId: socket.userId,
            username: socket.username,
        });
        logger.info('User joined voice', { roomId: data.roomId, userId: socket.userId });
    });

    // WebRTC signaling
    socket.on('voice:signal', (data: { to: string; signal: any }) => {
        io.to(data.to).emit('voice:signal', {
            userId: socket.userId,
            signal: data.signal,
        });
    });

    // Leave voice
    socket.on('voice:leave', (data: { roomId: string }) => {
        socket.leave(`voice:${data.roomId}`);
        socket.to(`voice:${data.roomId}`).emit('voice:user-left', {
            userId: socket.userId,
        });
    });

    // Mute/unmute notification
    socket.on('voice:mute', (data: { roomId: string; muted: boolean }) => {
        socket.to(`voice:${data.roomId}`).emit('voice:mute-toggle', {
            userId: socket.userId,
            muted: data.muted,
        });
    });
}
