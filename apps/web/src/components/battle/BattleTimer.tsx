'use client';

import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BattleTimerProps {
    remaining: number;
    duration: number;
}

export default function BattleTimer({ remaining, duration }: BattleTimerProps) {
    const progress = ((duration - remaining) / duration) * 100;
    const isLow = remaining <= 60;
    const isCritical = remaining <= 30;

    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                'text-2xl font-mono font-bold tabular-nums tracking-wider',
                isCritical ? 'text-arena-danger animate-pulse' : isLow ? 'text-arena-warning' : 'text-white'
            )}>
                {formatTime(remaining)}
            </div>
            <div className="flex-1 h-2 bg-arena-surface rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        isCritical ? 'bg-arena-danger' : isLow ? 'bg-arena-warning' : 'bg-gradient-to-r from-arena-accent to-arena-glow'
                    )}
                    style={{ width: `${100 - progress}%` }}
                />
            </div>
        </div>
    );
}
