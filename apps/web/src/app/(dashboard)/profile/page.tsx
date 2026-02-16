'use client';

import { useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { useUserStore } from '@/stores/user-store';
import { cn, getRatingColor, formatRating } from '@/lib/utils';

export default function ProfilePage() {
    const { user, loadFromStorage } = useUserStore();
    useEffect(() => { loadFromStorage(); }, []);

    const s = user?.stats || { rating: 1000, wins: 0, losses: 0, draws: 0, totalMatches: 0, winStreak: 0, bestStreak: 0, totalSubmissions: 0, successRate: 0 };
    const wr = s.totalMatches > 0 ? ((s.wins / s.totalMatches) * 100).toFixed(1) : '0.0';

    return (
        <div className="min-h-screen bg-arena-bg">
            <Navbar />
            <Sidebar />
            <main className="ml-[72px] p-6 lg:p-8 max-w-4xl">
                <div className="glass rounded-2xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-arena-accent/5 to-arena-glow/5" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-4xl font-bold shadow-xl shadow-arena-glow/20">
                            {user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{user?.username || 'Guest'}</h1>
                            <span className={cn('text-xl font-bold', getRatingColor(s.rating))}>{s.rating} — {formatRating(s.rating)}</span>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full bg-arena-accent/10 text-arena-glow text-xs font-medium">🪙 {user?.wallet?.tokens || 500} tokens</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { l: 'Matches', v: s.totalMatches, i: '⚔️' },
                        { l: 'Wins', v: s.wins, i: '🏆', c: 'text-arena-success' },
                        { l: 'Losses', v: s.losses, i: '💀', c: 'text-arena-danger' },
                        { l: 'Win Rate', v: `${wr}%`, i: '📊' },
                        { l: 'Streak', v: s.winStreak, i: '🔥', c: 'text-arena-warning' },
                        { l: 'Best Streak', v: s.bestStreak, i: '⭐', c: 'text-yellow-500' },
                        { l: 'Submissions', v: s.totalSubmissions, i: '📝' },
                        { l: 'Success', v: `${s.successRate}%`, i: '✅', c: 'text-arena-success' },
                    ].map((st) => (
                        <div key={st.l} className="glass rounded-xl p-4 hover:glow-border transition-all">
                            <div className="text-lg mb-1">{st.i}</div>
                            <div className={cn('text-xl font-bold', st.c || 'text-white')}>{st.v}</div>
                            <div className="text-xs text-gray-500 mt-1">{st.l}</div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
