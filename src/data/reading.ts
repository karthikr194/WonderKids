/** Pre-primer and primer sight words (Dolch-style), grouped so difficulty can ramp up. */
export const SIGHT_WORDS: Record<1 | 2 | 3, string[]> = {
  1: ['a', 'and', 'big', 'can', 'come', 'down', 'find', 'for', 'go', 'help', 'here', 'in', 'is', 'it',
      'jump', 'look', 'make', 'me', 'my', 'not', 'play', 'run', 'see', 'the', 'to', 'up', 'we', 'you'],
  2: ['away', 'blue', 'funny', 'little', 'one', 'red', 'said', 'three', 'two', 'where', 'yellow',
      'am', 'are', 'at', 'ate', 'be', 'but', 'did', 'do', 'eat', 'get', 'good', 'have', 'he', 'like', 'no', 'on', 'she', 'so', 'yes'],
  3: ['black', 'brown', 'came', 'four', 'into', 'must', 'new', 'now', 'our', 'out', 'please', 'pretty', 'ran',
      'ride', 'saw', 'say', 'soon', 'that', 'there', 'they', 'this', 'too', 'under', 'want', 'was', 'well',
      'went', 'what', 'white', 'who', 'will', 'with'],
};

export const ALL_SIGHT_WORDS = [...SIGHT_WORDS[1], ...SIGHT_WORDS[2], ...SIGHT_WORDS[3]];

export interface Cloze { before: string; answer: string; after: string; emoji: string; wrong: string[]; level: 1 | 2 | 3 }

/** "The cat ___ on the mat." – pick the word that fits. */
export const CLOZE: Cloze[] = [
  { before: 'I can', answer: 'see', after: 'the moon.', emoji: '🌙', wrong: ['said', 'ate', 'blue'], level: 1 },
  { before: 'We', answer: 'play', after: 'in the park.', emoji: '🛝', wrong: ['the', 'red', 'big'], level: 1 },
  { before: 'Can you', answer: 'help', after: 'me?', emoji: '🙋', wrong: ['jump', 'the', 'three'], level: 1 },
  { before: 'Look', answer: 'up', after: 'at the sky!', emoji: '☁️', wrong: ['and', 'is', 'my'], level: 1 },
  { before: 'The dog can', answer: 'run', after: 'fast.', emoji: '🐕', wrong: ['red', 'two', 'here'], level: 1 },
  { before: 'Come', answer: 'here', after: 'and see!', emoji: '👋', wrong: ['big', 'jump', 'down'], level: 1 },
  { before: 'I', answer: 'jump', after: 'up and down.', emoji: '🤸', wrong: ['to', 'for', 'the'], level: 1 },
  { before: 'It is a', answer: 'big', after: 'elephant.', emoji: '🐘', wrong: ['go', 'me', 'find'], level: 1 },
  { before: 'The ball is', answer: 'red', after: '.', emoji: '🔴', wrong: ['said', 'away', 'little'], level: 2 },
  { before: 'The sky is', answer: 'blue', after: '.', emoji: '🔵', wrong: ['ate', 'where', 'one'], level: 2 },
  { before: 'She', answer: 'ate', after: 'an apple.', emoji: '🍎', wrong: ['are', 'at', 'am'], level: 2 },
  { before: 'I', answer: 'like', after: 'ice cream.', emoji: '🍦', wrong: ['did', 'but', 'two'], level: 2 },
  { before: 'The cat', answer: 'said', after: 'meow.', emoji: '🐱', wrong: ['yes', 'good', 'one'], level: 2 },
  { before: 'We have', answer: 'two', after: 'eyes.', emoji: '👀', wrong: ['red', 'yes', 'get'], level: 2 },
  { before: 'Where', answer: 'are', after: 'you going?', emoji: '🚶', wrong: ['am', 'is', 'at'], level: 2 },
  { before: 'He is a', answer: 'good', after: 'boy.', emoji: '👦', wrong: ['do', 'be', 'on'], level: 2 },
  { before: 'The bird is', answer: 'under', after: 'the tree.', emoji: '🌳', wrong: ['must', 'now', 'ran'], level: 3 },
  { before: 'They', answer: 'went', after: 'to the zoo.', emoji: '🦁', wrong: ['want', 'well', 'will'], level: 3 },
  { before: 'I', answer: 'want', after: 'a new toy.', emoji: '🧸', wrong: ['went', 'was', 'what'], level: 3 },
  { before: 'The snow is', answer: 'white', after: '.', emoji: '⛄', wrong: ['black', 'brown', 'there'], level: 3 },
  { before: 'Please', answer: 'say', after: 'thank you.', emoji: '🙏', wrong: ['saw', 'ran', 'soon'], level: 3 },
  { before: 'I', answer: 'saw', after: 'a rainbow!', emoji: '🌈', wrong: ['say', 'was', 'ride'], level: 3 },
  { before: 'We', answer: 'ride', after: 'our bikes.', emoji: '🚲', wrong: ['ran', 'came', 'well'], level: 3 },
  { before: 'What', answer: 'is', after: 'this?', emoji: '❓', wrong: ['out', 'too', 'who'], level: 3 },
];
