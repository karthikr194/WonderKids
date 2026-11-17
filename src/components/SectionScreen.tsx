import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Star, Volume2, VolumeX } from 'lucide-react';
import { stopSpeaking } from '../lib/speech';
import { XP_PER_LEVEL, levelFor, levelProgress } from '../store';
import { themeStyle } from '../sections';
import { IconButton } from './ui/Button';
import type { ModeDef, Profile, SectionDef } from '../types';

interface Props {
  section: SectionDef;
  mode: ModeDef | null;
  profile: Profile;
  soundOn: boolean;
  onToggleSound: () => void;
  onPickMode: (m: ModeDef) => void;
  onBack: () => void;
  onResult: (correct: boolean) => void;
}

/** Either the activity list of a section, or the frame around a running activity. */
export function SectionScreen({ section, mode, profile, soundOn, onToggleSound, onPickMode, onBack, onResult }: Props) {
  const level = levelFor(profile, section.id);
  const stats = profile.stats[section.id];
  const back = () => { stopSpeaking(); onBack(); };

  return (
    <div style={themeStyle(section.theme)} className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-8">
          <IconButton label="Back" onClick={back}><ArrowLeft size={24} strokeWidth={2.5} /></IconButton>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black sm:text-2xl">{mode ? mode.title : section.title}</h1>
            <p className="truncate text-sm font-bold text-accent-deep">{mode ? `${section.emoji} ${section.title}` : section.subtitle}</p>
          </div>
          <div className="chunky-sm flex h-12 items-center gap-1.5 rounded-2xl bg-paper px-3 font-black">
            <Star size={18} strokeWidth={2.5} className="fill-sun" /> {stats.xp}
          </div>
          <IconButton label={soundOn ? 'Mute sound' : 'Turn sound on'} onClick={onToggleSound}>
            {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </IconButton>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-8 sm:pt-8">
        {mode ? (
          <motion.div key={mode.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {mode.render({ level, theme: section.theme, user: profile, onResult, onExit: back })}
          </motion.div>
        ) : (
          <div className="pb-12">
            <motion.section
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="chunky relative mb-7 overflow-hidden rounded-[2.25rem] bg-accent p-6 text-white sm:p-8"
            >
              <span className="pointer-events-none absolute -right-6 -top-8 text-[9rem] opacity-25 sm:text-[11rem]" aria-hidden>{section.emoji}</span>
              <div className="relative flex items-center gap-4">
                <span className="chunky-sm flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-paper text-5xl">{section.emoji}</span>
                <div className="min-w-0">
                  <h2 className="text-3xl font-black leading-tight sm:text-4xl">{section.title}</h2>
                  <p className="font-semibold text-white/90">{section.subtitle}</p>
                </div>
              </div>
              <div className="relative mt-5">
                <div className="mb-1 flex justify-between text-sm font-black">
                  <span>Level {level} of 3</span>
                  <span>{level === 3 ? 'Top level! 🏆' : `${XP_PER_LEVEL - (stats.xp % XP_PER_LEVEL)} ⭐ to level ${level + 1}`}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full border-[3px] border-ink bg-white/30">
                  <div className="h-full rounded-full bg-sun" style={{ width: `${levelProgress(profile, section.id) * 100}%` }} />
                </div>
              </div>
            </motion.section>

            <h3 className="mb-3 text-xl font-black">Activities</h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {section.modes.map((m, i) => (
                <motion.button
                  key={m.id}
                  type="button"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onPickMode(m)}
                  className="chunky flex items-center gap-4 rounded-3xl bg-paper p-3.5 text-left"
                >
                  <span className="chunky-sm flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-4xl">{m.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-black leading-tight">{m.title}</span>
                    <span className="block text-sm font-semibold leading-snug text-ink-soft">{m.desc}</span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <ChevronRight size={22} strokeWidth={3} />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
