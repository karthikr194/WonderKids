import type { ReactNode } from 'react';

export type SectionId =
  | 'phonics' | 'numberWords' | 'reading' | 'math' | 'time' | 'world' | 'shapesColors' | 'brain';

export const SECTION_IDS: SectionId[] = [
  'phonics', 'numberWords', 'reading', 'math', 'time', 'world', 'shapesColors', 'brain',
];

export interface SectionStats { xp: number; streak: number; correct: number; attempts: number }

export interface Profile {
  name: string;
  age: number;
  avatar: string;
  stickers: string[];
  stats: Record<SectionId, SectionStats>;
  /** Stars earned today, for the daily goal. */
  today?: { date: string; stars: number };
}

export const AVATARS = ['🦁', '🦄', '🦖', '🚀', '🐱', '🐼', '🤖', '👑'];

export type Level = 1 | 2 | 3;

/** A section's colours. Applied as CSS variables, used through the accent-* Tailwind colours. */
export interface Theme {
  accent: string;
  soft: string;
  deep: string;
}

export interface ModeProps {
  level: Level;
  theme: Theme;
  user: Profile;
  /** Report one answered question. Only the first try per question should be reported. */
  onResult: (correct: boolean) => void;
  onExit: () => void;
}

export interface ModeDef {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  render: (props: ModeProps) => ReactNode;
}

export interface SectionDef {
  id: SectionId;
  title: string;
  subtitle: string;
  emoji: string;
  isNew?: boolean;
  theme: Theme;
  modes: ModeDef[];
}
