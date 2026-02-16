'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { useUserStore } from '@/stores/user-store';
import { cn, getRatingColor, formatRating, apiCall } from '@/lib/utils';

interface LeaderboardEntry {
    rank: number;
    id: string;
    username: string;
    rating: number;
    wins: number;
    losses: number;
    totalMatches: number;
    bestStreak: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, id: '1', username: 'AlgorithmKing', rating: 2547, wins: 342, losses: 56, totalMatches: 398, bestStreak: 23 },
    { rank: 2, id: '2', username: 'DPMaster', rating: 2489, wins: 298, losses: 61, totalMatches: 359, bestStreak: 19 },
    { rank: 3, id: '3', username: 'GraphWizard', rating: 2401, wins: 276, losses: 73, totalMatches: 349, bestStreak: 16 },
    { rank: 4, id: '4', username: 'RecursionGod', rating: 2356, wins: 251, losses: 82, totalMatches: 333, bestStreak: 14 },
    { rank: 5, id: '5', username: 'BitManipulator', rating: 2298, wins: 234, losses: 89, totalMatches: 323, bestStreak: 12 },
    { rank: 6, id: '6', username: 'TreeTraverser', rating: 2201, wins: 210, losses: 95, totalMatches: 305, bestStreak: 11 },
    { rank: 7, id: '7', username: 'SortMaster', rating: 2156, wins: 198, losses: 102, totalMatches: 300, bestStreak: 10 },
    { rank: 8, id: '8', username: 'BinarySearch', rating: 2089, wins: 178, losses: 112, totalMatches: 290, bestStreak: 9 },
    { rank: 9, id: '9', username: 'StackOverflow', rating: 1987, wins: 156, losses: 123, totalMatches: 279, bestStreak: 8 },
    { rank: 10, id: '10', username: 'QueueRunner', rating: 1923, wins: 145, losses: 134, totalMatches: 279, bestStreak: 7 },
];

export default function LeaderboardPage() {
    const { loadFromStorage } = useUserStore();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

    useEffect(() => {
        loadFromStorage();
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await apiCall('/api/leaderboard?limit=50');
            if (data.leaderboard?.length > 0) {
                setLeaderboard(data.leaderboard);
            }
        } catch {
            // Use mock data
        }
    };

    const rankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="min-h-screen bg-arena-bg">
            <Navbar />
            <Sidebar />

            <main className="ml-[72px] p-6 lg:p-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🏆 Global Leaderboard</h1>
                    <p className="text-gray-500">Top competitive programmers ranked by ELO rating</p>
                </div>

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[1, 0, 2].map((orderIdx, i) => {
                            const player = leaderboard[orderIdx];
                            if (!player) return null;
                            const heights = ['h-32', 'h-40', 'h-28'];
                            const gradients = [
                                'from-gray-400/20 to-gray-500/20 border-gray-400/30',
                                'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
                                'from-orange-700/20 to-orange-800/20 border-orange-700/30',
                            ];

                            return (
                                <div key={player.id} className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-lg font-bold mb-3 shadow-lg">
                                        {player.username?.[0] ?? '?'}
                                    </div>
                                    <span className="text-sm font-bold text-white mb-1">{player.username}</span>
                                    <span className={cn('text-sm font-bold mb-2', getRatingColor(player.rating))}>{player.rating}</span>
                                    <div className={cn('w-full rounded-t-xl border flex items-end justify-center pb-3', heights[i], gradients[i])}>
                                        <span className="text-2xl">{rankBadge(orderIdx + 1)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Full Leaderboard Table */}
                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-arena-border">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">W/L</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Win Rate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Best Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry) => (
                                <tr key={entry.id} className="border-b border-arena-border/50 hover:bg-arena-surface/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-lg">{rankBadge(entry.rank)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-xs font-bold">
                                                {entry.username[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">{entry.username}</div>
                                                <div className={cn('text-xs', getRatingColor(entry.rating))}>{formatRating(entry.rating)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={cn('px-6 py-4 font-bold font-mono', getRatingColor(entry.rating))}>
                                        {entry.rating}
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-arena-success">{entry.wins}</span>
                                        <span className="text-gray-600 mx-1">/</span>
                                        <span className="text-arena-danger">{entry.losses}</span>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-400">
                                        {entry.totalMatches > 0 ? ((entry.wins / entry.totalMatches) * 100).toFixed(1) : 0}%
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-sm text-arena-warning">🔥 {entry.bestStreak}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
