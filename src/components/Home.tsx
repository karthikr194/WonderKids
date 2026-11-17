import { motion } from 'framer-motion';
import { Star, LogOut, Volume2, VolumeX } from 'lucide-react';
import { SECTIONS } from '../sections';
import { STICKERS, XP_PER_STICKER, levelFor, totalXp } from '../store';
import type { Profile, SectionDef } from '../types';

interface Props {
  profile: Profile;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpen: (s: SectionDef) => void;
  onSignOut: () => void;
}

export function Home({ profile, soundOn, onToggleSound, onOpen, onSignOut }: Props) {
  const stars = totalXp(profile);
  const toNext = XP_PER_STICKER - (stars % XP_PER_STICKER);

  return (
    <div className="mx-auto max-w-6xl p-4 pb-12 sm:p-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-yellow-400 bg-white text-4xl shadow-lg sm:h-20 sm:w-20 sm:text-5xl">
            {profile.avatar}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-500">Hello,</p>
            <h1 className="text-3xl font-black text-blue-500 sm:text-4xl">{profile.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-yellow-100 bg-white px-3 py-2 font-bold text-yellow-600 shadow-sm" aria-label={`${stars} stars`}>
            <Star className="fill-yellow-400 text-yellow-500" size={20} /> {stars}
          </div>
          <button type="button" onClick={onToggleSound} aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}
            className="rounded-xl bg-white p-2.5 text-slate-500 shadow-sm active:scale-90">
            {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <button type="button" onClick={onSignOut} aria-label="Switch player"
            className="rounded-xl bg-white p-2.5 text-slate-500 shadow-sm active:scale-90">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div className="mb-6 rounded-2xl bg-white/70 p-3 text-center text-base font-semibold text-slate-500">
        ⭐ {toNext} more {toNext === 1 ? 'star' : 'stars'} until your next sticker!
      </div>

      <h2 className="mb-4 text-2xl font-black text-slate-700">What shall we learn today?</h2>
      <main className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpen(s)}
            className={`group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-[2rem] border-b-8 border-black/10 bg-gradient-to-br p-5 text-left text-white shadow-xl ${s.theme.gradient}`}
          >
            <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />
            {s.isNew && <span className="absolute right-3 top-3 rounded-full bg-yellow-300 px-2.5 py-0.5 text-xs font-black uppercase tracking-wide text-yellow-900">New</span>}
            <div className="relative">
              <div className="mb-2 text-5xl drop-shadow">{s.emoji}</div>
              <h3 className="text-2xl font-black leading-tight drop-shadow">{s.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-snug text-white/90">{s.subtitle}</p>
            </div>
            <div className="relative mt-3 flex items-center justify-between rounded-xl bg-black/15 px-3 py-1 text-sm font-bold">
              <span>Level {levelFor(profile, s.id)}</span>
              <span className="flex items-center gap-1"><Star size={14} className="fill-white" /> {profile.stats[s.id].xp}</span>
            </div>
          </motion.button>
        ))}
      </main>

      <section className="rounded-3xl border-4 border-white bg-white/60 p-5 sm:p-6">
        <h2 className="mb-4 text-xl font-black text-slate-600">
          📒 Sticker Book <span className="text-sm font-semibold text-slate-400">({profile.stickers.length}/{STICKERS.length})</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {STICKERS.map(st => {
            const own = profile.stickers.includes(st);
            return (
              <div key={st} aria-label={own ? st : 'Locked sticker'}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-3xl sm:h-16 sm:w-16 sm:text-4xl ${own ? 'border-yellow-200 bg-white shadow-sm' : 'border-slate-200 bg-slate-100 opacity-50 grayscale'}`}>
                {own ? st : '🔒'}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
