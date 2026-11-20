import { Quiz, type QuizQuestion } from '../components/engines/Quiz';
import { WordBuilder, type BuildItem } from '../components/engines/WordBuilder';
import { Explorer } from '../components/engines/Explorer';
import { BlendIt } from '../components/engines/BlendIt';
import { BigEmoji, OptionEmoji, OptionText } from '../components/ui/Visuals';
import { SpeakButton } from '../components/ui/SpeakButton';
import { playPhoneme, speak, speakLetterName, speakSequence } from '../lib/speech';
import { pick, shuffle } from '../lib/random';
import {
  CVC_WORDS, DIGRAPHS, LETTER_SOUNDS, TEAM_WORDS, type Phoneme,
} from '../data/phonics';
import type { Level, ModeDef, ModeProps } from '../types';

// ---------- explorers ----------

function SoundExplorer({ items, isLetters, onResult }: Pick<ModeProps, 'onResult'> & {
  items: Phoneme[]; isLetters: boolean;
}) {
  return (
    <Explorer
      items={items}
      itemKey={p => p.id}
     
      gridClass={isLetters ? 'grid-cols-5 sm:grid-cols-7' : 'grid-cols-4 sm:grid-cols-6'}
      renderTile={p => p.display}
      onOpen={p => { onResult(true); void playPhoneme(p.id, p.say); }}
      renderCard={p => (
        <div>
          <div className={`text-8xl font-black sm:text-9xl text-accent-deep`}>{p.display}</div>
          <div className="mb-3 text-xl font-bold text-ink-soft">sound {p.ipa}</div>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <SpeakButton label="Hear the sound" onClick={() => void playPhoneme(p.id, p.say)} />
            {isLetters && (
              <button
                type="button"
                onClick={() => void speakLetterName(p.grapheme)}
                className="rounded-full bg-paper px-5 py-3 text-lg font-bold text-ink-soft chunky-sm"
              >
                Letter name
              </button>
            )}
          </div>
          <p className="mb-4 rounded-2xl bg-amber-50 p-3 text-lg font-semibold text-amber-800">👄 {p.tip}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {p.words.map(w => (
              <button
                key={w.word}
                type="button"
                onClick={() => void speakSequence([{ text: p.say, rate: 0.55, pitch: 1, pause: 250 }, { text: w.word, rate: 0.8 }])}
                className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-2 text-2xl font-black text-ink chunky-sm"
              >
                <OptionEmoji>{w.emoji}</OptionEmoji>
                <span>
                  {w.word.startsWith(p.grapheme)
                    ? <><span className="text-accent-deep">{p.grapheme}</span>{w.word.slice(p.grapheme.length)}</>
                    : <>{w.word.split(p.grapheme).map((part, i, arr) => (
                        <span key={i}>{part}{i < arr.length - 1 && <span className="text-accent-deep">{p.grapheme}</span>}</span>
                      ))}</>}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
}

// ---------- quizzes ----------

/** c and k (and similar) make the same sound – never offer both. */
const sameSound = (a: Phoneme, b: Phoneme) => a.say === b.say;

const letterOption = (p: Phoneme) => ({
  id: p.id, visual: <OptionText>{p.display}</OptionText>, speak: p.say,
});

function soundOptions(correct: Phoneme, pool: Phoneme[], n: number) {
  const distractors = shuffle(pool.filter(p => p.id !== correct.id && !sameSound(p, correct))).slice(0, n - 1);
  return shuffle([correct, ...distractors]);
}

function makeSoundMatch(level: Level): QuizQuestion {
  const kind = level === 1 ? 'hear' : level === 2 ? 'begins' : pick(['ends', 'pictureFor', 'begins']);

  if (kind === 'hear') {
    const target = pick(LETTER_SOUNDS);
    return {
      key: `hear-${target.id}`,
      prompt: 'Which letter makes this sound?',
      audio: () => playPhoneme(target.id, target.say),
      visual: <span className="text-7xl" aria-hidden>👂</span>,
      options: soundOptions(target, LETTER_SOUNDS, 3).map(letterOption),
      correctId: target.id,
      optionStyle: 'big',
      explain: `${target.display} says ${target.say}, like ${target.words[0].word}.`,
    };
  }

  if (kind === 'begins') {
    const target = pick(LETTER_SOUNDS.filter(p => p.id !== 'x'));
    const w = pick(target.words);
    return {
      key: `begins-${w.word}`,
      prompt: 'Which letter does it start with?',
      audio: () => speakSequence([{ text: w.word, rate: 0.7, pause: 200 }, 'What sound does it start with?']),
      visual: <BigEmoji>{w.emoji}</BigEmoji>,
      options: soundOptions(target, LETTER_SOUNDS.filter(p => p.id !== 'x'), level === 2 ? 3 : 4).map(letterOption),
      correctId: target.id,
      optionStyle: 'big',
      explain: `${w.word} starts with ${target.say}.`,
    };
  }

  if (kind === 'ends') {
    const w = pick(CVC_WORDS);
    const last = w.units[w.units.length - 1];
    const target = LETTER_SOUNDS.find(p => p.id === last)!;
    return {
      key: `ends-${w.word}`,
      prompt: 'Which letter does it end with?',
      audio: () => speakSequence([{ text: w.word, rate: 0.7, pause: 200 }, 'What sound does it end with?']),
      visual: <BigEmoji>{w.emoji}</BigEmoji>,
      options: soundOptions(target, LETTER_SOUNDS, 4).map(letterOption),
      correctId: target.id,
      optionStyle: 'big',
      explain: `${w.word} ends with ${target.say}.`,
    };
  }

  // pictureFor: hear a sound, pick the picture that starts with it
  const target = pick(LETTER_SOUNDS.filter(p => p.id !== 'x'));
  const right = pick(target.words);
  const others = shuffle(
    LETTER_SOUNDS.filter(p => p.id !== target.id && p.id !== 'x' && !sameSound(p, target)),
  ).slice(0, 2).map(p => pick(p.words));
  return {
    key: `pic-${right.word}`,
    prompt: 'Which picture starts with this sound?',
    audio: () => playPhoneme(target.id, target.say),
    visual: <span className="text-6xl font-black text-ink-soft">{target.display}</span>,
    options: shuffle([right, ...others]).map(w => ({ id: w.word, visual: <OptionEmoji>{w.emoji}</OptionEmoji>, speak: w.word })),
    correctId: right.word,
    optionStyle: 'big',
    explain: `${right.word} starts with ${target.say}.`,
  };
}

function makeTeamQuiz(level: Level): QuizQuestion {
  if (level === 1 || Math.random() < 0.5) {
    const target = pick(DIGRAPHS);
    return {
      key: `team-hear-${target.id}`,
      prompt: 'Which letters make this sound?',
      audio: () => playPhoneme(target.id, target.say),
      visual: <span className="text-7xl" aria-hidden>👂</span>,
      options: soundOptions(target, DIGRAPHS, level === 3 ? 4 : 3).map(p => ({
        id: p.id, visual: <OptionText>{p.display}</OptionText>, speak: p.say,
      })),
      correctId: target.id,
      optionStyle: 'big',
      explain: `${target.display} says ${target.say}, like ${target.words[0].word}.`,
    };
  }
  const w = pick(TEAM_WORDS.filter(t => t.units.some(u => u.length > 1)));
  const teamUnit = w.units.find(u => u.length > 1)!;
  const target = DIGRAPHS.find(d => d.id === teamUnit)!;
  return {
    key: `team-word-${w.word}`,
    prompt: 'Which letters team up in this word?',
    audio: () => speak(w.word),
    visual: (
      <div className="flex flex-col items-center gap-1">
        <BigEmoji>{w.emoji}</BigEmoji>
        <span className="text-4xl font-black text-ink">{w.word}</span>
      </div>
    ),
    options: soundOptions(target, DIGRAPHS, 3).map(p => ({ id: p.id, visual: <OptionText>{p.display}</OptionText>, speak: p.say })),
    correctId: target.id,
    optionStyle: 'big',
    explain: `In ${w.word}, ${target.display} makes one sound: ${target.say}.`,
  };
}

// ---------- word building ----------

function makeBuildItem(level: Level): BuildItem {
  const pool = level === 1 ? CVC_WORDS
    : level === 2 ? [...CVC_WORDS, ...TEAM_WORDS.filter(w => w.word.length <= 4)]
    : TEAM_WORDS;
  const w = pick(pool);
  return {
    key: w.word,
    units: w.units,
    emoji: w.emoji,
    say: w.word,
    prompt: 'Build the word! Tap the sounds in order.',
  };
}

export const phonicsModes: ModeDef[] = [
  {
    id: 'letter-sounds', title: 'Letter Sounds', emoji: '🔤', desc: 'Hear the real sound each letter makes',
    render: p => <SoundExplorer items={LETTER_SOUNDS} isLetters onResult={p.onResult} />,
  },
  {
    id: 'sound-match', title: 'Sound Match', emoji: '👂', desc: 'Listen and find the letter',
    render: p => <Quiz makeQuestion={makeSoundMatch} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'blend', title: 'Blend It!', emoji: '🧩', desc: 'Sound out c-a-t and blend it',
    render: p => <BlendIt words={CVC_WORDS} onResult={p.onResult} />,
  },
  {
    id: 'build', title: 'Build Words', emoji: '🔡', desc: 'Spell words from their sounds',
    render: p => <WordBuilder makeItem={makeBuildItem} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
  {
    id: 'teams', title: 'Letter Teams', emoji: '🤝', desc: 'sh, ch, th, ee, oo, ai and more',
    render: p => <SoundExplorer items={DIGRAPHS} isLetters={false} onResult={p.onResult} />,
  },
  {
    id: 'team-words', title: 'Team Words', emoji: '🐑', desc: 'Blend words like ship, rain, moon',
    render: p => <BlendIt words={TEAM_WORDS} onResult={p.onResult} />,
  },
  {
    id: 'team-quiz', title: 'Team Quiz', emoji: '🎯', desc: 'Which letters make the sound?',
    render: p => <Quiz makeQuestion={makeTeamQuiz} level={p.level} onResult={p.onResult} onExit={p.onExit} />,
  },
];
