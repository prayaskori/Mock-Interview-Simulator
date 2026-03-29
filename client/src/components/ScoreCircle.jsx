import { useEffect, useState } from 'react';

export default function ScoreCircle({ score, size = 120, strokeWidth = 8, animated = true }) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (displayScore / 10) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (s) => {
    if (s >= 8) return { stroke: '#10b981', text: '#34d399', bg: 'rgba(16, 185, 129, 0.1)' };
    if (s >= 6) return { stroke: '#6366f1', text: '#818cf8', bg: 'rgba(99, 102, 241, 0.1)' };
    if (s >= 4) return { stroke: '#f59e0b', text: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)' };
    return { stroke: '#ef4444', text: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const colors = getColor(displayScore);

  useEffect(() => {
    if (!animated) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setDisplayScore(Math.round(eased * score * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score, animated]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(99, 102, 241, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Score circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animated ? 'none' : 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color: colors.text }}>
          {displayScore.toFixed(1)}
        </span>
        <span className="text-xs text-slate-400">/10</span>
      </div>
    </div>
  );
}
