import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/codearena';

    try {
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection failed', { error });
        // Don't crash — allow server to start without DB for development
        logger.warn('Server will continue without MongoDB connection');
    }

    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
    });
};
