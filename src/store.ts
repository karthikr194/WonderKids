import { useCallback, useEffect, useState } from 'react';
import { Level, Profile, SECTION_IDS, SectionId, SectionStats } from './types';

const KEY = 'wonderkids:v2';
const ARCHIVE_KEY = 'wonderkids:players:v1';

export const STICKERS = [
  '🦖', '🦄', '🚀', '🌟', '🍭', '🍕', '🎮', '🌈', '🎸', '⚽', '🦋', '🍦',
  '🍩', '🏀', '🚗', '🎈', '🐙', '🦊', '🐼', '🎨', '🛸', '🧸', '🍓', '👑',
];
export const XP_PER_STICKER = 10;
export const XP_PER_LEVEL = 25;
export const DAILY_GOAL = 10;

const todayKey = () => new Date().toISOString().slice(0, 10);
export const starsToday = (p: Profile) => (p.today?.date === todayKey() ? p.today.stars : 0);

/** Progress (0–1) toward the next difficulty level of a section; 1 once at the top level. */
export function levelProgress(p: Profile, id: SectionId): number {
  if (levelFor(p, id) === 3) return 1;
  return (p.stats[id].xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}

const emptyStats = (): SectionStats => ({ xp: 0, streak: 0, correct: 0, attempts: 0 });

export const newProfile = (name: string, age: number, avatar: string): Profile => ({
  id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
  name, age, avatar, stickers: [],
  stats: Object.fromEntries(SECTION_IDS.map(id => [id, emptyStats()])) as Profile['stats'],
});

function load(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (!p?.name || !p.stats) return null;
    p.id ??= 'original';
    // Forward-compat: make sure every section has stats.
    for (const id of SECTION_IDS) p.stats[id] ??= emptyStats();
    return p;
  } catch {
    return null;
  }
}

function save(p: Profile | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch { /* private mode etc. – progress just won't persist */ }
}

export const totalXp = (p: Profile) => SECTION_IDS.reduce((n, id) => n + p.stats[id].xp, 0);

/** Difficulty of a section: grows with practice, and starts higher for older children. */
export function levelFor(p: Profile, id: SectionId): Level {
  const base = p.age >= 6 ? 2 : 1;
  const grown = Math.floor(p.stats[id].xp / XP_PER_LEVEL);
  return Math.min(3, base + grown) as Level;
}

/** Pure reducer: record one answer. Awards a sticker every XP_PER_STICKER stars. */
export function applyResult(p: Profile, id: SectionId, correct: boolean): Profile {
  const s = p.stats[id];
  const next: SectionStats = {
    xp: s.xp + (correct ? 1 : 0),
    streak: correct ? s.streak + 1 : 0,
    correct: s.correct + (correct ? 1 : 0),
    attempts: s.attempts + 1,
  };
  const stickers = [...p.stickers];
  const before = totalXp(p);
  if (correct && Math.floor((before + 1) / XP_PER_STICKER) > Math.floor(before / XP_PER_STICKER)) {
    const fresh = STICKERS.find(st => !stickers.includes(st));
    if (fresh) stickers.push(fresh);
  }
  const today = { date: todayKey(), stars: starsToday(p) + (correct ? 1 : 0) };
  return { ...p, stickers, today, stats: { ...p.stats, [id]: next } };
}

function savedPlayers(): Profile[] {
  try {
    const value = JSON.parse(localStorage.getItem(ARCHIVE_KEY) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(load);
  const [players, setPlayers] = useState(savedPlayers);
  useEffect(() => save(profile), [profile]);

  const record = useCallback(
    (id: SectionId, correct: boolean) => setProfile(p => (p ? applyResult(p, id, correct) : p)),
    [],
  );
  const signOut = useCallback(() => {
    if (!profile?.id) return;
    const next = [...players.filter(player => player.id !== profile.id), profile];
    try { localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next)); } catch {
      // Keep the active profile if archiving it would lose the saved copy.
      return;
    }
    setPlayers(next);
    setProfile(null);
  }, [profile, players]);
  return { profile, setProfile, record, signOut, players };
}
