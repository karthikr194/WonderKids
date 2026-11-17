import { useCallback, useEffect, useState } from 'react';
import { Level, Profile, SECTION_IDS, SectionId, SectionStats } from './types';

const KEY = 'wonderkids:v2';

export const STICKERS = [
  '🦖', '🦄', '🚀', '🌟', '🍭', '🍕', '🎮', '🌈', '🎸', '⚽', '🦋', '🍦',
  '🍩', '🏀', '🚗', '🎈', '🐙', '🦊', '🐼', '🎨', '🛸', '🧸', '🍓', '👑',
];
export const XP_PER_STICKER = 10;
export const XP_PER_LEVEL = 25;

const emptyStats = (): SectionStats => ({ xp: 0, streak: 0, correct: 0, attempts: 0 });

export const newProfile = (name: string, age: number, avatar: string): Profile => ({
  name, age, avatar, stickers: [],
  stats: Object.fromEntries(SECTION_IDS.map(id => [id, emptyStats()])) as Profile['stats'],
});

function load(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (!p?.name || !p.stats) return null;
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
  return { ...p, stickers, stats: { ...p.stats, [id]: next } };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(load);
  useEffect(() => save(profile), [profile]);

  const record = useCallback(
    (id: SectionId, correct: boolean) => setProfile(p => (p ? applyResult(p, id, correct) : p)),
    [],
  );
  const signOut = useCallback(() => setProfile(null), []);
  return { profile, setProfile, record, signOut };
}
