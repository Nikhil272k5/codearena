'use client';

import { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import BattleTimer from '@/components/battle/BattleTimer';
import ProgressBar from '@/components/battle/ProgressBar';
import { cn, getDifficultyColor } from '@/lib/utils';

export default function BattleRoomPage({ params }: { params: { id: string } }) {
    const [code, setCode] = useState('# Write your solution here\n\ndef solve():\n    pass\n');
    const [language, setLanguage] = useState('python');
    const [timeRemaining] = useState(1800);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const problem = {
        title: 'Two Sum',
        difficulty: 'easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    };

    const handleSubmit = () => {
        setSubmitting(true);
        setTimeout(() => {
            setResult({ totalPassed: 3, totalTests: 5, success: false, overallExecutionTime: 42 });
            setSubmitting(false);
        }, 2000);
    };

    return (
        <div className="h-screen bg-arena-bg flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 glass-strong border-b border-arena-border">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold gradient-text">⚔ CodeArena</span>
                    <div className="h-5 w-px bg-arena-border" />
                    <span className="text-sm text-white font-medium">{problem.title}</span>
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getDifficultyColor(problem.difficulty), 'bg-current/10')}>
                        {problem.difficulty}
                    </span>
                </div>
                <div className="flex-1 max-w-md mx-8">
                    <BattleTimer remaining={timeRemaining} duration={1800} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-arena-success animate-pulse" />
                        <span className="text-gray-400">vs </span>
                        <span className="text-white font-medium">OpponentUser</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Panel */}
                <div className="w-[40%] border-r border-arena-border overflow-y-auto p-6">
                    <h2 className="text-xl font-bold text-white mb-4">{problem.title}</h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{problem.description}</p>

                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Examples</h3>
                    {problem.examples.map((ex, i) => (
                        <div key={i} className="bg-arena-surface rounded-lg p-4 mb-4 font-mono text-sm">
                            <div className="text-gray-400 mb-1">Input: <span className="text-white">{ex.input}</span></div>
                            <div className="text-gray-400 mb-1">Output: <span className="text-arena-success">{ex.output}</span></div>
                            {ex.explanation && <div className="text-gray-500 text-xs mt-2">Explanation: {ex.explanation}</div>}
                        </div>
                    ))}

                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Constraints</h3>
                    <ul className="space-y-1">
                        {problem.constraints.map((c, i) => (
                            <li key={i} className="text-sm text-gray-400 font-mono">• {c}</li>
                        ))}
                    </ul>
                </div>

                {/* Editor Panel */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                        <CodeEditor value={code} language={language} onChange={setCode} onLanguageChange={setLanguage} />
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-arena-border p-4 flex items-center justify-between glass-strong">
                        <div className="flex items-center gap-4">
                            {result && <ProgressBar passed={result.totalPassed} total={result.totalTests} label="Tests" className="w-48" />}
                            {result && <span className="text-xs text-gray-500 font-mono">{result.overallExecutionTime}ms</span>}
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2.5 rounded-lg border border-arena-border text-sm font-medium text-gray-400 hover:text-white hover:border-arena-accent/50 transition-all">
                                Run Tests
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2.5 bg-gradient-to-r from-arena-accent to-arena-glow text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-arena-glow/20"
                            >
                                {submitting ? 'Submitting...' : 'Submit Solution'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
