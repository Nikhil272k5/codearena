'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
    value: string;
    language: string;
    onChange: (value: string) => void;
    onLanguageChange?: (lang: string) => void;
    readOnly?: boolean;
    className?: string;
}

const LANGUAGES = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
];

export default function CodeEditor({ value, language, onChange, onLanguageChange, readOnly, className }: CodeEditorProps) {
    return (
        <div className={cn('flex flex-col rounded-xl overflow-hidden border border-arena-border', className)}>
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-arena-surface border-b border-arena-border">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-arena-danger" />
                        <div className="w-3 h-3 rounded-full bg-arena-warning" />
                        <div className="w-3 h-3 rounded-full bg-arena-success" />
                    </div>
                    <span className="text-xs text-gray-500 ml-2 font-mono">solution.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'go' ? 'go' : 'js'}</span>
                </div>
                {onLanguageChange && (
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="bg-arena-card text-sm text-gray-300 border border-arena-border rounded-lg px-3 py-1 focus:outline-none focus:border-arena-accent"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Monaco Editor */}
            <MonacoEditor
                height="500px"
                language={language === 'cpp' ? 'cpp' : language}
                value={value}
                onChange={(val) => onChange(val || '')}
                theme="vs-dark"
                options={{
                    readOnly,
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    wordWrap: 'on',
                    tabSize: 4,
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
