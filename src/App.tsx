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
import { Button } from './components/ui/Button';
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
            onClick={() => setSticker(null)}
            role="dialog" aria-label="New sticker"
          >
            <motion.div
              initial={{ scale: 0.5, y: 80 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.5, y: 80 }}
              onClick={e => e.stopPropagation()}
              className="chunky relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-paper p-8 text-center"
            >
              <p className="mx-auto mb-2 w-fit rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-sm font-black uppercase tracking-wider">New sticker!</p>
              <h2 className="mb-5 text-3xl font-black">You earned it! 🎉</h2>
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
                className="chunky mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-sun/40 text-[96px] leading-none"
              >{sticker}</motion.div>
              <Button size="lg" variant="good" onClick={() => setSticker(null)}>Awesome!</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
