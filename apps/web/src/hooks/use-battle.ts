'use client';

import { useEffect } from 'react';
import { useSocket } from './use-socket';
import { useBattleStore } from '@/stores/battle-store';

export function useBattle(battleId: string) {
    const { socket } = useSocket();
    const store = useBattleStore();

    useEffect(() => {
        if (!socket) return;

        socket.emit('battle:join', { battleId });

        socket.on('battle:countdown', (data: { seconds: number }) => {
            console.log(`Battle starting in ${data.seconds}...`);
        });

        socket.on('battle:start', () => {
            console.log('Battle started!');
        });

        socket.on('battle:tick', (data: { remaining: number }) => {
            store.setTimeRemaining(data.remaining);
        });

        socket.on('battle:time-warning', () => {
            console.log('⚠️ 1 minute remaining!');
        });

        socket.on('battle:timeout', () => {
            console.log('⏰ Time is up!');
        });

        socket.on('progress:update', (data: any) => {
            store.setOpponentProgress({
                testsPassed: data.testsPassed,
                totalTests: data.totalTests,
                codeSize: 0,
            });
        });

        socket.on('submission:result', (result: any) => {
            store.setSubmissionResult(result);
        });

        return () => {
            socket.emit('battle:leave', { battleId });
            socket.off('battle:countdown');
            socket.off('battle:start');
            socket.off('battle:tick');
            socket.off('battle:time-warning');
            socket.off('battle:timeout');
            socket.off('progress:update');
            socket.off('submission:result');
        };
    }, [socket, battleId]);

    const submitCode = (code: string, language: string) => {
        if (!socket) return;
        store.setSubmitting(true);
        socket.emit('submission:submit', { battleId, code, language });
    };

    const sendCodeUpdate = (size: number, lineCount: number) => {
        if (!socket) return;
        socket.emit('code:changed', { battleId, size, lineCount });
    };

    return { submitCode, sendCodeUpdate };
}
