import { create } from 'zustand';
import { User } from '@/types/models';

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User, token: string) => void;
    logout: () => void;
    updateStats: (stats: Partial<User['stats']>) => void;
    updateTokens: (tokens: number) => void;
    loadFromStorage: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    },

    updateStats: (stats) => {
        const current = get().user;
        if (current) {
            set({ user: { ...current, stats: { ...current.stats, ...stats } } });
        }
    },

    updateTokens: (tokens) => {
        const current = get().user;
        if (current) {
            set({ user: { ...current, wallet: { tokens } } });
        }
    },

    loadFromStorage: () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    set({ user, token, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ isLoading: false });
                }
            } else {
                set({ isLoading: false });
            }
        }
    },
}));
