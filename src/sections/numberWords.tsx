import { useState } from 'react';
import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { WordBuilder, type BuildItem } from '../components/engines/WordBuilder';
import { Explorer } from '../components/engines/Explorer';
import { EmojiGroup, NumberVisual, OptionText } from '../components/ui/Visuals';
import { SpeakButton } from '../components/ui/SpeakButton';
import { speak } from '../lib/speech';
import { pick, randInt, shuffle, withDistractors } from '../lib/random';
import { isSpellable, numberToWords, spellableWord, spokenNumber } from '../lib/numberWords';
import type { Level, ModeDef, ModeProps } from '../types';

const MAX: Record<Level, number> = { 1: 10, 2: 20, 3: 100 };
const FRUIT = ['🍎', '🍓', '🐟', '⭐', '🎈', '🍪', '🦋', '🚗'];

/** Numbers worth asking about at a level – at level 3 it favours tens and teens, not just random. */
function pickNumber(level: Level, min = 0): number {
  if (level < 3) return randInt(min, MAX[level]);
  return Math.random() < 0.5 ? randInt(Math.max(min, 11), 20) : randInt(Math.max(min, 21), 100);
}

/** Distractors that look similar (e.g. 13 vs 30, 14 vs 40) are the real challenge. */
function numberOptions(n: number, level: Level, count: number): number[] {
  const near = new Set<number>();
  if (n >= 13 && n <= 19) near.add((n - 10) * 10); // thirteen / thirty
  if (n % 10 === 0 && n >= 30 && n <= 90) near.add(n / 10 + 10);
  [n - 1, n + 1, n + 10, n - 10, n + 2].forEach(x => { if (x >= 0 && x <= MAX[level] && x !== n) near.add(x); });
  const picks = shuffle([...near]).slice(0, count - 1);
  while (picks.length < count - 1) {
    const x = randInt(0, MAX[level]);
    if (x !== n && !picks.includes(x)) picks.push(x);
  }
  return shuffle([n, ...picks]);
}

// ---------- explorer ----------

const RANGES: { id: string; label: string; numbers: number[] }[] = [
  { id: '0-10', label: '0 – 10', numbers: Array.from({ length: 11 }, (_, i) => i) },
  { id: '11-20', label: '11 – 20', numbers: Array.from({ length: 10 }, (_, i) => i + 11) },
  { id: 'tens', label: 'Tens', numbers: Array.from({ length: 10 }, (_, i) => (i + 1) * 10) },
  { id: '21-50', label: '21 – 50', numbers: Array.from({ length: 30 }, (_, i) => i + 21) },
  { id: '51-100', label: '51 – 100', numbers: Array.from({ length: 50 }, (_, i) => i + 51) },
];

function NumberExplorer({ theme, onResult }: Pick<ModeProps, 'theme' | 'onResult'>) {
  const [rangeId, setRangeId] = useState('0-10');
  const range = RANGES.find(r => r.id === rangeId)!;
  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-3xl flex-wrap justify-center gap-2">
        {RANGES.map(r => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRangeId(r.id)}
            className={`rounded-full px-4 py-2 text-lg font-bold shadow-sm ${r.id === rangeId ? `${theme.solid} text-white` : 'bg-white text-slate-500'}`}
          >{r.label}</button>
        ))}
      </div>
      <Explorer
        items={range.numbers}
        itemKey={n => String(n)}
        theme={theme}
        gridClass="grid-cols-5 sm:grid-cols-8"
        renderTile={n => n}
        onOpen={n => { onResult(true); void speak(spokenNumber(n)); }}
        renderCard={n => (
          <div>
            <div className={`text-8xl font-black ${theme.text}`}>{n}</div>
            <div className="mb-3 text-4xl font-black text-slate-700 sm:text-5xl">{numberToWords(n)}</div>
            <div className="mb-4 flex min-h-16 justify-center"><NumberVisual n={n} /></div>
            {n > 20 && (
              <p className="mb-3 text-base font-semibold text-slate-500">
                {Math.floor(n / 10)} {Math.floor(n / 10) === 1 ? 'ten' : 'tens'}{n % 10 ? ` and ${n % 10} ${n % 10 === 1 ? 'one' : 'ones'}` : ''}
              </p>
            )}
            <SpeakButton label="Say it" onClick={() => void speak(spokenNumber(n))} />
          </div>
        )}
      />
    </div>
  );
}

// ---------- quizzes ----------

const wordOption = (n: number) => ({ id: String(n), label: numberToWords(n), speak: spokenNumber(n) });
const numeralOption = (n: number) => ({ id: String(n), visual: <OptionText>{n}</OptionText>, speak: spokenNumber(n) });

