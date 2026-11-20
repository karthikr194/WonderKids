import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { Button } from '../components/ui/Button';
import { legacyPicture } from '../learning/legacyPictures';
import { OptionEmoji } from '../components/ui/Visuals';
import { speak } from '../lib/speech';
import { sfx } from '../lib/sfx';
import { burst, fireworks } from '../lib/confetti';
import { pick, randInt, shuffle, withDistractors } from '../lib/random';
import { LOGIC, PATTERN_ITEMS } from '../data/brain';
import { THINGS, CATEGORIES } from '../data/world';
import { numberToWords } from '../lib/numberWords';
import type { Level, ModeDef, ModeProps } from '../types';

// ---------- memory ----------

const MEMORY_EMOJI = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐘', '🐐', '🐯', '🦁', '🐪', '🦓'];
interface Card { id: number; emoji: string; matched: boolean }

function Memory({ level, onResult, onExit }: ModeProps) {
  const pairs = level === 1 ? 3 : level === 2 ? 6 : 8;
  const deal = () => shuffle([...shuffle(MEMORY_EMOJI).slice(0, pairs).flatMap(e => [e, e])]).map((emoji, id) => ({ id, emoji, matched: false }));
  const [cards, setCards] = useState<Card[]>(deal);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const lock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const done = cards.every(c => c.matched);
  useEffect(() => { if (done) { fireworks(); sfx.win(); void speak('You found them all!'); } }, [done]);

  const flip = (id: number) => {
    if (lock.current || open.includes(id) || cards[id].matched) return;
    sfx.tap();
    const now = [...open, id];
    setOpen(now);
    if (now.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = now.map(i => cards[i]);
      if (a.emoji === b.emoji) {
        sfx.correct(); burst(); onResult(true);
        setCards(cs => cs.map(c => (now.includes(c.id) ? { ...c, matched: true } : c)));
        setOpen([]);
      } else {
        lock.current = true;
        timer.current = setTimeout(() => { setOpen([]); lock.current = false; sfx.wrong(); }, 900);
      }
    }
  };

  const again = () => { setCards(deal()); setOpen([]); setMoves(0); lock.current = false; };

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <p className="chunky-sm mx-auto mb-4 w-fit rounded-full bg-paper px-5 py-1.5 text-lg font-black">🃏 Moves: {moves}</p>
      <div className={`grid gap-3 ${pairs === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {cards.map(c => {
          const shown = open.includes(c.id) || c.matched;
          return (
            <motion.button
              key={c.id}
              data-card
              type="button"
              aria-label={shown ? legacyPicture(c.emoji) : 'Hidden card'}
              onClick={() => flip(c.id)}
              animate={{ rotateY: shown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative aspect-square"
            >
              <span className={`absolute inset-0 flex items-center justify-center rounded-2xl border-[3px] border-ink bg-accent text-4xl text-white shadow-[0_4px_0_0_var(--color-ink)]`} style={{ backfaceVisibility: 'hidden' }}>❔</span>
              <span
                className={`absolute inset-0 flex items-center justify-center rounded-2xl border-[3px] border-ink text-5xl shadow-[0_4px_0_0_var(--color-ink)] sm:text-6xl ${c.matched ? 'bg-good-soft' : 'bg-paper'}`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >{shown && <OptionEmoji>{c.emoji}</OptionEmoji>}</span>
            </motion.button>
          );
        })}
      </div>
      {done && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-3xl font-black text-green-600">You did it in {moves} moves! 🎉</p>
          <Button size="lg" variant="good" onClick={again}>Play again 🔁</Button>
          <Button size="lg" variant="paper" onClick={onExit}>Done</Button>
        </div>
      )}
    </div>
  );
}

// ---------- patterns ----------

function makePattern(level: Level): QuizQuestion {
  if (level === 3 && Math.random() < 0.6) {
    const step = pick([2, 5, 10, 3]);
    const start = step === 10 ? 0 : randInt(0, 4);
    const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
    const answer = seq[4];
    const shown = seq.slice(0, 4);
    return {
      key: `num-${start}-${step}`,
      prompt: 'What number comes next?',
      audio: () => speak(`${shown.map(numberToWords).join(', ')}, what comes next?`),
      visual: <p className="text-4xl font-black text-ink">{shown.join(', ')}, ❓</p>,
      options: withDistractors(answer, [answer + 1, answer - 1, answer + step, answer - step, answer + 2].filter(x => x > 0), 4)
        .map(n => ({ id: String(n), label: String(n), speak: String(n) })),
      correctId: String(answer),
      optionStyle: 'chip',
      explain: `Counting by ${numberToWords(step)}s: next is ${numberToWords(answer)}.`,
    };
  }
  const [a, b, c] = shuffle(PATTERN_ITEMS);
  const shape = level === 1 ? [a, b, a, b, a, b] : pick([[a, a, b, a, a, b], [a, b, c, a, b, c], [a, b, b, a, b, b], [a, a, b, b, a, a]]);
  const shown = shape.slice(0, shape.length - 1);
  const answer = shape[shape.length - 1];
  const used = [...new Set(shape)];
  const options = shuffle([...used, ...shuffle(PATTERN_ITEMS.filter(e => !used.includes(e))).slice(0, Math.max(0, 3 - used.length))]);
  return {
    key: shape.join(''),
    prompt: 'What comes next in the pattern?',
    visual: <div className="flex flex-wrap justify-center gap-2 text-5xl">{shown.map((e, i) => <span key={i}>{e}</span>)}<span className="rounded-xl bg-cream px-2 text-ink-soft">?</span></div>,
    options: options.map(e => ({ id: e, visual: <OptionEmoji>{e}</OptionEmoji> })),
    correctId: answer,
    optionStyle: 'big',
    explain: 'Look at the order – it repeats!',
  };
}

// ---------- logic & odd one out ----------

function makeLogic(level: Level): QuizQuestion {
  const q = pick(LOGIC.filter(l => l.level === level));
  return {
    key: q.q,
    prompt: q.q,
    options: shuffle(q.options).map(o => ({ id: o, label: o })),
    correctId: q.answer,
    optionStyle: 'chip',
    explain: q.why,
  };
}

function makeOddOne(level: Level): QuizQuestion {
  const cat = pick(CATEGORIES);
  const [oddCat] = shuffle(CATEGORIES.filter(c => c !== cat));
  const same = shuffle(THINGS.filter(t => t.category === cat)).slice(0, level === 1 ? 2 : 3);
  const odd = pick(THINGS.filter(t => t.category === oddCat));
  return {
    key: `${cat}-${odd.name}`,
    prompt: 'Which one does not belong?',
    audio: () => speak('Which one does not belong in the group?'),
    options: shuffle([odd, ...same]).map(t => ({ id: t.name, visual: <OptionEmoji>{t.emoji}</OptionEmoji>, speak: t.name })),
    correctId: odd.name,
    optionStyle: 'big',
    explain: `The ${odd.name.toLowerCase()} is different. The others are all ${cat.toLowerCase()}.`,
  };
}


export const brainModes: ModeDef[] = [
  { id: 'memory', title: 'Memory Match', emoji: '🃏', desc: 'Flip cards and find the pairs', render: p => <Memory {...p} /> },
  {
    id: 'patterns', title: 'Patterns', emoji: '🔁', desc: 'What comes next?',
    render: p => <Quiz makeQuestion={makePattern} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'odd', title: 'Odd One Out', emoji: '🧐', desc: 'Spot the one that is different',
    render: p => <Quiz makeQuestion={makeOddOne} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'logic', title: 'Riddles & Logic', emoji: '💡', desc: 'Think it through',
    render: p => <Quiz makeQuestion={makeLogic} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
];
