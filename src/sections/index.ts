import type React from 'react';
import type { SectionDef, SectionId, Theme } from '../types';
import { phonicsModes } from './phonics';
import { numberWordModes } from './numberWords';
import { readingModes } from './reading';
import { mathModes } from './math';
import { timeModes } from './time';
import { worldModes } from './world';
import { shapesColorsModes } from './shapesColors';
import { brainModes } from './brain';
import { guidedModes } from './guided';

const THEMES: Record<string, Theme> = {
  coral: { accent: '#FF6B6B', soft: '#FFE3E0', deep: '#C4383F' },
  green: { accent: '#2BC48A', soft: '#D9F6E9', deep: '#11795A' },
  blue: { accent: '#4D96FF', soft: '#E0EDFF', deep: '#2860C2' },
  orange: { accent: '#FF9F1C', soft: '#FFEDD3', deep: '#B05F00' },
  purple: { accent: '#9B6BFF', soft: '#EDE4FF', deep: '#5E35C9' },
  teal: { accent: '#17BFA9', soft: '#D3F5F0', deep: '#0B7466' },
  pink: { accent: '#FF5FA2', soft: '#FFE1EE', deep: '#BE2A69' },
  indigo: { accent: '#6574FF', soft: '#E2E5FF', deep: '#3341C2' },
  leaf: { accent: '#5E8B2A', soft: '#E7F2D5', deep: '#3D5F14' },
};

export const SECTIONS: SectionDef[] = [
  { id: 'phonics', title: 'Phonics', subtitle: 'Real letter sounds, blending & word building', emoji: '🔊', isNew: true, theme: THEMES.coral, modes: phonicsModes },
  { id: 'numberWords', title: 'Number Words', subtitle: '7 = seven. Read, match and spell numbers', emoji: '🔢', isNew: true, theme: THEMES.green, modes: numberWordModes },
  { id: 'reading', title: 'Reading', subtitle: 'Sight words, sentences and picture words', emoji: '📚', isNew: true, theme: THEMES.blue, modes: readingModes },
  { id: 'math', title: 'Math Fun', subtitle: 'Count, add, take away and compare', emoji: '🧮', theme: THEMES.orange, modes: mathModes },
  { id: 'time', title: 'Time & Calendar', subtitle: 'Clocks, days, months and seasons', emoji: '⏰', isNew: true, theme: THEMES.purple, modes: timeModes },
  { id: 'world', title: 'My World', subtitle: 'Animals, everyday things and opposites', emoji: '🌍', isNew: true, theme: THEMES.teal, modes: worldModes },
  { id: 'shapesColors', title: 'Shapes & Colours', subtitle: 'Spot shapes, mix colours', emoji: '🎨', theme: THEMES.pink, modes: shapesColorsModes },
  { id: 'guided', title: 'Learn with a Grown-up', subtitle: 'Guided English & phonics: learn, together, your turn', emoji: '👨‍👧', isNew: true, theme: THEMES.leaf, modes: guidedModes },
  { id: 'brain', title: 'Brain Games', subtitle: 'Memory, patterns and riddles', emoji: '🧠', theme: THEMES.indigo, modes: brainModes },
];

export const sectionById = (id: SectionId) => SECTIONS.find(s => s.id === id)!;

/** Inline style that turns a theme into the CSS variables behind bg-accent, text-accent-deep, … */
export const themeStyle = (t: Theme) =>
  ({ '--accent': t.accent, '--accent-soft': t.soft, '--accent-deep': t.deep }) as React.CSSProperties;
