'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import BattleCard from '@/components/battle/BattleCard';
import { useUserStore } from '@/stores/user-store';
import { usePresence } from '@/hooks/use-presence';
import { cn, getRatingColor, formatRating, apiCall } from '@/lib/utils';

export default function DashboardPage() {
    const { user, loadFromStorage } = useUserStore();
    const { onlineCount } = usePresence();
    const [activeBattles, setActiveBattles] = useState<any[]>([]);

    useEffect(() => {
        loadFromStorage();
        loadBattles();
    }, []);

    const loadBattles = async () => {
        try {
            const data = await apiCall('/api/battles?status=active&limit=6');
            setActiveBattles(data.battles || []);
        } catch {
            // Use mock battles for demo
            setActiveBattles([
                {
                    battleId: 'demo-1',
                    type: '1v1',
                    problem: { title: 'Two Sum', difficulty: 'easy' },
                    players: [
                        { username: 'AlgoKing', rating: 1847, status: 'active' },
                        { username: 'CodeNinja', rating: 1792, status: 'active' },
                    ],
                    status: 'active',
                    timer: { remaining: 1234 },
                },
                {
                    battleId: 'demo-2',
                    type: '1v1',
                    problem: { title: 'Longest Palindromic Substring', difficulty: 'medium' },
                    players: [
                        { username: 'ByteMaster', rating: 2103, status: 'active' },
                        { username: 'RecursionGod', rating: 2056, status: 'active' },
                    ],
                    status: 'active',
                    timer: { remaining: 876 },
                },
                {
                    battleId: 'demo-3',
                    type: '1v1',
                    problem: { title: 'Merge K Sorted Lists', difficulty: 'hard' },
                    players: [{ username: 'DPWizard', rating: 1623, status: 'waiting' }],
                    status: 'waiting',
                },
            ]);
        }
    };

    return (
        <div className="min-h-screen bg-arena-bg">
            <Navbar />
            <Sidebar />

            <main className="ml-[72px] p-6 lg:p-8 max-w-7xl">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back{user ? `, ${user.username}` : ''}! ⚔️
                    </h1>
                    <p className="text-gray-500">Ready for your next battle?</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Rating', value: user?.stats?.rating || 1000, icon: '📊', color: user ? getRatingColor(user.stats.rating) : 'text-blue-500' },
                        { label: 'Wins', value: user?.stats?.wins || 0, icon: '🏆', color: 'text-arena-success' },
                        { label: 'Battles', value: user?.stats?.totalMatches || 0, icon: '⚔️', color: 'text-arena-accent' },
                        { label: 'Tokens', value: user?.wallet?.tokens || 500, icon: '🪙', color: 'text-yellow-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass rounded-xl p-5 hover:glow-border transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-xs text-gray-600">{stat.label}</span>
                            </div>
                            <div className={cn('text-2xl font-bold', stat.color)}>
                                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <button className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-arena-accent/20 to-arena-glow/20 border border-arena-accent/30 hover:border-arena-accent/60 transition-all duration-300 hover:-translate-y-0.5 text-left">
                        <div className="text-2xl mb-3">⚡</div>
                        <h3 className="text-lg font-bold text-white mb-1">Quick Match</h3>
                        <p className="text-sm text-gray-400">Find an opponent at your skill level</p>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-arena-accent/5 group-hover:bg-arena-accent/10 transition" />
                    </button>

                    <Link href="/dashboard/guilds" className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-0.5 text-left">
                        <div className="text-2xl mb-3">🏰</div>
                        <h3 className="text-lg font-bold text-white mb-1">Join a Guild</h3>
                        <p className="text-sm text-gray-400">Connect with fellow competitors</p>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 transition" />
                    </Link>

                    <Link href="/dashboard/leaderboard" className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:-translate-y-0.5 text-left">
                        <div className="text-2xl mb-3">🏆</div>
                        <h3 className="text-lg font-bold text-white mb-1">Leaderboard</h3>
                        <p className="text-sm text-gray-400">See where you rank globally</p>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-yellow-500/5 group-hover:bg-yellow-500/10 transition" />
                    </Link>
                </div>

                {/* Live Battles */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-arena-success animate-pulse" />
                            Live Battles
                        </h2>
                        <span className="text-sm text-gray-500">{activeBattles.length} active</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeBattles.map((battle) => (
                            <BattleCard
                                key={battle.battleId}
                                battleId={battle.battleId}
                                type={battle.type}
                                problem={battle.problem}
                                players={battle.players}
                                status={battle.status}
                                timeRemaining={battle.timer?.remaining}
                            />
                        ))}
                    </div>
                </div>

                {/* Online indicator */}
                <div className="glass rounded-xl p-5 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-arena-success animate-pulse" />
                    <span className="text-sm text-gray-400">
                        <span className="text-white font-semibold">{onlineCount}</span> coders online right now
                    </span>
                </div>
            </main>
        </div>
    );
}
