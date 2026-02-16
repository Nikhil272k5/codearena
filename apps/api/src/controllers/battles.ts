import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Battle } from '../models/Battle';
import { Problem } from '../models/Problem';
import { logger } from '../utils/logger';

export const createBattle = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const username = (req as any).username;
        const { type = '1v1', difficulty = 'medium', duration = 1800 } = req.body;

        // Find a random problem matching difficulty
        let problem = await Problem.findOne({ difficulty }).skip(
            Math.floor(Math.random() * (await Problem.countDocuments({ difficulty })))
        );

        // Fallback problem if none exist
        if (!problem) {
            problem = {
                _id: 'default',
                title: 'Two Sum',
                difficulty,
            } as any;
        }

        const battleId = uuidv4();
        const battle = new Battle({
            battleId,
            type,
            problem: {
                problemId: problem._id,
                title: problem.title,
                difficulty: problem.difficulty,
            },
            players: [
                {
                    userId,
                    username,
                    rating: 1000,
                    status: 'waiting',
                    submissions: [],
                    analytics: { typingSpeed: [], codeSize: [], timestamps: [], errorCount: 0 },
                    finalScore: 0,
                    ratingChange: 0,
                },
            ],
            timer: { startTime: new Date(), duration, remaining: duration },
            status: 'waiting',
        });

        await battle.save();

        logger.info('Battle created', { battleId, type, creator: userId });
        res.status(201).json({ battle: { battleId, type, status: 'waiting', problem: battle.problem } });
    } catch (error: any) {
        logger.error('Failed to create battle', { error: error.message });
        res.status(500).json({ error: 'Failed to create battle' });
    }
};

export const getBattle = async (req: Request, res: Response): Promise<void> => {
    try {
        const battle = await Battle.findOne({ battleId: req.params.id });
        if (!battle) {
            res.status(404).json({ error: 'Battle not found' });
            return;
        }
        res.json({ battle });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch battle' });
    }
};

export const getBattles = async (req: Request, res: Response): Promise<void> => {
    try {
        const status = req.query.status as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

        const query: any = {};
        if (status) query.status = status;

        const battles = await Battle.find(query)
            .select('battleId type problem players.username players.rating players.status timer status createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Battle.countDocuments(query);

        res.json({
            battles,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch battles' });
    }
};
