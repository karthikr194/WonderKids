import { BigEmoji } from '../ui/Visuals';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { speak } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { shuffle, sample } from '../../lib/random';
import { Button } from '../ui/Button';
import { MascotSays } from '../ui/Mascot';
import { FeedbackSheet, RoundProgress, RoundSummary } from '../ui/RoundSummary';
import type { Level } from '../../types';

export interface BuildItem {
  key: string;
  /** The tiles that spell the answer, in order. */
  units: string[];
  emoji?: string;
  /** Big display shown with / instead of the emoji (e.g. the numeral "7"). */
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
  rounds?: number;
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

function setup(item: BuildItem, level: Level) {
  const extras = level === 1 ? 0 : level === 2 ? 1 : 2;
  const texts = [...item.units, ...sample(LETTERS, extras, item.units)];
  let tiles: Tile[];
  let tries = 0;
  do {
    tiles = shuffle(texts).map((text, id) => ({ id, text }));
    tries++;
  } while (tries < 5 && extras === 0 && item.units.length > 1 && tiles.map(t => t.text).join('') === item.units.join(''));
  // On level 1, long words get their first tile for free.
  const prefill = level === 1 && item.units.length >= 5 ? 1 : 0;
  const slots: (number | null)[] = Array(item.units.length).fill(null);
  for (let s = 0; s < prefill; s++) slots[s] = tiles.find(t => t.text === item.units[s] && !slots.includes(t.id))!.id;
  return { tiles, slots, prefill };
}

export function WordBuilder({ makeItem, level, rounds = 6, onResult, onExit }: Props) {
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
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => { if (!finished) void speak(item.say); }, [item, finished]);

  const { tiles, slots, prefill } = state;
  const used = new Set(slots.filter((s): s is number => s !== null));
  const mark = (ok: boolean) => setResults(r => r.map((v, i) => (i === index ? ok : v)));

  const place = (tile: Tile) => {
    if (status !== 'building' || used.has(tile.id)) return;
    const at = slots.indexOf(null);
    if (at === -1) return;
    sfx.tap();
    const nextSlots = [...slots];
    nextSlots[at] = tile.id;
    setState(s => ({ ...s, slots: nextSlots }));
    void speak(tile.text, { rate: 0.7 });

    if (nextSlots.includes(null)) return;
    const built = nextSlots.map(id => tiles.find(t => t.id === id)!.text);
    if (built.join('|') === item.units.join('|')) {
      setStatus('right');
      sfx.correct();
      burst();
      if (!missed) { onResult(true); mark(true); }
      void speak(item.units.join(''), { rate: 0.8 });
    } else {
      setStatus('wrong');
      sfx.wrong();
      if (!missed) { onResult(false); mark(false); }
      setMissed(true);
      timer.current = setTimeout(() => {
        setState(s => ({ ...s, slots: s.slots.map((id, i) => (i < prefill ? id : null)) }));
        setStatus('building');
      }, 1100);
    }
  };

  const remove = (slotIndex: number) => {
    if (status !== 'building' || slotIndex < prefill || slots[slotIndex] === null) return;
    sfx.tap();
    setState(s => ({ ...s, slots: s.slots.map((id, i) => (i === slotIndex ? null : id)) }));
  };

  const backspace = () => {
    const last = slots.map((id, i) => (id !== null && i >= prefill ? i : -1)).filter(i => i >= 0).pop();
    if (last !== undefined) remove(last);
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
    <div className={`mx-auto w-full max-w-2xl ${status === 'right' ? 'pb-44 sm:pb-32' : 'pb-8'}`}>
      <RoundProgress total={rounds} index={index} results={results} />
      <div className="mb-5"><MascotSays onSpeak={() => void speak(item.say)}>{item.prompt}</MascotSays></div>

      <div className="chunky mb-6 flex min-h-36 items-center justify-center gap-5 rounded-[2rem] bg-accent-soft p-5">
        {item.display && <span className="text-8xl font-black text-accent-deep">{item.display}</span>}
        {item.emoji && <BigEmoji>{item.emoji}</BigEmoji>}
      </div>

      {/* answer slots */}
      <motion.div
        animate={status === 'wrong' ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        className="mb-6 flex flex-wrap items-center justify-center gap-2"
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
              className={`flex h-16 min-w-14 items-center justify-center rounded-2xl border-[3px] px-3 text-4xl font-black sm:h-20 sm:min-w-16 sm:text-5xl
                ${status === 'right' ? 'border-ink bg-good-soft text-ink'
                  : status === 'wrong' ? 'border-ink bg-oops-soft text-ink'
                  : tile ? 'border-ink bg-paper text-accent-deep' : 'border-dashed border-ink/30 bg-paper/60'}
                ${i < prefill ? 'opacity-70' : ''}`}
            >
              {tile?.text}
            </button>
          );
        })}
        <button
          type="button"
          onClick={backspace}
          aria-label="Undo last tile"
          disabled={status !== 'building' || slots.every((s, i) => s === null || i < prefill)}
          className="chunky-sm ml-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-paper disabled:opacity-30"
        >
          <Delete size={22} />
        </button>
      </motion.div>

      {/* tile tray */}
      <div className="flex flex-wrap justify-center gap-3 rounded-[2rem] bg-ink/5 p-4">
        {tiles.map(tile => (
          <button
            key={tile.id}
            data-tile={tile.text}
            type="button"
            disabled={used.has(tile.id) || status !== 'building'}
            onClick={() => place(tile)}
            className={`chunky h-16 min-w-14 rounded-2xl bg-accent px-3 text-4xl font-black text-white sm:h-20 sm:min-w-16 sm:text-5xl
              ${used.has(tile.id) ? 'invisible' : ''}`}
          >
            {tile.text}
          </button>
        ))}
      </div>

      <FeedbackSheet
        show={status === 'right'}
        tone="good"
        title={`${item.units.join('')} – perfect!`}
        action={<Button size="lg" variant="good" className="sm:w-56" onClick={next}>{index + 1 >= rounds ? 'Finish 🎉' : 'Next ➜'}</Button>}
      />
      <FeedbackSheet show={status === 'wrong'} tone="oops" title="Not quite!">Listen again and try once more.</FeedbackSheet>
    </div>
  );
}