function makeMatch(level: Level): QuizQuestion {
  const kind = pick(level === 3 ? ['toWord', 'toNumber'] : ['toWord', 'toNumber', 'count']);
  const n = pickNumber(level);

  if (kind === 'toWord') {
    return {
      key: `w-${n}`,
      prompt: 'Which word matches the number?',
      visual: <span className="text-8xl font-black text-slate-700">{n}</span>,
      options: numberOptions(n, level, level === 1 ? 3 : 4).map(wordOption),
      correctId: String(n),
      optionStyle: 'chip',
      explain: `${n} is written "${numberToWords(n)}".`,
    };
  }
  if (kind === 'toNumber') {
    return {
      key: `n-${n}`,
      prompt: 'Which number is this word?',
      audio: () => speak(spokenNumber(n)),
      visual: <span className="text-6xl font-black text-slate-700 sm:text-7xl">{numberToWords(n)}</span>,
      options: numberOptions(n, level, level === 1 ? 3 : 4).map(numeralOption),
      correctId: String(n),
      optionStyle: 'big',
      explain: `"${numberToWords(n)}" is the number ${n}.`,
    };
  }
  const c = randInt(1, level === 1 ? 10 : 20);
  return {
    key: `c-${c}`,
    prompt: 'How many? Pick the word.',
    audio: () => speak('How many are there?'),
    visual: <EmojiGroup emoji={pick(FRUIT)} count={c} size={c > 10 ? 'text-3xl' : 'text-5xl'} />,
    options: numberOptions(c, 2, 4).map(wordOption),
    correctId: String(c),
    optionStyle: 'chip',
    explain: `There are ${numberToWords(c)}.`,
  };
}

function makeSpell(level: Level): BuildItem {
  const pool = Array.from({ length: 101 }, (_, i) => i).filter(isSpellable).filter(n =>
    level === 1 ? n <= 10 : level === 2 ? n <= 20 : n >= 11,
  );
  const n = pick(pool);
  const word = spellableWord(n);
  return {
    key: String(n),
    units: word.split(''),
    display: String(n),
    say: spokenNumber(n),
    prompt: 'Spell the number word!',
  };
}

const MATH_OP = ['plus', 'minus'] as const;

function makeWordMath(level: Level): QuizQuestion {
  const op = level === 1 ? 'plus' : pick(MATH_OP);
  const top = level === 1 ? 5 : level === 2 ? 10 : 20;
  let a: number, b: number, answer: number;
  if (op === 'plus') {
    a = randInt(0, top - 1); b = randInt(1, top - a); answer = a + b;
  } else {
    a = randInt(2, top); b = randInt(1, a); answer = a - b;
  }
  const sentence = `${numberToWords(a)} ${op} ${numberToWords(b)} equals what?`;
  const pool = Array.from({ length: top + 1 }, (_, i) => i);
  const options = withDistractors(answer, pool.filter(x => Math.abs(x - answer) <= 3), 4);
  return {
    key: `${a}${op}${b}`,
    prompt: sentence.charAt(0).toUpperCase() + sentence.slice(1),
    audio: () => speak(sentence.replace('minus', 'take away')),
    visual: (
      <div className="text-5xl font-black text-slate-700">
        {a} {op === 'plus' ? '+' : '−'} {b} = ?
      </div>
    ),
    options: options.map(wordOption),
    correctId: String(answer),
    optionStyle: 'chip',
    explain: `${numberToWords(a)} ${op === 'plus' ? 'plus' : 'minus'} ${numberToWords(b)} equals ${numberToWords(answer)}.`,
  };
}

function makeOrder(level: Level): QuizQuestion {
  const top = MAX[level];
  const kind = level === 1 ? 'next' : pick(['next', 'before', 'between', ...(level === 3 ? ['tens'] : [])]);
  const w = numberToWords;
  let missing: number;
  let line: string;

  if (kind === 'tens') {
    const start = randInt(1, 6) * 10;
    missing = start + 30;
    line = `${w(start)}, ${w(start + 10)}, ${w(start + 20)}, ___`;
  } else if (kind === 'before') {
    const n = randInt(1, top);
    missing = n - 1;
    line = `___, ${w(n)}`;
  } else if (kind === 'between') {
    const n = randInt(1, top - 1);
    missing = n;
    line = `${w(n - 1)}, ___, ${w(n + 1)}`;
  } else {
    const n = randInt(0, top - 2);
    missing = n + 2;
    line = `${w(n)}, ${w(n + 1)}, ___`;
  }

  const spread = kind === 'tens' ? 20 : 3;
  const pool = Array.from({ length: top + 11 }, (_, i) => i).filter(x => Math.abs(x - missing) <= spread);
  return {
    key: line,
    prompt: 'Which number word fits the blank?',
    audio: () => speak(line.replace('___', 'what comes here?').replace(/-/g, ' ')),
    visual: <p className="text-3xl font-black text-slate-700 sm:text-4xl">{line.replace('___', '❓')}</p>,
    options: withDistractors(missing, pool, 4).map(wordOption),
    correctId: String(missing),
    optionStyle: 'chip',
    explain: line.replace('___', w(missing).toUpperCase()),
  };
}

export const numberWordModes: ModeDef[] = [
  {
    id: 'learn', title: 'Numbers & Words', emoji: '🔢', desc: 'See, hear and read numbers up to 100',
    render: p => <NumberExplorer theme={p.theme} onResult={p.onResult} />,
  },
  {
    id: 'match', title: 'Word Match', emoji: '🔗', desc: '7 = seven. Match numbers to words',
    render: p => <Quiz makeQuestion={makeMatch} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'spell', title: 'Spell the Number', emoji: '✏️', desc: 'Build number words letter by letter',
    render: p => <WordBuilder makeItem={makeSpell} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'word-math', title: 'Word Math', emoji: '➕', desc: 'Two plus three equals…?',
    render: p => <Quiz makeQuestion={makeWordMath} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'order', title: 'What Comes Next?', emoji: '🪜', desc: 'Fill the gap in number words',
    render: p => <Quiz makeQuestion={makeOrder} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
];

