'use client';

import { useEffect, useState } from 'react';
import { useSocket } from './use-socket';

interface PresenceData {
    userId: string;
    username?: string;
    status: string;
}

export function usePresence() {
    const { socket } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('presence:get-online');

        socket.on('presence:online-users', (users: PresenceData[]) => {
            setOnlineUsers(users);
        });

        socket.on('presence:update', (data: PresenceData) => {
            setOnlineUsers((prev) => {
                const filtered = prev.filter((u) => u.userId !== data.userId);
                if (data.status !== 'offline') {
                    filtered.push(data);
                }
                return filtered;
            });
        });

        // Heartbeat every 30 seconds
        const interval = setInterval(() => {
            socket.emit('presence:heartbeat');
        }, 30000);

        return () => {
            clearInterval(interval);
            socket.off('presence:online-users');
            socket.off('presence:update');
        };
    }, [socket]);

    return { onlineUsers, onlineCount: onlineUsers.length };
}
