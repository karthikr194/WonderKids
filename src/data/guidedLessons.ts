/**
 * Grown-up guided lessons (ported from PR #1, "Add guided English and phonics learning sections").
 * Each lesson runs Learn -> Together -> Your turn.
 */
export type GuidedSubject = 'english' | 'phonics';
export interface GuidedLesson {
  id: string;
  title: string;
  visual: string;
  focus: string;
  teach: string;
  together: string;
  example: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
  blend?: string[];
}

const sounds: GuidedLesson[] = [
  { id: 'sound-s', title: 'Meet s', visual: '☀️', focus: 's', teach: 'This letter can make the sound /s/. Keep your teeth close and let air hiss gently, like a snake. Keep your voice off.', together: 'With a grown-up, stretch /s/ together. Keep it smooth; do not add “uh”. Say sun. Listen for /s/ at the start.', example: 'sun', question: 'Which word starts with /s/?', options: ['pin', 'sun', 'tap'], answer: 'sun', hint: 'Stretch the first sound in sun, like a snake hissing.' },
  { id: 'sound-a', title: 'Meet a', visual: '🐜', focus: 'a', teach: 'In ant, a makes the short vowel sound /a/. Open your mouth and keep your tongue low. This is a sound, not the letter name.', together: 'Say ant with a grown-up. Listen to its first sound. Say that short sound together, then say ant again.', example: 'ant', question: 'Which word starts with the short /a/ sound?', options: ['sun', 'ant', 'net'], answer: 'ant', hint: 'Listen to the first sound in ant. It is the short vowel we just practised.' },
  { id: 'sound-t', title: 'Meet t', visual: '🚰', focus: 't', teach: 'This letter can make /t/. Touch your tongue just behind your top teeth, then release a tiny puff of air. Keep it short.', together: 'With a grown-up, make a quick /t/. Do not add “uh”. Say tap and listen to the first sound.', example: 'tap', question: 'Which word starts with /t/?', options: ['ant', 'pin', 'tap'], answer: 'tap', hint: 'Say tap slowly. Notice the quick puff at the start.' },
  { id: 'sound-p', title: 'Meet p', visual: '📌', focus: 'p', teach: 'This letter can make /p/. Close your lips, then pop them open with a little puff. Keep your voice off and the sound short.', together: 'Make a quick /p/ with a grown-up. Do not add “uh”. Say pin. Feel your lips pop at the start.', example: 'pin', question: 'Which word starts with /p/?', options: ['pin', 'sit', 'ant'], answer: 'pin', hint: 'Your lips pop open at the start of pin.' },
  { id: 'sound-i', title: 'Meet i', visual: '🖋️', focus: 'i', teach: 'In ink, i makes the short vowel sound /i/. Relax your lips and open your mouth a little. Listen to a grown-up say ink.', together: 'Say ink together. Listen to the first sound. Repeat that short sound, then say ink again.', example: 'ink', question: 'Which word starts with the short /i/ sound?', options: ['tap', 'sun', 'ink'], answer: 'ink', hint: 'Listen to the beginning of ink. Keep this vowel short.' },
  { id: 'sound-n', title: 'Meet n', visual: '🥅', focus: 'n', teach: 'This letter can make /n/. Put your tongue behind your top teeth and let your voice hum through your nose.', together: 'With a grown-up, stretch /n/. Do not add “uh”. Say net and listen to its first sound.', example: 'net', question: 'Which word starts with /n/?', options: ['net', 'ant', 'pin'], answer: 'net', hint: 'Feel the humming sound at the start of net.' },
];
const blends: GuidedLesson[] = ['sat', 'pin', 'tap'].map((word, index) => ({
  id: `blend-${word}`, title: `Blend ${word}`, visual: ['🪑', '📌', '🚰'][index], focus: word,
  teach: 'We can join sounds to read a word. Point to each letter from left to right. Ask a grown-up to model each sound, then slide the sounds together.',
  together: `Touch each letter in ${word}. Say its sound with a grown-up. Now move your finger under the whole word and blend it. Say ${word}!`,
  example: word, blend: word.split(''), question: 'Which word did you blend?',
  options: ['pin', 'tap', 'sat'], answer: word, hint: `Go back to the letters in ${word}. Say each sound in order and slide them together.`,
}));
export const guidedLessons: Record<GuidedSubject, GuidedLesson[]> = {
  phonics: [...sounds, ...blends],
  english: [
    { id: 'greetings', title: 'Hello, friend!', visual: '👋', focus: 'Hello!', teach: 'We say hello when we meet someone. We can introduce ourselves by saying, “My name is…”', together: 'Wave to a grown-up. Say, “Hello! My name is…” and add your name. Take turns greeting each other.', example: 'Hello! My name is Sam.', question: 'What can you say when you meet a friend?', options: ['Goodnight!', 'Hello!', 'Goodbye!'], answer: 'Hello!', hint: 'Hello is a greeting we use when we meet someone.' },
    { id: 'naming-words', title: 'Name things', visual: '📖', focus: 'a book', teach: 'Naming words name people, places, animals and things. Book is the name of a thing we can read.', together: 'Find a book. Point to it and say, “This is a book.” Take turns naming things around you.', example: 'This is a book.', question: 'Which word names something we can read?', options: ['jump', 'book', 'happy'], answer: 'book', hint: 'A book has pages that we read.' },
    { id: 'action-words', title: 'Let’s move', visual: '🦘', focus: 'jump', teach: 'Action words tell us what someone does. Jump, clap and wave are action words.', together: 'Clap your hands and say, “I clap.” Wave and say, “I wave.” Ask a grown-up to do an action for you to name.', example: 'I can jump.', question: 'Which word tells us an action?', options: ['table', 'blue', 'jump'], answer: 'jump', hint: 'Jump is something you can do.' },
    { id: 'sentences', title: 'My first sentence', visual: '🐱', focus: 'The cat sits.', teach: 'A sentence tells a complete idea. “The cat sits.” tells us who we are talking about and what the cat does.', together: 'Say, “The cat sits.” Point to each word as you say it. Who sits? The cat! What does it do? It sits!', example: 'The cat sits.', question: 'Which sentence tells us what the cat does?', options: ['The cat sits.', 'The dog runs.', 'The bird sings.'], answer: 'The cat sits.', hint: 'Find the sentence with cat. Sits tells us what the cat does.' },
  ],
};

// ---------- saved completion (per player and subject) ----------

type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>;

export const guidedKey = (playerId: string, subject: GuidedSubject) => `wonderkids:guided:v1:${playerId}:${subject}`;

/** Completed lesson ids, ignoring anything unknown or malformed. Never throws (blocked storage reads as empty). */
export function readCompleted(store: KeyValueStore | undefined, key: string, subject: GuidedSubject): string[] {
  try {
    const saved: unknown = JSON.parse(store?.getItem(key) ?? '[]');
    if (!Array.isArray(saved)) return [];
    const known = new Set(guidedLessons[subject].map(l => l.id));
    return [...new Set(saved.filter((id): id is string => typeof id === 'string' && known.has(id)))];
  } catch {
    return [];
  }
}

/** Adds a lesson once; replaying a finished lesson changes nothing. */
export const markComplete = (done: string[], id: string) => (done.includes(id) ? done : [...done, id]);

/** Returns false when the browser refused to save (progress then lasts for this session only). */
export function writeCompleted(store: KeyValueStore | undefined, key: string, done: string[]): boolean {
  try {
    if (!store) return false;
    store.setItem(key, JSON.stringify(done));
    return true;
  } catch {
    return false;
  }
}
