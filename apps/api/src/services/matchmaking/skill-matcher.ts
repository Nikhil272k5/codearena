import { logger } from '../../utils/logger';

interface QueueEntry {
    userId: string;
    username: string;
    rating: number;
    joinedAt: number;
    socketId: string;
    preferences?: {
        difficulty?: string;
        type?: string;
    };
}

export class SkillMatcher {
    private queue: Map<string, QueueEntry> = new Map();

    addToQueue(user: QueueEntry): QueueEntry | null {
        this.queue.set(user.userId, { ...user, joinedAt: Date.now() });
        logger.info('User added to matchmaking queue', { userId: user.userId, rating: user.rating, queueSize: this.queue.size });
        return this.tryMatch(user);
    }

    removeFromQueue(userId: string): void {
        this.queue.delete(userId);
        logger.info('User removed from matchmaking queue', { userId });
    }

    private tryMatch(user: QueueEntry): QueueEntry | null {
        const waitTime = Date.now() - user.joinedAt;
        const maxDiff = 100 + (waitTime / 1000) * 10; // Expand range over time

        const candidates = Array.from(this.queue.values())
            .filter((u) => u.userId !== user.userId)
            .map((opponent) => ({
                opponent,
                ratingDiff: Math.abs(opponent.rating - user.rating),
            }))
            .filter((c) => c.ratingDiff <= maxDiff)
            .sort((a, b) => a.ratingDiff - b.ratingDiff);

        if (candidates.length > 0) {
            const matched = candidates[0].opponent;
            this.queue.delete(user.userId);
            this.queue.delete(matched.userId);
            logger.info('Match found', {
                player1: user.userId,
                player2: matched.userId,
                ratingDiff: candidates[0].ratingDiff,
            });
            return matched;
        }

        return null;
    }

    getQueueSize(): number {
        return this.queue.size;
    }

    isInQueue(userId: string): boolean {
        return this.queue.has(userId);
    }
}
