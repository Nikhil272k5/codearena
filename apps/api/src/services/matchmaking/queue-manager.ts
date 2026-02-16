import { SkillMatcher } from './skill-matcher';
import { logger } from '../../utils/logger';

export class QueueManager {
    private matchers: Map<string, SkillMatcher> = new Map();

    constructor() {
        // Create matchers for different battle types
        this.matchers.set('1v1', new SkillMatcher());
        this.matchers.set('2v2', new SkillMatcher());
        this.matchers.set('ffa', new SkillMatcher());
    }

    getMatcher(type: string): SkillMatcher {
        if (!this.matchers.has(type)) {
            this.matchers.set(type, new SkillMatcher());
        }
        return this.matchers.get(type)!;
    }

    getTotalQueueSize(): number {
        let total = 0;
        this.matchers.forEach((matcher) => {
            total += matcher.getQueueSize();
        });
        return total;
    }

    removeFromAll(userId: string): void {
        this.matchers.forEach((matcher) => {
            matcher.removeFromQueue(userId);
        });
    }
}

export const queueManager = new QueueManager();
