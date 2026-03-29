import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-6 py-12"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20" />
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-transparent border-t-violet-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="text-lg text-indigo-300/80"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            ●
          </motion.span>
        ))}
      </div>
      <p className="text-indigo-300/80 text-sm font-medium tracking-wide">{message}</p>
    </motion.div>
  );
}
