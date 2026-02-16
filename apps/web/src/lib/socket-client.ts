import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        const wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        socket = io(wsUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('🔗 Connected to CodeArena server');
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from server');
        });

        socket.on('connect_error', (err) => {
            console.warn('Socket connection error:', err.message);
        });
    }

    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
