export interface ActivityStats {
  level: number;
  xp: number;
  streak: number;
}

export interface UserProfile {
  name: string;
  age: number;
  avatar: string;
  stickers: string[];
  stats: Record<ActivityType, ActivityStats>;
}

export enum ActivityType {
  ALPHABET = 'ALPHABET',
  NUMBERS = 'NUMBERS',
  COLORS = 'COLORS',
  LOGIC = 'LOGIC',
  SHAPES = 'SHAPES',
  MEMORY = 'MEMORY',
  IDENTIFY = 'IDENTIFY',
}

export interface LogicQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ColorItem {
  name: string;
  hex: string;
}

export const AVATARS = ['🦁', '🦄', '🦖', '🚀', '🐱', '🐼', '🤖', '👑'];
