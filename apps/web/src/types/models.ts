export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    profile: {
        bio?: string;
        location?: string;
        website?: string;
        github?: string;
    };
    stats: {
        rating: number;
        wins: number;
        losses: number;
        draws: number;
        totalMatches: number;
        winStreak: number;
        bestStreak: number;
        totalSubmissions: number;
        successRate: number;
    };
    wallet: {
        tokens: number;
    };
    preferences: {
        theme: 'light' | 'dark';
        language: string;
    };
}

export interface Guild {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    banner?: string;
    memberCount: number;
    tags: string[];
    channels: Channel[];
    visibility: 'public' | 'private' | 'invite-only';
}

export interface Channel {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'battle';
    position: number;
}

export interface Battle {
    battleId: string;
    type: '1v1' | '2v2' | 'ffa';
    problem: {
        title: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
    players: BattlePlayer[];
    timer: {
        startTime: string;
        duration: number;
        remaining: number;
    };
    status: 'waiting' | 'countdown' | 'active' | 'ended';
    winner?: string;
}

export interface BattlePlayer {
    userId: string;
    username: string;
    rating: number;
    status: 'waiting' | 'ready' | 'active' | 'finished';
    testsPassed: number;
    totalTests: number;
    finalScore: number;
    ratingChange: number;
}

export interface Problem {
    id: string;
    slug: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    category: string;
    constraints: {
        timeLimit: number;
        memoryLimit: number;
    };
    testCases: {
        input: string;
        expectedOutput: string;
        isHidden: boolean;
    }[];
}

export interface LeaderboardEntry {
    rank: number;
    id: string;
    username: string;
    avatar?: string;
    rating: number;
    wins: number;
    losses: number;
    totalMatches: number;
    bestStreak: number;
}

export interface ChatMessage {
    userId: string;
    username: string;
    message: string;
    timestamp: number;
    channelId?: string;
}
