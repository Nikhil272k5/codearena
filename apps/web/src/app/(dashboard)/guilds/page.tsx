'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { useUserStore } from '@/stores/user-store';
import { apiCall } from '@/lib/utils';

interface GuildCard {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    tags: string[];
    visibility: string;
}

const MOCK_GUILDS: GuildCard[] = [
    { id: '1', name: 'Dynamic Programming Masters', description: 'Master the art of DP with weekly challenges and discussions', memberCount: 234, tags: ['dp', 'advanced'], visibility: 'public' },
    { id: '2', name: 'Graph Theory Club', description: 'BFS, DFS, shortest paths, and network flows', memberCount: 189, tags: ['graphs', 'algorithms'], visibility: 'public' },
    { id: '3', name: 'Competitive Beginners', description: 'A safe space for newcomers to competitive programming', memberCount: 567, tags: ['beginner', 'learning'], visibility: 'public' },
    { id: '4', name: 'Binary Search Society', description: 'Everything about searching, sorting, and optimization', memberCount: 145, tags: ['binary-search', 'sorting'], visibility: 'public' },
    { id: '5', name: 'String Algorithms', description: 'KMP, Rabin-Karp, suffix arrays, and more', memberCount: 98, tags: ['strings', 'advanced'], visibility: 'public' },
    { id: '6', name: 'Weekly Contest Warriors', description: 'Practice and discuss weekly contest problems', memberCount: 412, tags: ['contests', 'practice'], visibility: 'public' },
];

export default function GuildsPage() {
    const { loadFromStorage } = useUserStore();
    const [guilds, setGuilds] = useState<GuildCard[]>(MOCK_GUILDS);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadFromStorage();
        loadGuilds();
    }, []);

    const loadGuilds = async () => {
        try {
            const data = await apiCall('/api/guilds?limit=20');
            if (data.guilds?.length > 0) {
                setGuilds(data.guilds);
            }
        } catch {
            // Use mock data
        }
    };

    const filtered = guilds.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.tags.some((t) => t.includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-arena-bg">
            <Navbar />
            <Sidebar />

            <main className="ml-[72px] p-6 lg:p-8 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">🏰 Guilds</h1>
                        <p className="text-gray-500">Join a community of competitive programmers</p>
                    </div>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-lg font-medium hover:opacity-90 transition shadow-lg shadow-arena-glow/20">
                        + Create Guild
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search guilds by name or tag..."
                        className="w-full max-w-md px-4 py-3 bg-arena-surface border border-arena-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-arena-accent transition"
                    />
                </div>

                {/* Guild Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((guild) => (
                        <div
                            key={guild.id}
                            className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-arena-accent to-arena-glow flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0">
                                    {guild.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-semibold group-hover:text-arena-glow transition-colors truncate">
                                        {guild.name}
                                    </h3>
                                    <span className="text-xs text-gray-500">{guild.memberCount} members</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{guild.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {guild.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 rounded-md bg-arena-accent/10 text-arena-glow text-xs font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full py-2 rounded-lg border border-arena-border text-sm font-medium text-gray-400 hover:text-white hover:border-arena-accent/50 hover:bg-arena-accent/10 transition-all">
                                Join Guild
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
