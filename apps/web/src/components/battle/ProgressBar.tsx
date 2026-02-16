'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
    passed: number;
    total: number;
    label?: string;
    className?: string;
}

export default function ProgressBar({ passed, total, label, className }: ProgressBarProps) {
    const percentage = total > 0 ? (passed / total) * 100 : 0;
    const allPassed = passed === total && total > 0;

    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{label}</span>
                    <span className={cn('font-mono font-semibold', allPassed ? 'text-arena-success' : 'text-white')}>
                        {passed}/{total}
                    </span>
                </div>
            )}
            <div className="h-2 bg-arena-surface rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500',
                        allPassed
                            ? 'bg-arena-success shadow-sm shadow-arena-success/30'
                            : percentage > 50
                                ? 'bg-gradient-to-r from-arena-accent to-arena-glow'
                                : percentage > 0
                                    ? 'bg-arena-warning'
                                    : 'bg-gray-600'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
