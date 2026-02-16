import mongoose, { Schema, Document } from 'mongoose';

export interface IBattle extends Document {
    battleId: string;
    type: '1v1' | '2v2' | 'ffa';
    guildId?: mongoose.Types.ObjectId;
    channelId?: mongoose.Types.ObjectId;
    problem: {
        problemId: mongoose.Types.ObjectId;
        title: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
    players: {
        userId: mongoose.Types.ObjectId;
        username: string;
        rating: number;
        teamId?: string;
        status: 'waiting' | 'ready' | 'active' | 'finished' | 'disconnected';
        submissions: {
            code: string;
            language: string;
            timestamp: Date;
            testsPassed: number;
            totalTests: number;
            executionTime: number;
            memory: number;
            complexity?: string;
            error?: string;
        }[];
        analytics: {
            typingSpeed: number[];
            codeSize: number[];
            timestamps: number[];
            errorCount: number;
        };
        finalScore: number;
        ratingChange: number;
    }[];
    spectators: {
        userId: mongoose.Types.ObjectId;
        joinedAt: Date;
    }[];
    timer: {
        startTime: Date;
        duration: number;
        remaining: number;
    };
    status: 'waiting' | 'countdown' | 'active' | 'paused' | 'ended';
    winner?: mongoose.Types.ObjectId;
    events: {
        type: string;
        userId: mongoose.Types.ObjectId;
        timestamp: Date;
        data: any;
    }[];
    chat: {
        userId: mongoose.Types.ObjectId;
        message: string;
        timestamp: Date;
    }[];
    wager?: {
        amount: number;
        pot: number;
    };
    createdAt: Date;
    endedAt?: Date;
}

const BattleSchema = new Schema<IBattle>(
    {
        battleId: { type: String, unique: true, required: true, index: true },
        type: { type: String, enum: ['1v1', '2v2', 'ffa'], default: '1v1' },
        guildId: { type: Schema.Types.ObjectId, ref: 'Guild' },
        channelId: { type: Schema.Types.ObjectId, ref: 'Channel' },
        problem: {
            problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
            title: String,
            difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
        },
        players: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                username: String,
                rating: Number,
                teamId: String,
                status: {
                    type: String,
                    enum: ['waiting', 'ready', 'active', 'finished', 'disconnected'],
                    default: 'waiting',
                },
                submissions: [
                    {
                        code: String,
                        language: String,
                        timestamp: { type: Date, default: Date.now },
                        testsPassed: { type: Number, default: 0 },
                        totalTests: { type: Number, default: 0 },
                        executionTime: { type: Number, default: 0 },
                        memory: { type: Number, default: 0 },
                        complexity: String,
                        error: String,
                    },
                ],
                analytics: {
                    typingSpeed: [Number],
                    codeSize: [Number],
                    timestamps: [Number],
                    errorCount: { type: Number, default: 0 },
                },
                finalScore: { type: Number, default: 0 },
                ratingChange: { type: Number, default: 0 },
            },
        ],
        spectators: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        timer: {
            startTime: Date,
            duration: { type: Number, default: 1800 }, // 30 minutes
            remaining: Number,
        },
        status: {
            type: String,
            enum: ['waiting', 'countdown', 'active', 'paused', 'ended'],
            default: 'waiting',
            index: true,
        },
        winner: { type: Schema.Types.ObjectId, ref: 'User' },
        events: [
            {
                type: String,
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                timestamp: { type: Date, default: Date.now },
                data: Schema.Types.Mixed,
            },
        ],
        chat: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                message: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],
        wager: {
            amount: Number,
            pot: Number,
        },
        endedAt: Date,
    },
    { timestamps: true }
);

BattleSchema.index({ status: 1, createdAt: -1 });
BattleSchema.index({ 'players.userId': 1 });

export const Battle = mongoose.model<IBattle>('Battle', BattleSchema);
