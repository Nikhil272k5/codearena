'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/stores/user-store';
import { apiCall } from '@/lib/utils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiCall('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            setUser(data.user, data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-arena-bg flex items-center justify-center relative overflow-hidden px-4">
            {/* Background */}
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-arena-accent/10 blur-[128px]" />
            <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-arena-glow/10 blur-[128px]" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-arena-glow/30">
                            ⚔
                        </div>
                        <span className="text-3xl font-bold gradient-text">CodeArena</span>
                    </Link>
                    <p className="text-gray-500 mt-3">Welcome back, warrior</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
                    <h2 className="text-2xl font-bold text-white">Sign In</h2>

                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-arena-danger/10 border border-arena-danger/20 text-arena-danger text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-arena-surface border border-arena-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-arena-accent transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-arena-surface border border-arena-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-arena-accent transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-arena-accent to-arena-glow text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-arena-glow/20"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        New to CodeArena?{' '}
                        <Link href="/register" className="text-arena-glow hover:text-arena-accent transition">
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
