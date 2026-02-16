import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    battleId: string;
    userId: mongoose.Types.ObjectId;
    problemId: mongoose.Types.ObjectId;
    code: string;
    language: string;
    testsPassed: number;
    totalTests: number;
    executionTime: number;
    memory: number;
    complexity?: string;
    status: 'queued' | 'running' | 'completed' | 'error' | 'timeout';
    error?: string;
    createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        battleId: { type: String, required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
        code: { type: String, required: true, maxlength: 50000 },
        language: { type: String, enum: ['python', 'javascript', 'java', 'cpp', 'go'], required: true },
        testsPassed: { type: Number, default: 0 },
        totalTests: { type: Number, default: 0 },
        executionTime: { type: Number, default: 0 },
        memory: { type: Number, default: 0 },
        complexity: String,
        status: {
            type: String,
            enum: ['queued', 'running', 'completed', 'error', 'timeout'],
            default: 'queued',
        },
        error: String,
    },
    { timestamps: true }
);

SubmissionSchema.index({ battleId: 1, userId: 1 });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
