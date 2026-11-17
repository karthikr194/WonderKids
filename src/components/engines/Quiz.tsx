import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { speak, speakSequence } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { pick } from '../../lib/random';
import { Button } from '../ui/Button';
import { MascotSays } from '../ui/Mascot';
import { FeedbackSheet, RoundProgress, RoundSummary } from '../ui/RoundSummary';
import type { Level } from '../../types';

export interface QuizOption {
  id: string;
  label?: string;
  visual?: ReactNode;
  /** Spoken when the option is tapped (defaults to label). */
  speak?: string;
}

export interface QuizQuestion {
  /** Used to avoid asking the same question twice in a round. */
  key: string;
  prompt: string;
  /** Custom audio (e.g. play a phoneme). Defaults to speaking the prompt. */
  audio?: () => void | Promise<void>;
  visual?: ReactNode;
  options: QuizOption[];
  correctId: string;
  explain?: string;
  /** 'big' = visual only, large; 'card' = visual + label; 'chip' = label only */
  optionStyle?: 'big' | 'card' | 'chip';
}

interface Props {
  makeQuestion: (level: Level) => QuizQuestion;
  level: Level;
  rounds?: number;
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

const PRAISE = ['Awesome!', 'Great job!', "You're a star!", 'Fantastic!', 'Super smart!', 'Brilliant!', 'Yes, that’s it!'];
const RETRY = ['Not quite!', 'Almost!', 'Oops!', 'So close!'];

export function Quiz({ makeQuestion, level, rounds = 8, onResult, onExit }: Props) {
  const seen = useRef(new Set<string>());
  const fresh = useCallback((): QuizQuestion => {
    let q = makeQuestion(level);
    for (let i = 0; i < 6 && seen.current.has(q.key); i++) q = makeQuestion(level);
    seen.current.add(q.key);
    return q;
  }, [makeQuestion, level]);

  const [q, setQ] = useState<QuizQuestion>(fresh);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(() => Array(rounds).fill(null));
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [praise, setPraise] = useState('');
  const [oops, setOops] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const oopsTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(oopsTimer.current), []);

  const ask = useCallback((question: QuizQuestion) => {
    if (question.audio) void question.audio();
    else void speak(question.prompt);
  }, []);

  useEffect(() => { if (!finished) ask(q); }, [q, finished, ask]);

  const mark = (ok: boolean) => setResults(r => r.map((v, i) => (i === index ? ok : v)));

  const choose = (opt: QuizOption) => {
    if (solved || wrong.includes(opt.id)) return;
    if (opt.id === q.correctId) {
      const p = pick(PRAISE);
      setPraise(p);
      setSolved(true);
      setOops(null);
      sfx.correct();
      burst();
      if (wrong.length === 0) { onResult(true); mark(true); }
      void speakSequence([p, ...(q.explain ? [{ text: q.explain, rate: 0.85 }] : [])]);
    } else {
      sfx.wrong();
      if (wrong.length === 0) { onResult(false); mark(false); }
      setWrong(w => [...w, opt.id]);
      const msg = pick(RETRY);
      setOops(msg);
      clearTimeout(oopsTimer.current);
      oopsTimer.current = setTimeout(() => setOops(null), 1600);
      void speak(`${msg} Try again.`);
    }
  };

  const next = () => {
    setOops(null);
    if (index + 1 >= rounds) { setFinished(true); sfx.win(); return; }
    setIndex(i => i + 1);
    setWrong([]);
    setSolved(false);
    setQ(fresh());
  };

  const restart = () => {
    seen.current.clear();
    setResults(Array(rounds).fill(null));
    setIndex(0);
    setWrong([]);
    setSolved(false);
    setFinished(false);
    setQ(fresh());
  };

  if (finished) {
    return <RoundSummary correct={results.filter(r => r === true).length} total={rounds} onAgain={restart} onExit={onExit} />;
  }

  const style = q.optionStyle ?? 'card';
  const longest = Math.max(...q.options.map(o => o.label?.length ?? 0));
  const grid = style === 'chip'
    ? (longest > 14 ? 'grid-cols-1 sm:grid-cols-2' : q.options.length === 3 && longest <= 6 ? 'grid-cols-3' : 'grid-cols-2')
    : style === 'big' && q.options.length === 3 ? 'grid-cols-3'
    : q.options.length > 3 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className={`mx-auto w-full max-w-2xl ${solved ? 'pb-44 sm:pb-32' : 'pb-8'}`}>
      <RoundProgress total={rounds} index={index} results={results} />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.key + index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-5"><MascotSays onSpeak={() => ask(q)}>{q.prompt}</MascotSays></div>

          {q.visual && (
            <div className="chunky mb-5 flex min-h-36 items-center justify-center rounded-[2rem] bg-accent-soft p-5">
              {q.visual}
            </div>
          )}

          <div className={`grid gap-3 sm:gap-4 ${grid}`}>
            {q.options.map(opt => {
              const isWrong = wrong.includes(opt.id);
              const isRight = solved && opt.id === q.correctId;
              const dim = solved && !isRight;
              return (
                <motion.button
                  key={opt.id}
                  data-option={opt.id}
                  type="button"
                  disabled={dim || isWrong}
                  animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : isRight ? { scale: [1, 1.06, 1] } : {}}
                  onClick={() => { sfx.tap(); if (opt.speak ?? opt.label) void speak(opt.speak ?? opt.label!); choose(opt); }}
                  className={`chunky relative flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-3xl p-3 font-black
                    ${isRight ? 'bg-good-soft' : isWrong ? 'bg-oops-soft opacity-50' : dim ? 'bg-paper opacity-40' : 'bg-paper hover:bg-accent-soft'}
                    ${style === 'big' ? 'min-h-32 text-6xl' : style === 'chip' ? 'text-2xl' : 'text-xl'}`}
                >
                  {isRight && <span className="absolute right-2 top-2 rounded-full bg-good px-2 text-sm text-white">✓</span>}
                  {opt.visual}
                  {opt.label && <span className={`${style === 'big' ? 'text-lg' : ''} ${isWrong ? 'line-through' : ''}`}>{opt.label}</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <FeedbackSheet
        show={solved}
        tone="good"
        title={praise}
        action={<Button size="lg" variant="good" className="sm:w-56" onClick={next}>{index + 1 >= rounds ? 'Finish 🎉' : 'Next ➜'}</Button>}
      >
        {q.explain}
      </FeedbackSheet>
      <FeedbackSheet show={!solved && oops !== null} tone="oops" title={oops ?? ''}>Try another one.</FeedbackSheet>
    </div>
  );
}
