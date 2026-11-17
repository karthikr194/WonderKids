import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playPhoneme, speak, speakSequence, stopSpeaking } from '../../lib/speech';
import { sfx } from '../../lib/sfx';
import { burst } from '../../lib/confetti';
import { PHONEME_BY_GRAPHEME, sayUnit, type BlendWord } from '../../data/phonics';
import { Button } from '../ui/Button';
import type { Theme } from '../../types';

interface Props {
  words: BlendWord[];
  theme: Theme;
  onResult: (correct: boolean) => void;
}

/**
 * Sounding out: tap each letter (or letter team) to hear its sound,
 * "Sound it out" says the sounds one by one, "Say it fast" blends them into the word.
 */
export function BlendIt({ words, theme, onResult }: Props) {
  const [i, setI] = useState(0);
  const [active, setActive] = useState(-1);
  const [blended, setBlended] = useState(false);
  const word = words[i];

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => { setActive(-1); setBlended(false); }, [i]);

  const tapUnit = (unit: string, idx: number) => {
    sfx.tap();
    setActive(idx);
    void playPhoneme(unit, sayUnit(unit)).then(() => setActive(-1));
  };

  const soundOut = async () => {
    await speakSequence(
      word.units.map((u, idx) => ({
        text: sayUnit(u), rate: 0.55, pitch: 1, pause: 350, onStart: () => setActive(idx),
      })),
    );
    setActive(-1);
  };

  const blend = async () => {
    await speakSequence([
      ...word.units.map((u, idx) => ({ text: sayUnit(u), rate: 0.55, pitch: 1, pause: 120, onStart: () => setActive(idx) })),
      { text: word.word, rate: 0.75, onStart: () => setActive(-1) },
    ]);
    if (!blended) {
      setBlended(true);
      onResult(true);
      burst();
      sfx.correct();
    }
  };

  const go = (d: number) => setI(n => (n + d + words.length) % words.length);

  return (
    <div className="mx-auto w-full max-w-2xl rounded-[2rem] bg-white p-5 text-center shadow-xl sm:p-8">
      <p className="mb-2 text-xl font-bold text-slate-500">Tap each sound, then blend them together!</p>
      <div className="mb-4 text-9xl" aria-hidden>{word.emoji}</div>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {word.units.map((u, idx) => (
          <motion.button
            key={`${i}-${idx}`}
            type="button"
            whileTap={{ scale: 0.9 }}
            animate={{ y: active === idx ? -14 : 0, scale: active === idx ? 1.15 : 1 }}
            onClick={() => tapUnit(u, idx)}
            aria-label={`Sound ${PHONEME_BY_GRAPHEME[u]?.ipa ?? u}`}
            className={`h-24 min-w-20 rounded-3xl border-b-[6px] px-4 text-6xl font-black shadow-md sm:h-28 sm:min-w-24 sm:text-7xl
              ${active === idx ? 'border-yellow-600 bg-yellow-300 text-yellow-900' : `${theme.solid} border-black/20 text-white`}`}
          >
            {u}
          </motion.button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button variant="warn" onClick={() => void soundOut()}>🐢 Sound it out</Button>
        <Button variant="success" onClick={() => void blend()}>🐇 Say it fast</Button>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" aria-label="Previous word" onClick={() => go(-1)} className="rounded-full bg-slate-100 p-3 text-slate-500 active:scale-90"><ChevronLeft size={28} /></button>
        <button type="button" onClick={() => void speak(word.word)} className="text-3xl font-black text-slate-600">{word.word}</button>
        <button type="button" aria-label="Next word" onClick={() => go(1)} className="rounded-full bg-slate-100 p-3 text-slate-500 active:scale-90"><ChevronRight size={28} /></button>
      </div>
    </div>
  );
}
