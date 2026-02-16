'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket-client';
import { Socket } from 'socket.io-client';

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        setIsConnected(socket.connected);

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        disconnect: disconnectSocket,
    };
}
