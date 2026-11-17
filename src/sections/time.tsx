import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { ClockFace, OptionEmoji, BigEmoji } from '../components/ui/Visuals';
import { pick, randInt, shuffle } from '../lib/random';
import { numberToWords } from '../lib/numberWords';
import { DAYS, DAY_PARTS, MONTHS, SEASONS } from '../data/calendar';
import type { Level, ModeDef } from '../types';

const digital = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

function timeInWords(h: number, m: number): string {
  const nextH = (h % 12) + 1;
  const hw = numberToWords(h);
  const nw = numberToWords(nextH);
  if (m === 0) return `${hw} o'clock`;
  if (m === 15) return `quarter past ${hw}`;
  if (m === 30) return `half past ${hw}`;
  if (m === 45) return `quarter to ${nw}`;
  if (m < 30) return `${numberToWords(m)} past ${hw}`;
  return `${numberToWords(60 - m)} to ${nw}`;
}

function makeClock(level: Level): QuizQuestion {
  const minutes = level === 1 ? [0] : level === 2 ? [0, 30] : [0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55];
  const h = randInt(1, 12);
  const m = pick(minutes);
  const answer = digital(h, m);
  const options = new Set([answer]);
  while (options.size < (level === 1 ? 3 : 4)) {
    const oh = Math.random() < 0.6 ? h : randInt(1, 12);
    const om = Math.random() < 0.5 ? m : pick(minutes);
    options.add(digital(oh, om));
  }
  return {
    key: answer,
    prompt: 'What time does the clock show?',
    visual: <ClockFace hour={h} minute={m} />,
    options: shuffle([...options]).map(o => ({ id: o, label: o, speak: o.replace(':', ' ') })),
    correctId: answer,
    optionStyle: 'chip',
    explain: `It is ${timeInWords(h, m)}. That is ${answer}.`,
  };
}

function makeCalendar(level: Level): QuizQuestion {
  const kinds = level === 1 ? ['dayAfter', 'season'] : ['dayAfter', 'dayBefore', 'monthAfter', 'monthBefore', 'season', ...(level === 3 ? ['count'] : [])];
  const kind = pick(kinds);

  if (kind === 'dayAfter' || kind === 'dayBefore') {
    const i = randInt(0, 6);
    const answer = DAYS[(i + (kind === 'dayAfter' ? 1 : 6)) % 7];
    return {
      key: `${kind}-${i}`,
      prompt: `What day comes ${kind === 'dayAfter' ? 'after' : 'before'} ${DAYS[i]}?`,
      options: shuffle([answer, ...shuffle(DAYS.filter(d => d !== answer && d !== DAYS[i])).slice(0, 2)]).map(d => ({ id: d, label: d })),
      correctId: answer,
      optionStyle: 'chip',
      explain: `${answer} comes ${kind === 'dayAfter' ? 'after' : 'before'} ${DAYS[i]}.`,
    };
  }
  if (kind === 'monthAfter' || kind === 'monthBefore') {
    const i = randInt(0, 11);
    const answer = MONTHS[(i + (kind === 'monthAfter' ? 1 : 11)) % 12];
    return {
      key: `${kind}-${i}`,
      prompt: `Which month comes ${kind === 'monthAfter' ? 'after' : 'before'} ${MONTHS[i]}?`,
      options: shuffle([answer, ...shuffle(MONTHS.filter(m => m !== answer && m !== MONTHS[i])).slice(0, 3)]).map(m => ({ id: m, label: m })),
      correctId: answer,
      optionStyle: 'chip',
      explain: `${answer} comes ${kind === 'monthAfter' ? 'after' : 'before'} ${MONTHS[i]}.`,
    };
  }
  if (kind === 'count') {
    const [prompt, answer, wrong] = pick([
      ['How many days are in a week?', '7', ['5', '6', '10']],
      ['How many months are in a year?', '12', ['10', '7', '24']],
      ['How many seasons are in a year?', '4', ['3', '5', '12']],
    ] as [string, string, string[]][]);
    return {
      key: prompt,
      prompt,
      options: shuffle([answer, ...wrong]).map(o => ({ id: o, label: o })),
      correctId: answer,
      optionStyle: 'chip',
      explain: `The answer is ${numberToWords(Number(answer))}.`,
    };
  }
  const s = pick(SEASONS);
  return {
    key: `season-${s.name}`,
    prompt: s.name === 'Winter' ? 'Which season is cold and snowy?' : s.name === 'Spring' ? 'Which season do flowers bloom?'
      : s.name === 'Summer' ? 'Which season is hot and sunny?' : 'Which season do leaves fall?',
    visual: <BigEmoji>{s.emoji}</BigEmoji>,
    options: shuffle(SEASONS).map(x => ({ id: x.name, label: x.name })),
    correctId: s.name,
    optionStyle: 'chip',
    explain: `${s.name}!`,
  };
}

function makeDayPart(): QuizQuestion {
  const part = pick(DAY_PARTS);
  const thing = pick(part.things);
  return {
    key: thing.text,
    prompt: `When do you ${thing.text}?`,
    visual: <BigEmoji>{thing.emoji}</BigEmoji>,
    options: DAY_PARTS.map(p => ({ id: p.name, visual: <OptionEmoji>{p.emoji}</OptionEmoji>, label: p.name })),
    correctId: part.name,
    optionStyle: 'card',
    explain: `We ${thing.text} in the ${part.name.toLowerCase()}.`.replace('in the night', 'at night'),
  };
}


export const timeModes: ModeDef[] = [
  {
    id: 'clock', title: 'Read the Clock', emoji: '🕒', desc: "O'clock, half past and more",
    render: p => <Quiz makeQuestion={makeClock} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'calendar', title: 'Days & Months', emoji: '📅', desc: 'Days, months and seasons',
    render: p => <Quiz makeQuestion={makeCalendar} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'day-parts', title: 'Day & Night', emoji: '🌅', desc: 'Morning, afternoon or night?',
    render: p => <Quiz makeQuestion={makeDayPart} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
];
