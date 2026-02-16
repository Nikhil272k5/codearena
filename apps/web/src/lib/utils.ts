export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatRating(rating: number): string {
    if (rating >= 2400) return 'Grandmaster';
    if (rating >= 2100) return 'Master';
    if (rating >= 1800) return 'Expert';
    if (rating >= 1500) return 'Specialist';
    if (rating >= 1200) return 'Apprentice';
    return 'Beginner';
}

export function getRatingColor(rating: number): string {
    if (rating >= 2400) return 'text-red-500';
    if (rating >= 2100) return 'text-orange-500';
    if (rating >= 1800) return 'text-purple-500';
    if (rating >= 1500) return 'text-blue-500';
    if (rating >= 1200) return 'text-green-500';
    return 'text-gray-400';
}

export function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case 'easy': return 'text-arena-success';
        case 'medium': return 'text-arena-warning';
        case 'hard': return 'text-arena-danger';
        default: return 'text-gray-400';
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'online': return 'bg-green-500';
        case 'coding': return 'bg-blue-500 animate-pulse';
        case 'in-battle': return 'bg-purple-500 animate-pulse';
        case 'idle': return 'bg-yellow-500';
        case 'offline': return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return res.json();
}
