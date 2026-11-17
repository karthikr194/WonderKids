export interface ColorItem { name: string; hex: string; things: { name: string; emoji: string }[] }

export const COLORS: ColorItem[] = [
  { name: 'Red', hex: '#EF4444', things: [{ name: 'apple', emoji: '🍎' }, { name: 'strawberry', emoji: '🍓' }, { name: 'fire truck', emoji: '🚒' }] },
  { name: 'Blue', hex: '#3B82F6', things: [{ name: 'whale', emoji: '🐋' }, { name: 'blueberries', emoji: '🫐' }, { name: 'ocean', emoji: '🌊' }] },
  { name: 'Green', hex: '#22C55E', things: [{ name: 'frog', emoji: '🐸' }, { name: 'broccoli', emoji: '🥦' }, { name: 'tree', emoji: '🌲' }] },
  { name: 'Yellow', hex: '#FACC15', things: [{ name: 'banana', emoji: '🍌' }, { name: 'sun', emoji: '🌞' }, { name: 'duckling', emoji: '🐥' }] },
  { name: 'Orange', hex: '#F97316', things: [{ name: 'orange', emoji: '🍊' }, { name: 'carrot', emoji: '🥕' }, { name: 'pumpkin', emoji: '🎃' }] },
  { name: 'Purple', hex: '#A855F7', things: [{ name: 'grapes', emoji: '🍇' }, { name: 'eggplant', emoji: '🍆' }, { name: 'octopus', emoji: '🐙' }] },
  { name: 'Pink', hex: '#EC4899', things: [{ name: 'flamingo', emoji: '🦩' }, { name: 'piglet', emoji: '🐷' }, { name: 'cherry blossom', emoji: '🌸' }] },
  { name: 'Brown', hex: '#92400E', things: [{ name: 'bear', emoji: '🐻' }, { name: 'chocolate', emoji: '🍫' }, { name: 'coconut', emoji: '🥥' }] },
  { name: 'Black', hex: '#111827', things: [{ name: 'bat', emoji: '🦇' }, { name: 'spider', emoji: '🕷️' }, { name: 'crow', emoji: '🐦‍⬛' }] },
  { name: 'White', hex: '#F8FAFC', things: [{ name: 'snowman', emoji: '⛄' }, { name: 'cloud', emoji: '☁️' }, { name: 'ghost', emoji: '👻' }] },
  { name: 'Gray', hex: '#9CA3AF', things: [{ name: 'elephant', emoji: '🐘' }, { name: 'mouse', emoji: '🐭' }, { name: 'rock', emoji: '🪨' }] },
];

export const COLOR_MIXES: { a: string; b: string; result: string }[] = [
  { a: 'Red', b: 'Yellow', result: 'Orange' },
  { a: 'Blue', b: 'Yellow', result: 'Green' },
  { a: 'Red', b: 'Blue', result: 'Purple' },
  { a: 'Red', b: 'White', result: 'Pink' },
  { a: 'Black', b: 'White', result: 'Gray' },
];

export const colorByName = (n: string) => COLORS.find(c => c.name === n)!;

export interface ShapeItem { name: string; path: string; color: string; sides: number }

export const SHAPES: ShapeItem[] = [
  { name: 'Circle', path: 'M50 10 a40 40 0 1 0 0.01 0 Z', color: '#EF4444', sides: 0 },
  { name: 'Square', path: 'M15 15 H85 V85 H15 Z', color: '#3B82F6', sides: 4 },
  { name: 'Triangle', path: 'M50 10 L90 88 H10 Z', color: '#22C55E', sides: 3 },
  { name: 'Rectangle', path: 'M8 30 H92 V70 H8 Z', color: '#10B981', sides: 4 },
  { name: 'Star', path: 'M50 8 L61 36 L91 38 L68 57 L76 87 L50 70 L24 87 L32 57 L9 38 L39 36 Z', color: '#EAB308', sides: 10 },
  { name: 'Heart', path: 'M50 88 C8 56 8 22 30 14 C42 10 50 18 50 28 C50 18 58 10 70 14 C92 22 92 56 50 88 Z', color: '#EC4899', sides: 0 },
  { name: 'Diamond', path: 'M50 6 L90 50 L50 94 L10 50 Z', color: '#A855F7', sides: 4 },
  { name: 'Pentagon', path: 'M50 8 L92 38 L76 88 H24 L8 38 Z', color: '#14B8A6', sides: 5 },
  { name: 'Hexagon', path: 'M50 6 L90 28 V72 L50 94 L10 72 V28 Z', color: '#F97316', sides: 6 },
  { name: 'Octagon', path: 'M32 8 H68 L92 32 V68 L68 92 H32 L8 68 V32 Z', color: '#F59E0B', sides: 8 },
  { name: 'Oval', path: 'M50 24 a44 26 0 1 0 0.01 0 Z', color: '#6366F1', sides: 0 },
  { name: 'Crescent', path: 'M66 8 A42 42 0 0 0 66 92 A62 62 0 0 1 66 8 Z', color: '#FBBF24', sides: 0 },
];

export const sidesWord = (n: number) => (n === 0 ? 'no straight sides' : `${n} sides`);
