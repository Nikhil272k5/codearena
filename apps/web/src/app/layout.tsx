import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'CodeArena — Competitive Programming Metaverse',
    description: 'Real-time competitive programming platform with live battles, guilds, voice chat, and AI assistance.',
    keywords: ['competitive programming', 'coding battles', 'leetcode', 'codeforces', 'algorithm'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="bg-arena-bg text-white antialiased">
                {children}
            </body>
        </html>
    );
}
