'use client';

import { cn, getDifficultyColor, formatTime } from '@/lib/utils';

interface BattleCardProps {
    battleId: string;
    type: string;
    problem: { title: string; difficulty: string };
    players: { username: string; rating: number; status: string }[];
    status: string;
    timeRemaining?: number;
    onClick?: () => void;
}

export default function BattleCard({ battleId, type, problem, players, status, timeRemaining, onClick }: BattleCardProps) {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        waiting: { bg: 'bg-arena-warning/10', text: 'text-arena-warning', label: 'Waiting' },
        active: { bg: 'bg-arena-success/10', text: 'text-arena-success', label: 'Live' },
        ended: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Ended' },
        countdown: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Starting' },
    };

    const config = statusConfig[status] || statusConfig.waiting;

    return (
        <div
            onClick={onClick}
            className={cn(
                'group relative rounded-xl border border-arena-border bg-arena-card p-5 cursor-pointer transition-all duration-300',
                'hover:border-arena-accent/50 hover:shadow-lg hover:shadow-arena-accent/5 hover:-translate-y-0.5',
                status === 'active' && 'glow-border'
            )}
        >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-3">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', config.bg, config.text)}>
                    {status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1.5" />}
                    {config.label}
                </span>
                <span className="text-xs text-gray-500 font-mono">{type.toUpperCase()}</span>
            </div>

            {/* Problem Info */}
            <h3 className="text-white font-semibold mb-1 group-hover:text-arena-glow transition-colors">
                {problem.title}
            </h3>
            <span className={cn('text-xs font-medium', getDifficultyColor(problem.difficulty))}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </span>

            {/* Players */}
            <div className="mt-4 flex items-center gap-2">
                {players.map((player, i) => (
                    <div key={i} className="flex items-center gap-2">
                        {i > 0 && <span className="text-gray-600 text-xs font-bold">VS</span>}
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-[10px] font-bold">
                                {player.username[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300">{player.username}</span>
                            <span className="text-xs text-gray-500">{player.rating}</span>
                        </div>
                    </div>
                ))}
                {players.length < 2 && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <span className="text-xs font-bold">VS</span>
                        <span className="text-sm italic">Waiting...</span>
                    </div>
                )}
            </div>

            {/* Timer */}
            {timeRemaining !== undefined && status === 'active' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <span>⏱️</span>
                    <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
            )}
        </div>
    );
}
