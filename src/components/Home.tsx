import { motion } from 'framer-motion';
import { Star, LogOut, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { SECTIONS, themeStyle } from '../sections';
import { DAILY_GOAL, STICKERS, XP_PER_STICKER, levelFor, levelProgress, starsToday, totalXp } from '../store';
import { IconButton } from './ui/Button';
import { MascotAvatar } from './ui/Mascot';
import type { Profile, SectionDef } from '../types';

interface Props {
  profile: Profile;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpen: (s: SectionDef) => void;
  onSignOut: () => void;
}

/** The section to suggest: the least-practised one (new sections win ties). */
function suggestion(p: Profile): SectionDef {
  return [...SECTIONS].sort((a, b) =>
    p.stats[a.id].xp - p.stats[b.id].xp || Number(!!b.isNew) - Number(!!a.isNew))[0];
}

export function Home({ profile, soundOn, onToggleSound, onOpen, onSignOut }: Props) {
  const stars = totalXp(profile);
  const today = starsToday(profile);
  const goalPct = Math.min(1, today / DAILY_GOAL);
  const toSticker = XP_PER_STICKER - (stars % XP_PER_STICKER);
  const pick = suggestion(profile);
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-5xl px-4 pb-14 pt-4 sm:px-8 sm:pt-8">
      {/* top bar */}
      <header className="mb-6 flex items-center gap-2">
        <div className="chunky-sm flex min-w-0 shrink items-center gap-2.5 rounded-full bg-paper py-1.5 pl-1.5 pr-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun text-3xl">{profile.avatar}</span>
          <span className="max-w-[9rem] truncate text-xl font-black">{profile.name}</span>
        </div>
        <div className="min-w-0 flex-1" />
        <div className="chunky-sm flex h-12 items-center gap-1.5 rounded-2xl bg-paper px-3 text-lg font-black" aria-label={`${stars} stars`}>
          <Star size={20} strokeWidth={2.5} className="fill-sun" /> {stars}
        </div>
        <IconButton label={soundOn ? 'Mute sound' : 'Turn sound on'} onClick={onToggleSound}>
          {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </IconButton>
        <IconButton label="Switch player" onClick={onSignOut}><LogOut size={20} /></IconButton>
      </header>

      {/* hero: greeting, daily goal, suggestion */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={themeStyle(pick.theme)}
        className="chunky mb-8 overflow-hidden rounded-[2.25rem] bg-paper"
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex flex-1 items-start gap-4">
            <MascotAvatar size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-ink-soft">{hello},</p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">{profile.name}! 👋</h1>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-sm font-bold text-ink-soft">
                  <span>Today's goal</span>
                  <span>{Math.min(today, DAILY_GOAL)} / {DAILY_GOAL} ⭐</span>
                </div>
                <div className="chunky-sm h-5 overflow-hidden rounded-full bg-cream">
                  <motion.div
                    className="h-full rounded-full bg-sun"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalPct * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                </div>
                {goalPct >= 1 && <p className="mt-1 text-sm font-bold text-good">Goal reached – amazing! 🎉</p>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpen(pick)}
            className="chunky flex items-center gap-3 rounded-3xl bg-accent p-4 text-left text-white sm:w-72"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-4xl">{pick.emoji}</span>
            <span className="flex-1">
              <span className="block text-sm font-bold uppercase tracking-wider text-white/85">Let's play</span>
              <span className="block text-2xl font-black leading-tight">{pick.title}</span>
            </span>
            <ChevronRight size={28} strokeWidth={3} />
          </button>
        </div>
      </motion.section>

      <h2 className="mb-4 text-2xl font-black">Pick a subject</h2>
      <main className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {SECTIONS.map((s, i) => {
          const level = levelFor(profile, s.id);
          return (
            <motion.button
              key={s.id}
              type="button"
              style={themeStyle(s.theme)}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              onClick={() => onOpen(s)}
              className="chunky relative flex flex-col overflow-hidden rounded-[1.75rem] bg-accent-soft text-left"
            >
              {s.isNew && (
                <span className="absolute right-2.5 top-2.5 rounded-full border-2 border-ink bg-sun px-2 text-[11px] font-black uppercase tracking-wide">New</span>
              )}
              <div className="flex flex-1 flex-col p-4">
                <span className="chunky-sm mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-paper text-3xl sm:h-16 sm:w-16 sm:text-4xl">{s.emoji}</span>
                <h3 className="text-lg font-black leading-tight sm:text-xl">{s.title}</h3>
                <p className="mt-1 hidden text-sm font-semibold leading-snug text-ink-soft sm:block">{s.subtitle}</p>
              </div>
              <div className="border-t-[3px] border-ink bg-paper px-4 py-2.5">
                <div className="mb-1.5 flex items-center justify-between text-xs font-black text-ink-soft">
                  <span>LEVEL {level}</span>
                  <span className="flex items-center gap-1"><Star size={12} className="fill-sun text-ink" /> {profile.stats[s.id].xp}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${levelProgress(profile, s.id) * 100}%` }} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </main>

      <section className="chunky rounded-[2rem] bg-paper p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-black">📒 My Sticker Book</h2>
          <span className="text-sm font-bold text-ink-soft">
            {profile.stickers.length}/{STICKERS.length} · next in {toSticker} ⭐
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
          {STICKERS.map(st => {
            const own = profile.stickers.includes(st);
            return (
              <div key={st} aria-label={own ? st : 'Locked sticker'}
                className={`flex aspect-square items-center justify-center rounded-2xl text-2xl sm:text-3xl
                  ${own ? 'chunky-sm rotate-[-4deg] bg-sun/40' : 'border-2 border-dashed border-ink/20 text-base text-ink/25'}`}>
                {own ? st : '?'}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
