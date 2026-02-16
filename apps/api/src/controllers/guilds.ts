import { Request, Response } from 'express';
import { Guild } from '../models/Guild';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const createGuild = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { name, description, tags, visibility } = req.body;

        const guild = new Guild({
            name,
            description: description || '',
            ownerId: userId,
            members: [{ userId, role: 'owner', joinedAt: new Date(), permissions: ['all'] }],
            channels: [
                { name: 'general', type: 'text', position: 0, permissions: {} },
                { name: 'voice', type: 'voice', position: 1, permissions: {} },
                { name: 'arena', type: 'battle', position: 2, permissions: {} },
            ],
            settings: { visibility: visibility || 'public', maxMembers: 100, requireApproval: false },
            tags: tags || [],
            stats: { totalBattles: 0, totalMembers: 1 },
        });

        await guild.save();

        // Add guild to user's guilds
        await User.findByIdAndUpdate(userId, { $push: { guilds: guild._id } });

        logger.info('Guild created', { guildId: guild._id, name, owner: userId });
        res.status(201).json({ guild });
    } catch (error: any) {
        logger.error('Failed to create guild', { error: error.message });
        res.status(500).json({ error: 'Failed to create guild' });
    }
};

export const getGuilds = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
        const search = req.query.search as string;

        const query: any = { 'settings.visibility': 'public' };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tags: { $in: [search.toLowerCase()] } },
            ];
        }

        const guilds = await Guild.find(query)
            .select('name slug description icon tags stats settings.visibility members')
            .sort({ 'stats.totalMembers': -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Guild.countDocuments(query);

        res.json({
            guilds: guilds.map((g) => ({
                id: g._id,
                name: g.name,
                slug: g.slug,
                description: g.description,
                icon: g.icon,
                tags: g.tags,
                memberCount: g.members.length,
                visibility: g.settings.visibility,
            })),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
};

export const getGuild = async (req: Request, res: Response): Promise<void> => {
    try {
        const guild = await Guild.findById(req.params.id).populate('members.userId', 'username avatar stats.rating');
        if (!guild) {
            res.status(404).json({ error: 'Guild not found' });
            return;
        }
        res.json({ guild });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guild' });
    }
};

export const joinGuild = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const guild = await Guild.findById(req.params.id);
        if (!guild) {
            res.status(404).json({ error: 'Guild not found' });
            return;
        }

        const isMember = guild.members.some((m) => m.userId.toString() === userId);
        if (isMember) {
            res.status(400).json({ error: 'Already a member' });
            return;
        }

        guild.members.push({ userId, role: 'member', joinedAt: new Date(), permissions: [] });
        guild.stats.totalMembers = guild.members.length;
        await guild.save();

        await User.findByIdAndUpdate(userId, { $push: { guilds: guild._id } });

        res.json({ message: 'Joined guild successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join guild' });
    }
};
