const entries = [
  ['🍎', 'apple'], ['⚽', 'ball'], ['🐱', 'cat'], ['🐶', 'dog'], ['🐘', 'elephant'], ['🐟', 'fish'],
  ['🍇', 'grapes'], ['🎩', 'hat'], ['🍦', 'ice-cream'], ['🏺', 'jug'], ['🪁', 'kite'], ['🦁', 'lion'],
  ['🥭', 'mango'], ['🍊', 'orange'], ['🦜', 'parrot'], ['👑', 'queen'], ['🐰', 'rabbit'], ['☀️', 'sun'],
  ['🐯', 'tiger'], ['☂️', 'umbrella'], ['🚐', 'van'], ['⌚', 'watch'], ['🦓', 'zebra'], ['🦉', 'owl'],
  ['🐿️', 'squirrel'], ['🐐', 'goat'], ['🍃', 'leaf'], ['🐭', 'mouse'], ['🐪', 'camel'], ['🍰', 'cake'],
  ['🏠', 'house'], ['🥄', 'spoon'], ['✈️', 'airplane'], ['🚩', 'flag'], ['🍅', 'tomato'], ['🍉', 'watermelon'],
  ['🚪', 'door'], ['🐻', 'bear'], ['🧃', 'juice'], ['🌳', 'tree'], ['🚌', 'bus'], ['🐔', 'hen'], ['🐷', 'pig'],
  ['🦇', 'bat'], ['🛏️', 'bed'], ['📦', 'box'], ['🦊', 'fox'], ['🖊️', 'pen'], ['🗺️', 'map'], ['☕', 'mug'],
  ['🥜', 'peanut'], ['🪵', 'log'], ['🕸️', 'web'], ['🥤', 'cup'], ['👄', 'lips'], ['🥫', 'can'], ['🌙', 'moon'],
];
const pictures = new Map(entries.map(([symbol, asset]) => [symbol.replace(/\uFE0F/g, ''), asset]));
export const legacyPicture = (symbol: string) => pictures.get(symbol.replace(/\uFE0F/g, ''));
