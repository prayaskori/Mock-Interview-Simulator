import { useState, useEffect, useRef, useCallback } from 'react';
import { FiClock } from 'react-icons/fi';

export default function Timer({ duration = 300, onExpire, isRunning = true }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  const getColor = () => {
    if (percentage > 50) return 'text-emerald-400';
    if (percentage > 25) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBgColor = () => {
    if (percentage > 50) return 'bg-emerald-500/10 border-emerald-500/20';
    if (percentage > 25) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20 animate-pulse';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getBgColor()} transition-colors duration-500`}>
      <FiClock className={`${getColor()} text-lg`} />
      <span className={`${getColor()} font-mono font-semibold text-lg tabular-nums`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
