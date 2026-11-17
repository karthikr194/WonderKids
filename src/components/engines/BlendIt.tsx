import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playPhoneme, speak, speakSequence, stopSpeaking } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { PHONEME_BY_GRAPHEME, sayUnit, type BlendWord } from '../../data/phonics';
import { Button } from '../ui/Button';
import { MascotSays } from '../ui/Mascot';

interface Props {
  words: BlendWord[];
  onResult: (correct: boolean) => void;
}

/**
 * Sounding out: tap each letter (or letter team) to hear its sound,
 * "Sound it out" says the sounds one by one, "Say it fast" blends them into the word.
 */
export function BlendIt({ words, onResult }: Props) {
  const [i, setI] = useState(0);
  const [active, setActive] = useState(-1);
  const [blended, setBlended] = useState(false);
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const word = words[i];

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => { setActive(-1); setBlended(false); }, [i]);

  const tapUnit = (unit: string, idx: number) => {
    sfx.tap();
    setActive(idx);
    void playPhoneme(unit, sayUnit(unit)).then(() => setActive(-1));
  };

  const soundOut = async () => {
    await speakSequence(word.units.map((u, idx) => ({
      text: sayUnit(u), rate: 0.55, pitch: 1, pause: 350, onStart: () => setActive(idx),
    })));
    setActive(-1);
  };

  const blend = async () => {
    await speakSequence([
      ...word.units.map((u, idx) => ({ text: sayUnit(u), rate: 0.55, pitch: 1, pause: 120, onStart: () => setActive(idx) })),
      { text: word.word, rate: 0.75, onStart: () => setActive(-1) },
    ]);
    if (!blended) {
      setBlended(true);
      setDone(d => new Set(d).add(i));
      onResult(true);
      burst();
      sfx.correct();
    }
  };

  const go = (d: number) => setI(n => (n + d + words.length) % words.length);

  return (
    <div className="mx-auto w-full max-w-2xl pb-8">
      <div className="mb-5"><MascotSays>Tap each sound, then blend them together!</MascotSays></div>

      <div className="chunky overflow-hidden rounded-[2rem] bg-paper text-center">
        <div className="bg-accent-soft py-6 text-9xl leading-none" aria-hidden>{word.emoji}</div>
        <div className="border-t-[3px] border-ink p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-center gap-3">
            {word.units.map((u, idx) => (
              <motion.button
                key={`${i}-${idx}`}
                type="button"
                animate={{ y: active === idx ? -12 : 0 }}
                onClick={() => tapUnit(u, idx)}
                aria-label={`Sound ${PHONEME_BY_GRAPHEME[u]?.ipa ?? u}`}
                className={`chunky h-24 min-w-20 rounded-3xl px-4 text-6xl font-black sm:h-28 sm:min-w-24 sm:text-7xl
                  ${active === idx ? 'bg-sun text-ink' : 'bg-accent text-white'}`}
              >
                {u}
              </motion.button>
            ))}
          </div>
          {/* the "sound line" under the tiles, like in a phonics classroom */}
          <div className="mx-auto mb-6 flex max-w-xs items-center gap-1" aria-hidden>
            {word.units.map((_, idx) => (
              <span key={idx} className={`h-2 flex-1 rounded-full transition-colors ${active === idx ? 'bg-sun' : 'bg-ink/15'}`} />
            ))}
            <span className="ml-1 text-lg">➜</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="sun" onClick={() => void soundOut()}>🐢 Sound it out</Button>
            <Button variant="good" onClick={() => void blend()}>🐇 Say it fast</Button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t-[3px] border-ink bg-accent-soft px-3 py-2.5">
          <button type="button" aria-label="Previous word" onClick={() => go(-1)}
            className="chunky-sm flex h-11 w-11 items-center justify-center rounded-full bg-paper"><ChevronLeft size={24} /></button>
          <button type="button" onClick={() => void speak(word.word)} className="text-3xl font-black text-ink">
            {blended || done.has(i) ? word.word : '? ? ?'}
          </button>
          <button type="button" aria-label="Next word" onClick={() => go(1)}
            className="chunky-sm flex h-11 w-11 items-center justify-center rounded-full bg-paper"><ChevronRight size={24} /></button>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-bold text-ink-soft">Blended {done.size} of {words.length} words</p>
    </div>
  );
}
