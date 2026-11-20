import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLearningProgress } from './learning/useLearningProgress';
import { languageInfo, languages, type Language } from './learning/curriculum';
import { Picture } from './learning/Picture';
import { LanguageCourse } from './components/LanguageCourse';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { SectionScreen } from './components/SectionScreen';
import { useProfile } from './store';
import { setSoundEnabled, stopSpeaking } from './lib/speech';
import { sfx } from './lib/sfx';
import { fireworks } from './lib/confetti';
import { Button } from './components/ui/Button';
import type { ModeDef, SectionDef } from './types';

const SOUND_KEY = 'wonderkids:sound';
const readSound = () => { try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; } };

export default function App() {
  const player = useProfile();
  if (!player.profile) return <>
    {player.players.length > 0 && <section className="wk-shell">
      <h2 className="mb-3 text-xl font-bold">Choose a player</h2>
      <div className="flex flex-wrap gap-2">{player.players.map(profile =>
        <button key={profile.id} className="wk-button" onClick={() => player.setProfile(profile)}>{profile.avatar} {profile.name}</button>)}</div>
    </section>}
    <Onboarding onComplete={player.setProfile} />
  </>;
  return <LearningApp key={player.profile.id} profile={player.profile} record={player.record} signOut={player.signOut} />;
}

function LearningApp({ profile, record, signOut }: Pick<ReturnType<typeof useProfile>, 'record' | 'signOut'> & {
  profile: NonNullable<ReturnType<typeof useProfile>['profile']>;
}) {
  const { progress, update } = useLearningProgress(profile.id ?? 'original');
  const [languageCourse, setLanguageCourse] = useState<Language | 'parent'>();
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

  const goHome = () => { setSection(null); setMode(null); setLanguageCourse(undefined); };
  const goBack = () => (mode ? setMode(null) : goHome());

  return (
    <div className="min-h-dvh">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${languageCourse ? 'languages' : section?.id ?? 'home'}-${mode?.id ?? 'menu'}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.18 }}
        >
          {languageCourse ? (
            <LanguageCourse initial={languageCourse} progress={progress} update={update} soundOn={soundOn}
              onToggleSound={() => setSoundOn(value => !value)} onBack={goHome} />
          ) : section ? (
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
            <Home profile={profile} soundOn={soundOn} onToggleSound={() => setSoundOn(s => !s)}
              onOpen={s => { stopSpeaking(); setSection(s); }}
              onSignOut={() => { stopSpeaking(); signOut(); }}
              languagePanel={<section className="wk-panel">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2>Learn with Ollie</h2>
                  <button className="wk-button" onClick={() => setLanguageCourse('parent')}>Parent dashboard</button>
                </div>
                <div className="wk-home-grid">{languages.map(language => <button key={language} lang={language}
                  className="wk-home-card" style={{ background: languageInfo[language].color }}
                  onClick={() => setLanguageCourse(language)}>
                  <Picture asset={languageInfo[language].art} label="" />{languageInfo[language].title}
                </button>)}</div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="wk-button wk-primary" onClick={() => setLanguageCourse(
                    [...languages].sort((a, b) => (progress[b]?.lastPracticed ?? '').localeCompare(progress[a]?.lastPracticed ?? ''))[0]
                  )}>Continue learning</button>
                  <span>{Object.values(progress).reduce((total, course) => total + course.stars, 0)} language stars</span>
                </div>
              </section>} />
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
