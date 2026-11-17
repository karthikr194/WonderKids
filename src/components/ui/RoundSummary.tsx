import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from './Button';

export function starsFor(correct: number, total: number) {
  const pct = total ? correct / total : 0;
  return pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
}

export function RoundSummary({ correct, total, onAgain, onExit }: {
  correct: number; total: number; onAgain: () => void; onExit: () => void;
}) {
  const stars = starsFor(correct, total);
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mx-auto mt-6 max-w-md rounded-[2.5rem] bg-white p-8 text-center shadow-xl"
    >
      <h2 className="text-4xl font-black text-slate-700">Round complete!</h2>
      <div className="my-6 flex justify-center gap-2" aria-label={`${stars} of 3 stars`}>
        {[1, 2, 3].map(n => (
          <motion.div
            key={n}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 + n * 0.2, type: 'spring' }}
          >
            <Star size={64} className={n <= stars ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-100 text-slate-300'} />
          </motion.div>
        ))}
      </div>
      <p className="mb-6 text-xl font-semibold text-slate-500">
        You got {correct} out of {total} on the first try.
      </p>
      <div className="flex flex-col gap-3">
        <Button size="lg" variant="success" onClick={onAgain}>Play again 🔁</Button>
        <Button size="lg" variant="ghost" onClick={onExit}>Done</Button>
      </div>
    </motion.div>
  );
}

export function RoundDots({ total, index, results }: { total: number; index: number; results: (boolean | null)[] }) {
  return (
    <div className="mb-4 flex justify-center gap-2" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 rounded-full transition-all ${i === index ? 'w-8' : 'w-3.5'}
            ${results[i] === true ? 'bg-green-500' : results[i] === false ? 'bg-orange-400' : i === index ? 'bg-blue-500' : 'bg-white/80'}`}
        />
      ))}
    </div>
  );
}
