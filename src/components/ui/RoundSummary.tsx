import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Check, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { MascotAvatar } from './Mascot';

export function starsFor(correct: number, total: number) {
  const pct = total ? correct / total : 0;
  return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
}

const CHEERS = { 3: 'Superstar!', 2: 'Great work!', 1: 'Nice try – keep going!' } as const;

export function RoundSummary({ correct, total, onAgain, onExit }: {
  correct: number; total: number; onAgain: () => void; onExit: () => void;
}) {
  const stars = starsFor(correct, total) as 1 | 2 | 3;
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="chunky mx-auto mt-4 max-w-md rounded-[2.5rem] bg-paper p-7 text-center sm:p-9"
    >
      <div className="mb-3 flex justify-center"><MascotAvatar size="lg" /></div>
      <h2 className="text-4xl font-black text-ink">{CHEERS[stars]}</h2>
      <div className="my-5 flex items-end justify-center gap-1" aria-label={`${stars} of 3 stars`}>
        {[1, 2, 3].map(n => (
          <motion.div
            key={n}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + n * 0.2, type: 'spring' }}
            className={n === 2 ? '-translate-y-3' : ''}
          >
            <Star size={n === 2 ? 76 : 60} strokeWidth={2.5}
              className={n <= stars ? 'fill-sun text-ink' : 'fill-ink/5 text-ink/25'} />
          </motion.div>
        ))}
      </div>
      <div className="mb-6 flex justify-center gap-3">
        <span className="chunky-sm rounded-2xl bg-good-soft px-4 py-2 text-lg font-bold">✅ {correct} first try</span>
        <span className="chunky-sm rounded-2xl bg-accent-soft px-4 py-2 text-lg font-bold">🎯 {total} questions</span>
      </div>
      <div className="flex flex-col gap-3">
        <Button size="lg" variant="good" onClick={onAgain}><RotateCcw className="mr-2 inline" size={22} />Play again</Button>
        <Button size="lg" variant="paper" onClick={onExit}>Done</Button>
      </div>
    </motion.div>
  );
}

/** Progress bar with a marker per question: green = first-try correct, orange = needed another go. */
export function RoundProgress({ total, index, results }: { total: number; index: number; results: (boolean | null)[] }) {
  return (
    <div className="mb-5 flex items-center gap-3" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
      <div className="chunky-sm flex h-6 flex-1 gap-1 overflow-hidden rounded-full bg-paper p-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-full flex-1 rounded-full transition-colors duration-300
              ${results[i] === true ? 'bg-good' : results[i] === false ? 'bg-oops' : i === index ? 'bg-accent/40' : 'bg-ink/5'}`}
          />
        ))}
      </div>
      <span className="text-lg font-black tabular-nums text-ink-soft">{Math.min(index + 1, total)}/{total}</span>
    </div>
  );
}

/** Bottom sheet for answer feedback. */
export function FeedbackSheet({ show, tone, title, children, action }: {
  show: boolean; tone: 'good' | 'oops'; title: string; children?: ReactNode; action?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink pb-[max(1rem,env(safe-area-inset-bottom))] pt-4
            ${tone === 'good' ? 'bg-good-soft' : 'bg-oops-soft'}`}
          role="status"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <span className={`chunky-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white ${tone === 'good' ? 'bg-good' : 'bg-oops'}`}>
                {tone === 'good' ? <Check size={28} strokeWidth={3.5} /> : <RotateCcw size={24} strokeWidth={3} />}
              </span>
              <div>
                <p className="text-2xl font-black text-ink">{title}</p>
                {children && <p className="text-base font-semibold text-ink-soft sm:text-lg">{children}</p>}
              </div>
            </div>
            {action}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
