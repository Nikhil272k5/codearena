import { logger } from '../utils/logger';

interface RoomParticipant {
    userId: string;
    username: string;
    socketId: string;
    role: 'player' | 'spectator';
}

export class RoomManager {
    private rooms: Map<string, Map<string, RoomParticipant>> = new Map();

    createRoom(roomId: string): void {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Map());
            logger.info('Room created', { roomId });
        }
    }

    joinRoom(roomId: string, participant: RoomParticipant): void {
        if (!this.rooms.has(roomId)) {
            this.createRoom(roomId);
        }
        this.rooms.get(roomId)!.set(participant.userId, participant);
        logger.info('User joined room', { roomId, userId: participant.userId, role: participant.role });
    }

    leaveRoom(roomId: string, userId: string): void {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(userId);
            if (room.size === 0) {
                this.rooms.delete(roomId);
                logger.info('Room deleted (empty)', { roomId });
            }
        }
    }

    getRoomParticipants(roomId: string): RoomParticipant[] {
        const room = this.rooms.get(roomId);
        return room ? Array.from(room.values()) : [];
    }

    getPlayers(roomId: string): RoomParticipant[] {
        return this.getRoomParticipants(roomId).filter((p) => p.role === 'player');
    }

    getSpectators(roomId: string): RoomParticipant[] {
        return this.getRoomParticipants(roomId).filter((p) => p.role === 'spectator');
    }

    getRoomCount(): number {
        return this.rooms.size;
    }

    findUserRoom(userId: string): string | undefined {
        for (const [roomId, participants] of this.rooms) {
            if (participants.has(userId)) return roomId;
        }
        return undefined;
    }

    removeUserFromAll(userId: string): void {
        for (const [roomId, participants] of this.rooms) {
            if (participants.has(userId)) {
                participants.delete(userId);
                if (participants.size === 0) {
                    this.rooms.delete(roomId);
                }
            }
        }
    }
}

export const roomManager = new RoomManager();
