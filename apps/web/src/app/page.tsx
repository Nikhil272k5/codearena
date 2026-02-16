'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/user-store';

export default function Home() {
    const { loadFromStorage, isAuthenticated } = useUserStore();

    useEffect(() => {
        loadFromStorage();
    }, []);

    return (
        <div className="min-h-screen bg-arena-bg relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid opacity-20" />

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-arena-accent/10 blur-[128px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-arena-glow/10 blur-[128px]" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-arena-glow/30">
                        ⚔
                    </div>
                    <span className="text-2xl font-bold gradient-text">CodeArena</span>
                </div>
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link href="/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-lg font-medium hover:opacity-90 transition shadow-lg shadow-arena-glow/20">
                            Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="px-5 py-2.5 text-gray-300 hover:text-white transition font-medium">Login</Link>
                            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-lg font-medium hover:opacity-90 transition shadow-lg shadow-arena-glow/20">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-arena-accent/10 border border-arena-accent/20 text-arena-glow text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-arena-success animate-pulse" />
                        Live Battles Available Now
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                        <span className="text-white">Code.</span>{' '}
                        <span className="gradient-text">Compete.</span>{' '}
                        <span className="text-white">Conquer.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        The ultimate real-time competitive programming metaverse. Join guilds, battle coders worldwide, climb the leaderboard, and prove your algorithmic mastery.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Link
                            href="/register"
                            className="group px-8 py-4 bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-xl shadow-arena-glow/25 hover:shadow-arena-glow/40 hover:-translate-y-0.5"
                        >
                            Start Battling
                            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            href="/dashboard/leaderboard"
                            className="px-8 py-4 glass rounded-xl font-semibold text-lg text-gray-300 hover:text-white hover:border-arena-accent/30 transition-all"
                        >
                            View Leaderboard
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-4xl mx-auto">
                    {[
                        { label: 'Active Coders', value: '10,000+', icon: '👨‍💻' },
                        { label: 'Battles Fought', value: '50,000+', icon: '⚔️' },
                        { label: 'Problems', value: '1,000+', icon: '🧩' },
                        { label: 'Guilds', value: '500+', icon: '🏰' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass rounded-xl p-5 text-center hover:glow-border transition-all duration-300">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
                    {[
                        {
                            icon: '⚡',
                            title: 'Real-Time Battles',
                            desc: '1v1 and team battles with synchronized timers, live progress tracking, and instant code execution.',
                            gradient: 'from-yellow-500/10 to-orange-500/10',
                        },
                        {
                            icon: '🏰',
                            title: 'Guild System',
                            desc: 'Discord-like guilds with text, voice, and battle channels. Build your competitive community.',
                            gradient: 'from-purple-500/10 to-pink-500/10',
                        },
                        {
                            icon: '🤖',
                            title: 'AI-Powered',
                            desc: 'AI referee for code analysis, adaptive opponents, and dynamic problem generation to challenge you.',
                            gradient: 'from-blue-500/10 to-cyan-500/10',
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className={`rounded-xl border border-arena-border p-6 bg-gradient-to-br ${feature.gradient} hover:border-arena-accent/30 transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className="text-3xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-arena-border py-8 text-center text-sm text-gray-600">
                <p>© 2024 CodeArena. Built for competitive programmers.</p>
            </footer>
        </div>
    );
}
