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
}

export const AVATARS = ['🦁', '🦄', '🦖', '🚀', '🐱', '🐼', '🤖', '👑'];

export type Level = 1 | 2 | 3;

/** Tailwind class bundle for a section. Classes are written out in full so Tailwind can see them. */
export interface Theme {
  /** solid fill, e.g. bg-rose-500 */ solid: string;
  /** pale background */ soft: string;
  /** border colour */ border: string;
  /** text colour */ text: string;
  /** card gradient */ gradient: string;
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
