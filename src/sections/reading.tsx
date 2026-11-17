import { useState } from 'react';
import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { Explorer } from '../components/engines/Explorer';
import { BigEmoji } from '../components/ui/Visuals';
import { SpeakButton } from '../components/ui/SpeakButton';
import { speak, speakSequence } from '../lib/speech';
import { pick, shuffle, sample } from '../lib/random';
import { CLOZE, SIGHT_WORDS } from '../data/reading';
import { CVC_WORDS, TEAM_WORDS } from '../data/phonics';
import type { Level, ModeDef, ModeProps } from '../types';

const poolFor = (level: Level) =>
  ([1, 2, 3] as const).filter(l => l <= level).flatMap(l => SIGHT_WORDS[l]);

// ---------- flashcards ----------

const SETS: { id: Level; label: string }[] = [
  { id: 1, label: 'Set 1' }, { id: 2, label: 'Set 2' }, { id: 3, label: 'Set 3' },
];

function SightWordCards({ onResult }: Pick<ModeProps, 'onResult'>) {
  const [set, setSet] = useState<Level>(1);
  return (
    <div>
      <div className="mx-auto mb-4 flex max-w-3xl justify-center gap-2">
        {SETS.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSet(s.id)}
            className={`chunky-sm rounded-full px-5 py-2 text-lg font-bold ${s.id === set ? `bg-accent text-white` : 'bg-paper text-ink-soft'}`}
          >{s.label}</button>
        ))}
      </div>
      <Explorer
        items={SIGHT_WORDS[set]}
        itemKey={w => w}
       
        gridClass="grid-cols-3 sm:grid-cols-5"
        renderTile={w => <span className="text-xl sm:text-2xl">{w}</span>}
        onOpen={w => { onResult(true); void speak(w); }}
        renderCard={w => (
          <div>
            <div className={`mb-2 text-7xl font-black sm:text-8xl text-accent-deep`}>{w}</div>
            <div className="mb-4 text-3xl font-bold tracking-[0.4em] text-ink-soft">{w.split('').join(' ')}</div>
            <div className="flex flex-wrap justify-center gap-2">
              <SpeakButton label="Say it" onClick={() => void speak(w)} />
              <SpeakButton
                label="Spell it"
                onClick={() => void speakSequence(w.split('').map(l => ({ text: l.toUpperCase(), rate: 0.7, pause: 150 })))}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}

// ---------- quizzes ----------

function lookAlikes(word: string, pool: string[], n: number): string[] {
  const similar = pool.filter(w => w !== word && (w[0] === word[0] || w.length === word.length));
  const rest = pool.filter(w => w !== word && !similar.includes(w));
  return [...shuffle(similar), ...shuffle(rest)].slice(0, n);
}

function makeFindWord(level: Level): QuizQuestion {
  const pool = poolFor(level);
  const word = pick(level === 1 ? SIGHT_WORDS[1] : pool);
  const options = shuffle([word, ...lookAlikes(word, pool, level === 1 ? 2 : 3)]);
  return {
    key: word,
    prompt: 'Tap the word you hear!',
    audio: () => speak(word),
    visual: <span className="text-7xl" aria-hidden>👂</span>,
    options: options.map(w => ({ id: w, label: w })),
    correctId: word,
    optionStyle: 'chip',
    explain: `${word}: ${word.split('').join(' - ')}.`,
  };
}

function makeSentence(level: Level): QuizQuestion {
  const pool = CLOZE.filter(c => c.level <= level);
  const c = pick(level === 1 ? pool : pool.filter(x => x.level === level || Math.random() < 0.25));
  const full = `${c.before} ${c.answer} ${c.after}`.replace(/\s+([.,!?])/g, '$1');
  return {
    key: full,
    prompt: `${c.before} ___ ${c.after}`.replace(/\s+([.,!?])/g, '$1'),
    audio: () => speakSequence([`${c.before} ... ${c.after}`.replace(/\s+([.,!?])/g, '$1'), 'Which word fits?']),
    visual: <BigEmoji>{c.emoji}</BigEmoji>,
    options: shuffle([c.answer, ...sample(c.wrong, level === 1 ? 2 : 3)]).map(w => ({ id: w, label: w })),
    correctId: c.answer,
    optionStyle: 'chip',
    explain: full,
  };
}

const PICTURE_WORDS = [...CVC_WORDS, ...TEAM_WORDS];

function makePictureWord(level: Level): QuizQuestion {
  const pool = level === 1 ? CVC_WORDS : level === 2 ? [...CVC_WORDS, ...TEAM_WORDS.slice(0, 8)] : PICTURE_WORDS;
  const w = pick(pool);
  const others = shuffle(pool.filter(o => o.word !== w.word))
    .sort((a, b) => Number(b.word[0] === w.word[0]) - Number(a.word[0] === w.word[0]))
    .slice(0, level === 1 ? 2 : 3);
  return {
    key: w.word,
    prompt: 'Which word matches the picture?',
    audio: () => speak('Which word matches the picture?'),
    visual: <BigEmoji>{w.emoji}</BigEmoji>,
    options: shuffle([w, ...others]).map(o => ({ id: o.word, label: o.word })),
    correctId: w.word,
    optionStyle: 'chip',
    explain: `${w.word}. ${w.units.join(' - ')}.`,
  };
}

export const readingModes: ModeDef[] = [
  {
    id: 'cards', title: 'Sight Words', emoji: '👀', desc: 'Words you see everywhere',
    render: p => <SightWordCards onResult={p.onResult} />,
  },
  {
    id: 'find', title: 'Find the Word', emoji: '🎧', desc: 'Listen, then tap the word',
    render: p => <Quiz makeQuestion={makeFindWord} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'sentence', title: 'Fill the Gap', emoji: '📖', desc: 'Finish the sentence',
    render: p => <Quiz makeQuestion={makeSentence} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'picture', title: 'Picture Words', emoji: '🖼️', desc: 'Match the word to the picture',
    render: p => <Quiz makeQuestion={makePictureWord} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
];

