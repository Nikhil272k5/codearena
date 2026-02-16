import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
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
    badges: {
        badgeId: string;
        earnedAt: Date;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }[];
    wallet: {
        tokens: number;
        transactions: {
            type: 'earn' | 'spend' | 'wager';
            amount: number;
            reason: string;
            timestamp: Date;
        }[];
    };
    preferences: {
        theme: 'light' | 'dark';
        language: string;
        notifications: {
            email: boolean;
            push: boolean;
            matchFound: boolean;
            friendOnline: boolean;
        };
    };
    guilds: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];
    blocked: mongoose.Types.ObjectId[];
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, index: true, trim: true, minlength: 3, maxlength: 30 },
        email: { type: String, required: true, unique: true, index: true, lowercase: true },
        passwordHash: { type: String, required: true },
        avatar: { type: String },
        profile: {
            bio: { type: String, maxlength: 500 },
            location: { type: String },
            website: { type: String },
            github: { type: String },
        },
        stats: {
            rating: { type: Number, default: 1000, index: true },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            draws: { type: Number, default: 0 },
            totalMatches: { type: Number, default: 0 },
            winStreak: { type: Number, default: 0 },
            bestStreak: { type: Number, default: 0 },
            totalSubmissions: { type: Number, default: 0 },
            successRate: { type: Number, default: 0 },
        },
        badges: [
            {
                badgeId: String,
                earnedAt: { type: Date, default: Date.now },
                rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
            },
        ],
        wallet: {
            tokens: { type: Number, default: 500 },
            transactions: [
                {
                    type: { type: String, enum: ['earn', 'spend', 'wager'] },
                    amount: Number,
                    reason: String,
                    timestamp: { type: Date, default: Date.now },
                },
            ],
        },
        preferences: {
            theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
            language: { type: String, default: 'python' },
            notifications: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true },
                matchFound: { type: Boolean, default: true },
                friendOnline: { type: Boolean, default: false },
            },
        },
        guilds: [{ type: Schema.Types.ObjectId, ref: 'Guild' }],
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        lastSeen: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Compound index for leaderboards
UserSchema.index({ 'stats.rating': -1, 'stats.wins': -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
