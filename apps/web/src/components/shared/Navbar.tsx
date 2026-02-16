'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/user-store';
import { usePresence } from '@/hooks/use-presence';
import { cn, formatRating, getRatingColor } from '@/lib/utils';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useUserStore();
    const { onlineCount } = usePresence();

    return (
        <nav className="sticky top-0 z-50 glass-strong border-b border-arena-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-arena-glow/20 group-hover:shadow-arena-glow/40 transition-shadow">
                            ⚔
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">CodeArena</span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/dashboard">Dashboard</NavLink>
                        <NavLink href="/guilds">Guilds</NavLink>
                        <NavLink href="/leaderboard">Leaderboard</NavLink>
                        <div className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-full bg-arena-success/10 text-arena-success text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-arena-success animate-pulse" />
                            {onlineCount} online
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <>
                                {/* Tokens */}
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-arena-surface border border-arena-border">
                                    <span className="text-yellow-500">🪙</span>
                                    <span className="text-sm font-semibold">{user.wallet.tokens}</span>
                                </div>

                                {/* Rating */}
                                <div className={cn('hidden sm:block text-sm font-bold', getRatingColor(user.stats.rating))}>
                                    {user.stats.rating} <span className="text-xs text-gray-500">({formatRating(user.stats.rating)})</span>
                                </div>

                                {/* Profile */}
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-arena-surface transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-sm font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium hidden lg:block">{user.username}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-arena-glow/20"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-arena-surface/50 transition-all"
        >
            {children}
        </Link>
    );
}
