import { create } from 'zustand';
import { Guild, Channel, ChatMessage } from '@/types/models';

interface GuildState {
    guilds: Guild[];
    currentGuild: Guild | null;
    currentChannel: Channel | null;
    messages: ChatMessage[];
    onlineMembers: string[];

    setGuilds: (guilds: Guild[]) => void;
    setCurrentGuild: (guild: Guild | null) => void;
    setCurrentChannel: (channel: Channel | null) => void;
    addMessage: (message: ChatMessage) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setOnlineMembers: (members: string[]) => void;
}

export const useGuildStore = create<GuildState>((set) => ({
    guilds: [],
    currentGuild: null,
    currentChannel: null,
    messages: [],
    onlineMembers: [],

    setGuilds: (guilds) => set({ guilds }),
    setCurrentGuild: (guild) => set({ currentGuild: guild, currentChannel: guild?.channels?.[0] || null, messages: [] }),
    setCurrentChannel: (channel) => set({ currentChannel: channel, messages: [] }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages) => set({ messages }),
    setOnlineMembers: (members) => set({ onlineMembers: members }),
}));
