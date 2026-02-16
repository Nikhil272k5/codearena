'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const sidebarLinks = [
    { icon: '🏠', label: 'Dashboard', href: '/dashboard' },
    { icon: '⚔️', label: 'Battles', href: '/dashboard' },
    { icon: '🏰', label: 'Guilds', href: '/guilds' },
    { icon: '🏆', label: 'Leaderboard', href: '/leaderboard' },
    { icon: '👤', label: 'Profile', href: '/profile' },
];

const guildIcons = [
    { name: 'DP Masters', color: 'from-purple-500 to-pink-500', initial: 'DP' },
    { name: 'Graph Theory', color: 'from-blue-500 to-cyan-500', initial: 'GT' },
    { name: 'Competitive', color: 'from-green-500 to-emerald-500', initial: 'CP' },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-16 w-[72px] h-[calc(100vh-64px)] glass-strong border-r border-arena-border flex flex-col items-center py-4 gap-2 z-40 overflow-y-auto">
            {/* Guild Icons */}
            {guildIcons.map((guild) => (
                <button
                    key={guild.name}
                    title={guild.name}
                    className="w-12 h-12 rounded-2xl hover:rounded-xl bg-arena-surface hover:bg-gradient-to-br hover:from-arena-accent hover:to-arena-glow transition-all duration-200 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white group relative"
                >
                    {guild.initial}
                    <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-arena-card text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-arena-border">
                        {guild.name}
                    </span>
                </button>
            ))}

            {/* Divider */}
            <div className="w-8 h-px bg-arena-border my-1" />

            {/* Add Guild */}
            <button className="w-12 h-12 rounded-2xl hover:rounded-xl bg-arena-surface hover:bg-arena-success/20 transition-all duration-200 flex items-center justify-center text-arena-success text-xl group relative">
                +
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-arena-card text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-arena-border">
                    Create Guild
                </span>
            </button>

            {/* Explore */}
            <Link
                href="/guilds"
                className="w-12 h-12 rounded-2xl hover:rounded-xl bg-arena-surface hover:bg-arena-info/20 transition-all duration-200 flex items-center justify-center text-arena-info text-lg group relative"
            >
                🧭
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-arena-card text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-arena-border">
                    Explore Guilds
                </span>
            </Link>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom navigation links */}
            {sidebarLinks.slice(3).map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    title={link.label}
                    className="w-12 h-12 rounded-2xl hover:rounded-xl bg-arena-surface/50 hover:bg-arena-surface transition-all duration-200 flex items-center justify-center text-lg group relative"
                >
                    {link.icon}
                    <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-arena-card text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-arena-border">
                        {link.label}
                    </span>
                </Link>
            ))}
        </aside>
    );
}
