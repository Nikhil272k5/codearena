import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
    slug: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    category: string;
    constraints: {
        timeLimit: number;
        memoryLimit: number;
        inputSize: string;
    };
    testCases: {
        input: string;
        expectedOutput: string;
        isHidden: boolean;
        weight: number;
    }[];
    solution: {
        approach: string;
        complexity: {
            time: string;
            space: string;
        };
        code: {
            python?: string;
            javascript?: string;
            java?: string;
            cpp?: string;
        };
    };
    stats: {
        totalAttempts: number;
        successRate: number;
        averageTime: number;
    };
    createdBy: mongoose.Types.ObjectId | string;
    createdAt: Date;
}

const ProblemSchema = new Schema<IProblem>(
    {
        slug: { type: String, unique: true, index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
        tags: [{ type: String }],
        category: { type: String, index: true },
        constraints: {
            timeLimit: { type: Number, default: 10000 },
            memoryLimit: { type: Number, default: 256 },
            inputSize: String,
        },
        testCases: [
            {
                input: { type: String, required: true },
                expectedOutput: { type: String, required: true },
                isHidden: { type: Boolean, default: false },
                weight: { type: Number, default: 1 },
            },
        ],
        solution: {
            approach: String,
            complexity: {
                time: String,
                space: String,
            },
            code: {
                python: String,
                javascript: String,
                java: String,
                cpp: String,
            },
        },
        stats: {
            totalAttempts: { type: Number, default: 0 },
            successRate: { type: Number, default: 0 },
            averageTime: { type: Number, default: 0 },
        },
        createdBy: { type: Schema.Types.Mixed, default: 'system' },
    },
    { timestamps: true }
);

ProblemSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
