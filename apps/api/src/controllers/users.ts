import { Request, Response } from 'express';
import { User } from '../models/User';

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash -blocked');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('username avatar stats.rating stats.wins stats.losses stats.totalMatches stats.bestStreak')
            .sort({ 'stats.rating': -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            leaderboard: users.map((u, i) => ({
                rank: skip + i + 1,
                id: u._id,
                username: u.username,
                avatar: u.avatar,
                rating: u.stats.rating,
                wins: u.stats.wins,
                losses: u.stats.losses,
                totalMatches: u.stats.totalMatches,
                bestStreak: u.stats.bestStreak,
            })),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { bio, location, website, github, theme, language } = req.body;

        const update: any = {};
        if (bio !== undefined) update['profile.bio'] = bio;
        if (location !== undefined) update['profile.location'] = location;
        if (website !== undefined) update['profile.website'] = website;
        if (github !== undefined) update['profile.github'] = github;
        if (theme !== undefined) update['preferences.theme'] = theme;
        if (language !== undefined) update['preferences.language'] = language;

        const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-passwordHash');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
