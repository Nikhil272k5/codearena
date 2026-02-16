import { create } from 'zustand';
import { Battle, BattlePlayer } from '@/types/models';

interface BattleState {
    currentBattle: Battle | null;
    code: string;
    language: string;
    isSubmitting: boolean;
    submissionResult: any | null;
    opponentProgress: { testsPassed: number; totalTests: number; codeSize: number } | null;
    timeRemaining: number;

    setBattle: (battle: Battle) => void;
    setCode: (code: string) => void;
    setLanguage: (language: string) => void;
    setSubmitting: (submitting: boolean) => void;
    setSubmissionResult: (result: any) => void;
    setOpponentProgress: (progress: { testsPassed: number; totalTests: number; codeSize: number }) => void;
    setTimeRemaining: (time: number) => void;
    resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
    currentBattle: null,
    code: '',
    language: 'python',
    isSubmitting: false,
    submissionResult: null,
    opponentProgress: null,
    timeRemaining: 1800,

    setBattle: (battle) => set({ currentBattle: battle }),
    setCode: (code) => set({ code }),
    setLanguage: (language) => set({ language }),
    setSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setSubmissionResult: (result) => set({ submissionResult: result, isSubmitting: false }),
    setOpponentProgress: (progress) => set({ opponentProgress: progress }),
    setTimeRemaining: (time) => set({ timeRemaining: time }),
    resetBattle: () =>
        set({
            currentBattle: null,
            code: '',
            isSubmitting: false,
            submissionResult: null,
            opponentProgress: null,
            timeRemaining: 1800,
        }),
}));
