import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { EmojiGroup, OptionText } from '../components/ui/Visuals';
import { speak } from '../lib/speech';
import { pick, randInt, withDistractors } from '../lib/random';
import { numberToWords, spokenNumber } from '../lib/numberWords';
import type { Level, ModeDef } from '../types';

const THINGS = ['🍎', '🍓', '🐟', '⭐', '🎈', '🍪', '🦋', '🚗', '🐥', '🍩'];
const numeral = (n: number) => ({ id: String(n), visual: <OptionText>{n}</OptionText>, speak: spokenNumber(n) });

const numberChoices = (answer: number, max: number, count = 3) =>
  withDistractors(answer, Array.from({ length: max + 3 }, (_, i) => i).filter(x => Math.abs(x - answer) <= 3), count);

function makeCount(level: Level): QuizQuestion {
  const max = level === 1 ? 5 : level === 2 ? 10 : 20;
  const n = randInt(1, max);
  return {
    key: `count-${n}`,
    prompt: 'How many can you count?',
    visual: <EmojiGroup emoji={pick(THINGS)} count={n} size={n > 10 ? 'text-3xl' : 'text-5xl'} />,
    options: numberChoices(n, max, level === 1 ? 3 : 4).map(numeral),
    correctId: String(n),
    optionStyle: 'big',
    explain: `There are ${numberToWords(n)}.`,
  };
}

function makeAdd(level: Level): QuizQuestion {
  const top = level === 1 ? 5 : level === 2 ? 10 : 20;
  const a = randInt(1, top - 1);
  const b = randInt(1, top - a);
  const emoji = pick(THINGS);
  const showObjects = a + b <= 10;
  return {
    key: `${a}+${b}`,
    prompt: `${a} + ${b} = ?`,
    audio: () => speak(`${numberToWords(a)} plus ${numberToWords(b)} equals what?`),
    visual: showObjects ? (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <EmojiGroup emoji={emoji} count={a} />
        <span className="text-4xl font-black text-ink-soft">+</span>
        <EmojiGroup emoji={emoji} count={b} />
      </div>
    ) : undefined,
    options: numberChoices(a + b, top, 4).map(numeral),
    correctId: String(a + b),
    optionStyle: 'big',
    explain: `${numberToWords(a)} plus ${numberToWords(b)} equals ${numberToWords(a + b)}.`,
  };
}

function makeSubtract(level: Level): QuizQuestion {
  const top = level === 1 ? 5 : level === 2 ? 10 : 20;
  const a = randInt(2, top);
  const b = randInt(1, a - 1);
  const emoji = pick(THINGS);
  return {
    key: `${a}-${b}`,
    prompt: `${a} − ${b} = ?`,
    audio: () => speak(`${numberToWords(a)} take away ${numberToWords(b)} leaves what?`),
    visual: a <= 10 ? <EmojiGroup emoji={emoji} count={a} crossed={b} size="text-5xl" /> : undefined,
    options: numberChoices(a - b, top, 4).map(numeral),
    correctId: String(a - b),
    optionStyle: 'big',
    explain: `${numberToWords(a)} take away ${numberToWords(b)} leaves ${numberToWords(a - b)}.`,
  };
}

function makeCompare(level: Level): QuizQuestion {
  const max = level === 1 ? 6 : level === 2 ? 10 : 20;
  if (level === 1 || Math.random() < 0.5) {
    const a = randInt(1, max);
    let b = randInt(1, max);
    if (b === a) b = a === max ? a - 1 : a + 1;
    const emoji = pick(THINGS);
    const moreIsA = a > b;
    return {
      key: `cmp-${a}-${b}`,
      prompt: 'Which group has MORE?',
      visual: (
        <div className="flex flex-wrap justify-center gap-6">
          <div className="rounded-2xl bg-sky-50 p-3"><EmojiGroup emoji={emoji} count={a} size="text-3xl" /></div>
          <div className="rounded-2xl bg-rose-50 p-3"><EmojiGroup emoji={emoji} count={b} size="text-3xl" /></div>
        </div>
      ),
      options: [
        { id: 'a', label: 'Left group', speak: 'Left group' },
        { id: 'b', label: 'Right group', speak: 'Right group' },
      ],
      correctId: moreIsA ? 'a' : 'b',
      optionStyle: 'chip',
      explain: `${numberToWords(Math.max(a, b))} is more than ${numberToWords(Math.min(a, b))}.`,
    };
  }
  const a = randInt(0, max);
  let b = randInt(0, max);
  if (b === a) b = a === max ? a - 1 : a + 1;
  const bigger = Math.random() < 0.5;
  const answer = bigger ? Math.max(a, b) : Math.min(a, b);
  return {
    key: `num-${bigger}-${a}-${b}`,
    prompt: `Which number is ${bigger ? 'BIGGER' : 'SMALLER'}?`,
    options: [a, b].map(numeral),
    correctId: String(answer),
    optionStyle: 'big',
    explain: `${numberToWords(answer)} is ${bigger ? 'bigger' : 'smaller'}.`,
  };
}

export const mathModes: ModeDef[] = [
  {
    id: 'count', title: 'Count It', emoji: '🧮', desc: 'How many are there?',
    render: p => <Quiz makeQuestion={makeCount} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'add', title: 'Add It Up', emoji: '➕', desc: 'Put groups together',
    render: p => <Quiz makeQuestion={makeAdd} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'subtract', title: 'Take Away', emoji: '➖', desc: 'How many are left?',
    render: p => <Quiz makeQuestion={makeSubtract} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'compare', title: 'More or Less', emoji: '⚖️', desc: 'Compare groups and numbers',
    render: p => <Quiz makeQuestion={makeCompare} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
];
