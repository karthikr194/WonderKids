import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { Explorer } from '../components/engines/Explorer';
import { BigEmoji, OptionEmoji } from '../components/ui/Visuals';
import { SpeakButton } from '../components/ui/SpeakButton';
import { speak, speakSequence } from '../lib/speech';
import { pick, shuffle } from '../lib/random';
import { ANIMALS, OPPOSITES, THINGS, CATEGORIES } from '../data/world';
import type { Level, ModeDef, ModeProps } from '../types';

function makeIdentify(level: Level): QuizQuestion {
  const target = pick(THINGS);
  const same = THINGS.filter(t => t.category === target.category && t.name !== target.name);
  const other = THINGS.filter(t => t.category !== target.category);
  const n = level === 1 ? 3 : 4;
  const distractors = level === 1 ? shuffle(other).slice(0, 2) : shuffle(same).slice(0, n - 1);
  const options = shuffle([target, ...distractors]);
  return {
    key: target.name,
    prompt: 'What is this?',
    audio: () => speak('What is this?'),
    visual: <BigEmoji>{target.emoji}</BigEmoji>,
    options: options.map(o => ({ id: o.name, label: o.name })),
    correctId: target.name,
    optionStyle: 'chip',
    explain: `It is a ${target.name.toLowerCase()}. It is in the group: ${target.category}.`,
  };
}

function AnimalExplorer({ theme, onResult }: Pick<ModeProps, 'theme' | 'onResult'>) {
  return (
    <Explorer
      items={ANIMALS}
      itemKey={a => a.name}
      theme={theme}
      gridClass="grid-cols-4 sm:grid-cols-6"
      renderTile={a => <span className="text-4xl sm:text-5xl">{a.emoji}</span>}
      onOpen={a => { onResult(true); void speakSequence([a.name, { text: `${a.name} says ${a.sound}!`, rate: 0.9 }]); }}
      renderCard={a => (
        <div>
          <div className="text-8xl" aria-hidden>{a.emoji}</div>
          <div className={`mb-1 text-4xl font-black ${theme.text}`}>{a.name}</div>
          <div className="mb-3 text-3xl font-black text-slate-700">“{a.sound}!”</div>
          <div className="mb-3 grid grid-cols-3 gap-2 text-sm font-bold text-slate-600 sm:text-base">
            <span className="rounded-xl bg-sky-50 p-2">🏠 Lives in<br /><b>{a.home}</b></span>
            <span className="rounded-xl bg-pink-50 p-2">🍼 Baby<br /><b>{a.baby}</b></span>
            <span className="rounded-xl bg-green-50 p-2">🍽️ Eats<br /><b>{a.food}</b></span>
          </div>
          <p className="mb-3 text-lg font-semibold text-slate-500">{a.fact}</p>
          <SpeakButton label="Listen" onClick={() => void speakSequence([`${a.name} says ${a.sound}.`, a.fact])} />
        </div>
      )}
    />
  );
}

function makeAnimalQuiz(level: Level): QuizQuestion {
  const a = pick(ANIMALS);
  const kind = pick(level === 1 ? ['sound'] : level === 2 ? ['sound', 'home', 'baby'] : ['home', 'baby', 'food']);

  if (kind === 'sound') {
    const others = shuffle(ANIMALS.filter(x => x.sound !== a.sound)).slice(0, level === 1 ? 2 : 3);
    return {
      key: `sound-${a.name}`,
      prompt: `Who says “${a.sound}”?`,
      audio: () => speak(`Who says ${a.sound}?`),
      options: shuffle([a, ...others]).map(x => ({ id: x.name, visual: <OptionEmoji>{x.emoji}</OptionEmoji>, speak: x.name })),
      correctId: a.name,
      optionStyle: 'big',
      explain: `A ${a.name.toLowerCase()} says ${a.sound}!`,
    };
  }
  const field = kind === 'home' ? 'home' : kind === 'baby' ? 'baby' : 'food';
  const answer = a[field];
  const pool = [...new Set(ANIMALS.map(x => x[field]))].filter(x => x !== answer);
  const text = field === 'home' ? `Where does a ${a.name.toLowerCase()} live?`
    : field === 'baby' ? `What is a baby ${a.name.toLowerCase()} called?`
    : `What does a ${a.name.toLowerCase()} eat?`;
  return {
    key: `${field}-${a.name}`,
    prompt: text,
    visual: <BigEmoji>{a.emoji}</BigEmoji>,
    options: shuffle([answer, ...shuffle(pool).slice(0, 3)]).map(o => ({ id: o, label: o })),
    correctId: answer,
    optionStyle: 'chip',
    explain: `${text.replace('?', '')}: ${answer}.`,
  };
}

function makeOpposite(level: Level): QuizQuestion {
  const pair = pick(OPPOSITES);
  const flip = Math.random() < 0.5;
  const [q, qe, a, ae] = flip ? [pair.a, pair.ae, pair.b, pair.be] : [pair.b, pair.be, pair.a, pair.ae];
  const wrong = shuffle(OPPOSITES.filter(p => p !== pair)).slice(0, level === 1 ? 2 : 3).map(p => (Math.random() < 0.5 ? p.a : p.b));
  const emojiOf = (w: string) => OPPOSITES.flatMap(p => [[p.a, p.ae], [p.b, p.be]]).find(([n]) => n === w)![1];
  return {
    key: q,
    prompt: `What is the opposite of “${q}”?`,
    visual: <BigEmoji>{qe}</BigEmoji>,
    options: shuffle([a, ...wrong]).map(w => ({ id: w, label: w, visual: <OptionEmoji>{w === a ? ae : emojiOf(w)}</OptionEmoji> })),
    correctId: a,
    optionStyle: 'card',
    explain: `${q} and ${a.toLowerCase()} are opposites.`,
  };
}

export const worldModes: ModeDef[] = [
  {
    id: 'animals', title: 'Animal Friends', emoji: '🦁', desc: 'Sounds, homes, babies and facts',
    render: p => <AnimalExplorer theme={p.theme} onResult={p.onResult} />,
  },
  {
    id: 'animal-quiz', title: 'Animal Quiz', emoji: '🐮', desc: 'Who says moo? Where do they live?',
    render: p => <Quiz makeQuestion={makeAnimalQuiz} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'identify', title: 'What Is It?', emoji: '🔍', desc: `Name ${CATEGORIES.length} groups of things`,
    render: p => <Quiz makeQuestion={makeIdentify} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'opposites', title: 'Opposites', emoji: '↔️', desc: 'Hot and cold, up and down',
    render: p => <Quiz makeQuestion={makeOpposite} level={p.level} theme={p.theme} onResult={p.onResult} onExit={p.onExit} />,
  },
];
