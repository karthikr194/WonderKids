import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { speak, speakSequence } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { pick } from '../../lib/random';
import { Button } from '../ui/Button';
import { SpeakButton } from '../ui/SpeakButton';
import { RoundDots, RoundSummary } from '../ui/RoundSummary';
import type { Level, Theme } from '../../types';

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
  theme: Theme;
  rounds?: number;
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

const PRAISE = ['Awesome!', 'Great job!', "You're a star!", 'Fantastic!', 'Super smart!', 'Brilliant!', 'Yes!'];
const RETRY = ['Try again!', 'Almost! Have another go.', 'Oops, try another one.', 'You can do it!'];

export function Quiz({ makeQuestion, level, theme, rounds = 8, onResult, onExit }: Props) {
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
  const [finished, setFinished] = useState(false);

  const ask = useCallback((question: QuizQuestion) => {
    if (question.audio) void question.audio();
    else void speak(question.prompt);
  }, []);

  // Read each new question aloud.
  useEffect(() => { if (!finished) ask(q); }, [q, finished, ask]);

  const choose = (opt: QuizOption) => {
    if (solved || wrong.includes(opt.id)) return;
    if (opt.id === q.correctId) {
      const firstTry = wrong.length === 0;
      setSolved(true);
      sfx.correct();
      burst();
      if (firstTry) {
        onResult(true);
        setResults(r => r.map((v, i) => (i === index ? true : v)));
      }
      void speakSequence([pick(PRAISE), ...(q.explain ? [{ text: q.explain, rate: 0.85 }] : [])]);
    } else {
      sfx.wrong();
      if (wrong.length === 0) {
        onResult(false);
        setResults(r => r.map((v, i) => (i === index ? false : v)));
      }
      setWrong(w => [...w, opt.id]);
      void speak(pick(RETRY));
    }
  };

  const next = () => {
    if (index + 1 >= rounds) {
      setFinished(true);
      sfx.win();
      return;
    }
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
    ? (longest > 14 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2')
    : style === 'big' && q.options.length === 3 ? 'grid-cols-3'
    : q.options.length > 3 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="mx-auto w-full max-w-2xl">
      <RoundDots total={rounds} index={index} results={results} />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.key + index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          className="rounded-[2rem] bg-white p-5 text-center shadow-xl sm:p-8"
        >
          <h2 className="mb-3 text-2xl font-black text-slate-700 sm:text-3xl">{q.prompt}</h2>
          {q.visual && <div className="mb-4 flex justify-center">{q.visual}</div>}
          <SpeakButton onClick={() => ask(q)} className="mb-5" />

          <div className={`grid gap-3 sm:gap-4 ${grid}`}>
            {q.options.map(opt => {
              const isWrong = wrong.includes(opt.id);
              const isRight = solved && opt.id === q.correctId;
              return (
                <motion.button
                  key={opt.id}
                  data-option={opt.id}
                  type="button"
                  disabled={solved && !isRight}
                  whileTap={{ scale: 0.95 }}
                  animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : isRight ? { scale: [1, 1.08, 1] } : {}}
                  onClick={() => { sfx.tap(); if (opt.speak ?? opt.label) void speak(opt.speak ?? opt.label!); choose(opt); }}
                  className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-3xl border-4 border-b-[6px] p-3 font-black transition-colors
                    ${isRight ? 'border-green-500 bg-green-100 text-green-700'
                      : isWrong ? 'border-orange-300 bg-orange-50 text-orange-400 opacity-60'
                      : `bg-white text-slate-700 hover:bg-slate-50 ${theme.border}`}
                    ${style === 'big' ? 'min-h-32 text-6xl' : style === 'chip' ? 'text-2xl' : 'text-xl'}`}
                >
                  {opt.visual}
                  {opt.label && <span className={style === 'big' ? 'text-lg' : ''}>{opt.label}</span>}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {solved && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                {q.explain && <p className="mb-3 text-lg font-semibold text-slate-500">{q.explain}</p>}
                <Button size="lg" variant="success" onClick={next}>
                  {index + 1 >= rounds ? 'Finish 🎉' : 'Next ➜'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
