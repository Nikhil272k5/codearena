import mongoose, { Schema, Document } from 'mongoose';

export interface IGuild extends Document {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    banner?: string;
    ownerId: mongoose.Types.ObjectId;
    members: {
        userId: mongoose.Types.ObjectId;
        role: 'owner' | 'admin' | 'moderator' | 'member';
        joinedAt: Date;
        permissions: string[];
    }[];
    channels: {
        name: string;
        type: 'text' | 'voice' | 'battle';
        position: number;
        permissions: any;
    }[];
    settings: {
        visibility: 'public' | 'private' | 'invite-only';
        maxMembers: number;
        requireApproval: boolean;
    };
    tags: string[];
    stats: {
        totalBattles: number;
        totalMembers: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const GuildSchema = new Schema<IGuild>(
    {
        name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
        slug: { type: String, unique: true, index: true },
        description: { type: String, maxlength: 500 },
        icon: String,
        banner: String,
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        members: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
                joinedAt: { type: Date, default: Date.now },
                permissions: [String],
            },
        ],
        channels: [
            {
                name: { type: String, required: true },
                type: { type: String, enum: ['text', 'voice', 'battle'], default: 'text' },
                position: { type: Number, default: 0 },
                permissions: Schema.Types.Mixed,
            },
        ],
        settings: {
            visibility: { type: String, enum: ['public', 'private', 'invite-only'], default: 'public' },
            maxMembers: { type: Number, default: 100 },
            requireApproval: { type: Boolean, default: false },
        },
        tags: [{ type: String }],
        stats: {
            totalBattles: { type: Number, default: 0 },
            totalMembers: { type: Number, default: 1 },
        },
    },
    { timestamps: true }
);

GuildSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

export const Guild = mongoose.model<IGuild>('Guild', GuildSchema);
