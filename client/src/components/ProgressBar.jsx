import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400 font-medium">
          Question {Math.min(current, total)} of {total}
        </span>
        <span className="text-sm text-indigo-400 font-semibold tabular-nums">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
