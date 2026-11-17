import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { SectionScreen } from './components/SectionScreen';
import { SECTIONS } from './sections';
import { useProfile } from './store';
import { setSoundEnabled, stopSpeaking } from './lib/speech';
import { sfx } from './lib/sfx';
import { fireworks } from './lib/confetti';
import type { ModeDef, SectionDef } from './types';

const SOUND_KEY = 'wonderkids:sound';
const readSound = () => { try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; } };

export default function App() {
  const { profile, setProfile, record, signOut } = useProfile();
  const [section, setSection] = useState<SectionDef | null>(null);
  const [mode, setMode] = useState<ModeDef | null>(null);
  const [soundOn, setSoundOn] = useState(readSound);
  const [sticker, setSticker] = useState<string | null>(null);
  const stickerCount = useRef(profile?.stickers.length ?? 0);

  useEffect(() => {
    setSoundEnabled(soundOn);
    try { localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off'); } catch { /* ignore */ }
  }, [soundOn]);

  // Celebrate each newly earned sticker.
  useEffect(() => {
    const n = profile?.stickers.length ?? 0;
    if (profile && n > stickerCount.current) {
      setSticker(profile.stickers[n - 1]);
      sfx.sticker();
      fireworks();
    }
    stickerCount.current = n;
  }, [profile]);

  if (!profile) return <Onboarding onComplete={setProfile} />;

  const goHome = () => { setSection(null); setMode(null); };
  const goBack = () => (mode ? setMode(null) : goHome());

  return (
    <div className="min-h-dvh">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${section?.id ?? 'home'}-${mode?.id ?? 'menu'}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.18 }}
        >
          {section ? (
            <SectionScreen
              section={section}
              mode={mode}
              profile={profile}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn(s => !s)}
              onPickMode={setMode}
              onBack={goBack}
              onResult={ok => record(section.id, ok)}
            />
          ) : (
            <Home
              profile={profile}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn(s => !s)}
              onOpen={s => { stopSpeaking(); setSection(SECTIONS.find(x => x.id === s.id)!); }}
              onSignOut={() => { if (window.confirm('Switch player? This clears the current player\'s stars and stickers.')) signOut(); }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {sticker && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSticker(null)}
            role="dialog" aria-label="New sticker"
          >
            <motion.div
              initial={{ scale: 0.5, y: 80 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.5, y: 80 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 text-center sm:p-12"
            >
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400" />
              <h2 className="mb-1 text-3xl font-black text-slate-800">New sticker!</h2>
              <p className="mb-6 text-slate-500">You are doing great!</p>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                className="mb-6 text-[110px] leading-none"
              >{sticker}</motion.div>
              <button
                type="button"
                onClick={() => setSticker(null)}
                className="w-full rounded-2xl border-b-4 border-blue-700 bg-blue-500 py-4 text-xl font-bold text-white shadow-lg active:translate-y-1 active:border-b-0"
              >Awesome!</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
