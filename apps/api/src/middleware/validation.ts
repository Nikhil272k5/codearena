import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const schemas = {
    register: z.object({
        username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
        email: z.string().email(),
        password: z.string().min(6).max(100),
    }),
    login: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
    createGuild: z.object({
        name: z.string().min(3).max(50),
        description: z.string().max(500).optional(),
        tags: z.array(z.string()).max(10).optional(),
        visibility: z.enum(['public', 'private', 'invite-only']).optional(),
    }),
    submitCode: z.object({
        battleId: z.string(),
        code: z.string().max(50000),
        language: z.enum(['python', 'javascript', 'java', 'cpp', 'go']),
    }),
    createBattle: z.object({
        type: z.enum(['1v1', '2v2', 'ffa']).optional(),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        duration: z.number().min(60).max(7200).optional(),
    }),
};

export const validate = (schemaName: keyof typeof schemas) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const parsed = schemas[schemaName].parse(req.body);
            req.body = parsed;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};
