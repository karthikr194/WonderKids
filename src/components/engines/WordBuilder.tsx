import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { speak } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { shuffle, sample } from '../../lib/random';
import { Button } from '../ui/Button';
import { SpeakButton } from '../ui/SpeakButton';
import { RoundDots, RoundSummary } from '../ui/RoundSummary';
import type { Level, Theme } from '../../types';

export interface BuildItem {
  key: string;
  /** The tiles that spell the answer, in order. */
  units: string[];
  emoji?: string;
  /** Big display shown instead of / with the emoji (e.g. the numeral "7"). */
  display?: string;
  /** What to say when asking. */
  say: string;
  prompt: string;
}

interface Tile { id: number; text: string }

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

interface Props {
  makeItem: (level: Level) => BuildItem;
  level: Level;
  theme: Theme;
  rounds?: number;
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

function setup(item: BuildItem, level: Level) {
  const extras = level === 1 ? 0 : level === 2 ? 1 : 2;
  const pool = sample(LETTERS, extras, item.units);
  const texts = [...item.units, ...pool];
  let tiles: Tile[];
  let tries = 0;
  do {
    tiles = shuffle(texts).map((text, id) => ({ id, text }));
    tries++;
  } while (tries < 5 && extras === 0 && tiles.map(t => t.text).join('') === item.units.join('') && item.units.length > 1);
  // On level 1, long words get their first tile for free.
  const prefill = level === 1 && item.units.length >= 5 ? 1 : 0;
  const slots: (number | null)[] = Array(item.units.length).fill(null);
  for (let s = 0; s < prefill; s++) {
    const t = tiles.find(t => t.text === item.units[s] && !slots.includes(t.id))!;
    slots[s] = t.id;
  }
  return { tiles, slots, prefill };
}

export function WordBuilder({ makeItem, level, theme, rounds = 6, onResult, onExit }: Props) {
  const seen = useRef(new Set<string>());
  const freshItem = useCallback((): BuildItem => {
    let it = makeItem(level);
    for (let i = 0; i < 6 && seen.current.has(it.key); i++) it = makeItem(level);
    seen.current.add(it.key);
    return it;
  }, [makeItem, level]);

  const [item, setItem] = useState<BuildItem>(freshItem);
  const [state, setState] = useState(() => setup(item, level));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(() => Array(rounds).fill(null));
  const [status, setStatus] = useState<'building' | 'wrong' | 'right'>('building');
  const [missed, setMissed] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => { if (!finished) void speak(item.say); }, [item, finished]);

  const { tiles, slots, prefill } = state;
  const used = new Set(slots.filter((s): s is number => s !== null));

  const place = (tile: Tile) => {
    if (status !== 'building' || used.has(tile.id)) return;
    const at = slots.indexOf(null);
    if (at === -1) return;
    sfx.tap();
    const nextSlots = [...slots];
    nextSlots[at] = tile.id;
    setState(s => ({ ...s, slots: nextSlots }));
    void speak(tile.text, { rate: 0.7 });

    if (!nextSlots.includes(null)) {
      const built = nextSlots.map(id => tiles.find(t => t.id === id)!.text);
      if (built.join('|') === item.units.join('|')) {
        setStatus('right');
        sfx.correct();
        burst();
        if (!missed) { onResult(true); setResults(r => r.map((v, i) => (i === index ? true : v))); }
        void speak(item.units.join(''), { rate: 0.8 });
      } else {
        setStatus('wrong');
        sfx.wrong();
        if (!missed) { onResult(false); setResults(r => r.map((v, i) => (i === index ? false : v))); }
        setMissed(true);
        setTimeout(() => {
          setState(s => ({ ...s, slots: s.slots.map((id, i) => (i < prefill ? id : null)) }));
          setStatus('building');
        }, 900);
      }
    }
  };

  const remove = (slotIndex: number) => {
    if (status !== 'building' || slotIndex < prefill || slots[slotIndex] === null) return;
    sfx.tap();
    setState(s => ({ ...s, slots: s.slots.map((id, i) => (i === slotIndex ? null : id)) }));
  };

  const load = (it: BuildItem) => {
    setItem(it);
    setState(setup(it, level));
    setStatus('building');
    setMissed(false);
  };

  const next = () => {
    if (index + 1 >= rounds) { setFinished(true); sfx.win(); return; }
    setIndex(i => i + 1);
    load(freshItem());
  };

  const restart = () => {
    seen.current.clear();
    setResults(Array(rounds).fill(null));
    setIndex(0);
    setFinished(false);
    load(freshItem());
  };

  if (finished) {
    return <RoundSummary correct={results.filter(r => r === true).length} total={rounds} onAgain={restart} onExit={onExit} />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <RoundDots total={rounds} index={index} results={results} />
      <div className="rounded-[2rem] bg-white p-5 text-center shadow-xl sm:p-8">
        <h2 className="mb-2 text-2xl font-black text-slate-700 sm:text-3xl">{item.prompt}</h2>
        <div className="mb-2 flex items-center justify-center gap-4">
          {item.display && <span className={`text-7xl font-black ${theme.text}`}>{item.display}</span>}
          {item.emoji && <span className="text-8xl" aria-hidden>{item.emoji}</span>}
        </div>
        <SpeakButton onClick={() => void speak(item.say)} className="mb-6" />

        {/* answer slots */}
        <motion.div
          animate={status === 'wrong' ? { x: [0, -10, 10, -8, 8, 0] } : {}}
          className="mb-6 flex flex-wrap justify-center gap-2"
        >
          {slots.map((id, i) => {
            const tile = id === null ? null : tiles.find(t => t.id === id)!;
            return (
              <button
                key={i}
                data-slot={i}
                type="button"
                onClick={() => remove(i)}
                aria-label={tile ? `Remove ${tile.text}` : 'Empty slot'}
                className={`flex h-16 min-w-14 items-center justify-center rounded-2xl border-4 px-3 text-4xl font-black sm:h-20 sm:min-w-16 sm:text-5xl
                  ${status === 'right' ? 'border-green-500 bg-green-100 text-green-700'
                    : status === 'wrong' ? 'border-orange-400 bg-orange-50 text-orange-500'
                    : tile ? `${theme.border} ${theme.soft} ${theme.text}` : 'border-dashed border-slate-300 bg-slate-50'}`}
              >
                {tile?.text}
              </button>
            );
          })}
        </motion.div>

        {/* tile tray */}
        <div className="flex flex-wrap justify-center gap-3">
          {tiles.map(tile => (
            <motion.button
              key={tile.id}
              data-tile={tile.text}
              type="button"
              layout
              whileTap={{ scale: 0.9 }}
              disabled={used.has(tile.id) || status !== 'building'}
              onClick={() => place(tile)}
              className={`h-16 min-w-14 rounded-2xl border-b-[6px] px-3 text-4xl font-black text-white shadow-md sm:h-20 sm:min-w-16 sm:text-5xl
                ${theme.solid} border-black/20 disabled:opacity-25`}
            >
              {tile.text}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {status === 'right' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <p className="mb-3 text-2xl font-black text-green-600">{item.units.join('')} ✔</p>
              <Button size="lg" variant="success" onClick={next}>{index + 1 >= rounds ? 'Finish 🎉' : 'Next ➜'}</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
