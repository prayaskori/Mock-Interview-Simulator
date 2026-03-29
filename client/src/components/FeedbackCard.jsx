import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiTarget } from 'react-icons/fi';
import ScoreCircle from './ScoreCircle';

export default function FeedbackCard({ evaluation, onContinue, isLastQuestion }) {
  if (!evaluation) return null;

  const { score, strengths, weaknesses, suggestions } = evaluation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-8 space-y-8"
    >
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Answer Evaluation</h3>
          <p className="text-slate-400 text-sm">AI-powered feedback on your response</p>
        </div>
        <ScoreCircle score={score} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Strengths */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <FiCheckCircle className="text-emerald-400 text-lg" />
          </div>
          <h4 className="font-semibold text-emerald-400">Strengths</h4>
        </div>
        <ul className="space-y-2 ml-1">
          {strengths?.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-2 text-sm text-slate-300"
            >
              <span className="text-emerald-500 mt-0.5">▸</span>
              {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Weaknesses */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-red-500/10">
            <FiAlertCircle className="text-red-400 text-lg" />
          </div>
          <h4 className="font-semibold text-red-400">Areas for Improvement</h4>
        </div>
        <ul className="space-y-2 ml-1">
          {weaknesses?.map((w, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-2 text-sm text-slate-300"
            >
              <span className="text-red-500 mt-0.5">▸</span>
              {w}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/10">
            <FiTarget className="text-indigo-400 text-lg" />
          </div>
          <h4 className="font-semibold text-indigo-400">Suggestions</h4>
        </div>
        <ul className="space-y-2 ml-1">
          {suggestions?.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-start gap-2 text-sm text-slate-300"
            >
              <span className="text-indigo-500 mt-0.5">▸</span>
              {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-2"
      >
        <button onClick={onContinue} className="btn-primary w-full text-center">
          {isLastQuestion ? '📊 View Session Summary' : '➡️ Next Question'}
        </button>
      </motion.div>
    </motion.div>
  );
}
