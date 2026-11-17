import type { SectionDef, SectionId, Theme } from '../types';
import { phonicsModes } from './phonics';
import { numberWordModes } from './numberWords';
import { readingModes } from './reading';
import { mathModes } from './math';
import { timeModes } from './time';
import { worldModes } from './world';
import { shapesColorsModes } from './shapesColors';
import { brainModes } from './brain';

// Class names are spelled out in full so Tailwind's scanner can find them.
const THEMES: Record<string, Theme> = {
  rose: { solid: 'bg-rose-500', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', gradient: 'from-rose-400 to-red-500' },
  emerald: { solid: 'bg-emerald-500', soft: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', gradient: 'from-emerald-400 to-green-500' },
  sky: { solid: 'bg-sky-500', soft: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', gradient: 'from-sky-400 to-blue-500' },
  amber: { solid: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', gradient: 'from-amber-400 to-orange-500' },
  violet: { solid: 'bg-violet-500', soft: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', gradient: 'from-violet-400 to-purple-500' },
  teal: { solid: 'bg-teal-500', soft: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', gradient: 'from-teal-400 to-cyan-500' },
  pink: { solid: 'bg-pink-500', soft: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', gradient: 'from-pink-400 to-fuchsia-500' },
  indigo: { solid: 'bg-indigo-500', soft: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', gradient: 'from-indigo-400 to-blue-600' },
};

export const SECTIONS: SectionDef[] = [
  { id: 'phonics', title: 'Phonics', subtitle: 'Real letter sounds, blending & word building', emoji: '🔊', isNew: true, theme: THEMES.rose, modes: phonicsModes },
  { id: 'numberWords', title: 'Number Words', subtitle: '7 = seven. Read, match and spell numbers', emoji: '🔢', isNew: true, theme: THEMES.emerald, modes: numberWordModes },
  { id: 'reading', title: 'Reading', subtitle: 'Sight words, sentences and picture words', emoji: '📚', isNew: true, theme: THEMES.sky, modes: readingModes },
  { id: 'math', title: 'Math Fun', subtitle: 'Count, add, take away and compare', emoji: '🧮', theme: THEMES.amber, modes: mathModes },
  { id: 'time', title: 'Time & Calendar', subtitle: 'Clocks, days, months and seasons', emoji: '⏰', isNew: true, theme: THEMES.violet, modes: timeModes },
  { id: 'world', title: 'My World', subtitle: 'Animals, everyday things and opposites', emoji: '🌍', isNew: true, theme: THEMES.teal, modes: worldModes },
  { id: 'shapesColors', title: 'Shapes & Colours', subtitle: 'Spot shapes, mix colours', emoji: '🎨', theme: THEMES.pink, modes: shapesColorsModes },
  { id: 'brain', title: 'Brain Games', subtitle: 'Memory, patterns and riddles', emoji: '🧠', theme: THEMES.indigo, modes: brainModes },
];

export const sectionById = (id: SectionId) => SECTIONS.find(s => s.id === id)!;
