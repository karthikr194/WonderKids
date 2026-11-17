import { motion } from 'framer-motion';
import { ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';
import { stopSpeaking } from '../lib/speech';
import { levelFor } from '../store';
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

/** Either the mode menu of a section, or the frame around a running mode. */
export function SectionScreen({ section, mode, profile, soundOn, onToggleSound, onPickMode, onBack, onResult }: Props) {
  const level = levelFor(profile, section.id);
  const stats = profile.stats[section.id];

  const back = () => { stopSpeaking(); onBack(); };

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col p-4 pb-10 sm:p-8">
      <header className={`mb-6 flex items-center gap-3 rounded-3xl bg-gradient-to-r p-3 text-white shadow-lg ${section.theme.gradient}`}>
        <button type="button" onClick={back} aria-label="Back" className="rounded-2xl bg-white/25 p-2.5 active:scale-90 sm:p-3">
          <ArrowLeft size={26} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-black sm:text-3xl">
            {mode ? `${mode.emoji} ${mode.title}` : `${section.emoji} ${section.title}`}
          </h1>
          <p className="truncate text-sm font-semibold text-white/90">
            {mode ? section.title : section.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-black/15 px-3 py-2 text-sm font-bold">
          <span className="hidden sm:inline">Lv {level} ·</span> <Star size={14} className="fill-white" /> {stats.xp}
        </div>
        <button type="button" onClick={onToggleSound} aria-label={soundOn ? 'Mute sound' : 'Turn sound on'} className="rounded-2xl bg-white/25 p-3 active:scale-90">
          {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </header>

      {mode ? (
        <motion.div key={mode.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          {mode.render({ level, theme: section.theme, user: profile, onResult, onExit: back })}
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {section.modes.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPickMode(m)}
              className={`flex items-center gap-4 rounded-3xl border-4 border-b-8 bg-white p-4 text-left shadow-md ${section.theme.border}`}
            >
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl ${section.theme.soft}`}>{m.emoji}</span>
              <span>
                <span className="block text-xl font-black text-slate-700">{m.title}</span>
                <span className="block text-sm font-semibold text-slate-500">{m.desc}</span>
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
