'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  startTime: number;
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ startTime, durationMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const durationMs = durationMinutes * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = durationMs - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onTimeUp();
      } else {
        setTimeLeft(remaining);
        // Warn if less than 5 minutes
        if (remaining < 5 * 60 * 1000) {
          setIsWarning(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold text-lg border ${
      isWarning ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-200'
    }`}>
      <Clock className="w-5 h-5 mr-2" />
      {formatTime(timeLeft)}
    </div>
  );
}
