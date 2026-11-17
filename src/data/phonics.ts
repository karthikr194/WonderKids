export interface PhonicsWord { word: string; emoji: string }

export interface Phoneme {
  /** File name for an optional recording: /audio/phonics/<id>.mp3 */
  id: string;
  grapheme: string;
  /** Display form, e.g. "Aa" */
  display: string;
  /** Phonetic symbol shown to grown-ups, e.g. /æ/ */
  ipa: string;
  /** Respelling the speech engine says to get the *sound*, not the letter name. */
  say: string;
  /** How to make the sound – shown to the child. */
  tip: string;
  words: PhonicsWord[];
}

const L = (
  letter: string, ipa: string, say: string, tip: string, words: [string, string][],
): Phoneme => ({
  id: letter,
  grapheme: letter,
  display: letter.toUpperCase() + letter,
  ipa,
  say,
  tip,
  words: words.map(([word, emoji]) => ({ word, emoji })),
});

/** The 26 letters with their most common (short / hard) sound. */
export const LETTER_SOUNDS: Phoneme[] = [
  L('a', '/æ/', 'aah', 'Open your mouth wide, like at the doctor.', [['apple', '🍎'], ['ant', '🐜'], ['alligator', '🐊']]),
  L('b', '/b/', 'buh', 'Press your lips together, then pop them open!', [['ball', '⚽'], ['bus', '🚌'], ['bear', '🐻']]),
  L('c', '/k/', 'kuh', 'The back of your tongue goes up, then a quick click.', [['cat', '🐱'], ['cup', '☕'], ['car', '🚗']]),
  L('d', '/d/', 'duh', 'Tap your tongue just behind your top teeth.', [['dog', '🐶'], ['duck', '🦆'], ['door', '🚪']]),
  L('e', '/ɛ/', 'eh', 'Smile a little and open your mouth a bit.', [['egg', '🥚'], ['elephant', '🐘'], ['envelope', '✉️']]),
  L('f', '/f/', 'fff', 'Top teeth touch your bottom lip. Blow softly.', [['fish', '🐟'], ['frog', '🐸'], ['flower', '🌸']]),
  L('g', '/ɡ/', 'guh', 'Back of the tongue pops up with your voice on.', [['goat', '🐐'], ['grapes', '🍇'], ['gift', '🎁']]),
  L('h', '/h/', 'huh', 'Breathe out like you are fogging a mirror.', [['hat', '🎩'], ['horse', '🐴'], ['house', '🏠']]),
  L('i', '/ɪ/', 'ih', 'Small smile, relaxed tongue, quick and short.', [['insect', '🐞'], ['iguana', '🦎'], ['ink', '🖋️']]),
  L('j', '/dʒ/', 'juh', 'Push your lips forward for a buzzy "j".', [['jet', '✈️'], ['juice', '🧃'], ['jeep', '🚙']]),
  L('k', '/k/', 'kuh', 'Same as c: the back of your tongue pops. No voice.', [['kite', '🪁'], ['key', '🔑'], ['king', '🤴']]),
  L('l', '/l/', 'lll', 'Tongue tip touches behind your top teeth. Sing it.', [['lion', '🦁'], ['leaf', '🍃'], ['lemon', '🍋']]),
  L('m', '/m/', 'mmm', 'Lips together and hum, like yummy food.', [['moon', '🌙'], ['monkey', '🐵'], ['mouse', '🐭']]),
  L('n', '/n/', 'nnn', 'Tongue behind top teeth. Hum through your nose.', [['nose', '👃'], ['nut', '🥜'], ['nest', '🪺']]),
  L('o', '/ɒ/', 'ah', 'Open your mouth round and tall.', [['octopus', '🐙'], ['orange', '🍊'], ['otter', '🦦']]),
  L('p', '/p/', 'puh', 'Lips together, then a tiny puff of air. No voice.', [['pig', '🐷'], ['pizza', '🍕'], ['penguin', '🐧']]),
  L('q', '/kw/', 'kwuh', 'Say k and w together. Q always has a u after it!', [['queen', '👸'], ['question', '❓'], ['quiet', '🤫']]),
  L('r', '/r/', 'rrr', 'Curl your tongue back and growl like a tiger.', [['rabbit', '🐰'], ['rainbow', '🌈'], ['robot', '🤖']]),
  L('s', '/s/', 'sss', 'Teeth together and hiss like a snake.', [['sun', '☀️'], ['snake', '🐍'], ['star', '⭐']]),
  L('t', '/t/', 'tuh', 'Tongue taps behind your top teeth. A little puff.', [['tiger', '🐯'], ['tree', '🌳'], ['train', '🚂']]),
  L('u', '/ʌ/', 'uh', 'Relax your jaw and say a short grunt.', [['umbrella', '☂️'], ['unicorn', '🦄'], ['up', '⬆️']]),
  L('v', '/v/', 'vvv', 'Top teeth on bottom lip, with your voice. It buzzes!', [['van', '🚐'], ['violin', '🎻'], ['volcano', '🌋']]),
  L('w', '/w/', 'wuh', 'Make your lips tiny and round, then open.', [['watch', '⌚'], ['whale', '🐋'], ['worm', '🪱']]),
  L('x', '/ks/', 'ks', 'Say k then s, quickly. You hear it at the end of words.', [['fox', '🦊'], ['box', '📦'], ['six', '6️⃣']]),
  L('y', '/j/', 'yuh', 'Tongue up high, then glide forward.', [['yo-yo', '🪀'], ['yak', '🐂'], ['yarn', '🧶']]),
  L('z', '/z/', 'zzz', 'Like s, but buzzing like a bee.', [['zebra', '🦓'], ['zip', '🤐'], ['zero', '0️⃣']]),
];

const D = (
  g: string, ipa: string, say: string, tip: string, words: [string, string][],
): Phoneme => ({ id: g, grapheme: g, display: g, ipa, say, tip, words: words.map(([word, emoji]) => ({ word, emoji })) });

/** Two (or more) letters that team up to make ONE sound. */
export const DIGRAPHS: Phoneme[] = [
  D('sh', '/ʃ/', 'shhh', 'Round your lips and say "quiet!"', [['ship', '🚢'], ['sheep', '🐑'], ['shell', '🐚']]),
  D('ch', '/tʃ/', 'chuh', 'Like a sneeze: ch-ch-choo!', [['chip', '🍟'], ['chick', '🐥'], ['cheese', '🧀']]),
  D('th', '/θ/', 'thh', 'Put your tongue gently between your teeth and blow.', [['thumb', '👍'], ['moth', '🦋'], ['bath', '🛁']]),
  D('ck', '/k/', 'kuh', 'Same as k. You find it at the end of a word.', [['duck', '🦆'], ['sock', '🧦'], ['clock', '🕒']]),
  D('ng', '/ŋ/', 'nng', 'Back of your tongue up, hum through your nose.', [['ring', '💍'], ['king', '🤴'], ['swing', '🎠']]),
  D('ee', '/iː/', 'eee', 'Big smile! Say eee like a happy mouse.', [['tree', '🌳'], ['bee', '🐝'], ['sheep', '🐑']]),
  D('oo', '/uː/', 'ooo', 'Make a tiny round mouth, like blowing a candle.', [['moon', '🌙'], ['spoon', '🥄'], ['zoo', '🦁']]),
  D('ai', '/eɪ/', 'ay', 'Say the letter name A. Two letters, one sound.', [['rain', '🌧️'], ['snail', '🐌'], ['train', '🚂']]),
  D('oa', '/oʊ/', 'oh', 'Say the letter name O. Round your lips.', [['boat', '⛵'], ['goat', '🐐'], ['coat', '🧥']]),
  D('ar', '/ɑːr/', 'ar', 'Open wide like a pirate: arrr!', [['car', '🚗'], ['star', '⭐'], ['farm', '🚜']]),
  D('or', '/ɔːr/', 'or', 'Round your lips: or, or, or.', [['fork', '🍴'], ['corn', '🌽'], ['horse', '🐴']]),
  D('ou', '/aʊ/', 'ow', 'Like when you stub your toe: ow!', [['cloud', '☁️'], ['house', '🏠'], ['mouse', '🐭']]),
];

/** Lookup by grapheme for sounding out words (letters and digraphs). */
export const PHONEME_BY_GRAPHEME: Record<string, Phoneme> = Object.fromEntries(
  [...LETTER_SOUNDS, ...DIGRAPHS].map(p => [p.grapheme, p]),
);

export interface BlendWord {
  word: string;
  emoji: string;
  /** The word split into sound units, e.g. ["sh","i","p"] */
  units: string[];
}

const W = (word: string, emoji: string, units?: string[]): BlendWord =>
  ({ word, emoji, units: units ?? word.split('') });

/** Consonant–vowel–consonant words: three letters, three sounds. */
export const CVC_WORDS: BlendWord[] = [
  W('cat', '🐱'), W('dog', '🐶'), W('sun', '☀️'), W('bus', '🚌'), W('hen', '🐔'), W('pig', '🐷'),
  W('hat', '🎩'), W('bat', '🦇'), W('bug', '🐛'), W('bed', '🛏️'), W('jet', '✈️'), W('box', '📦'),
  W('fox', '🦊'), W('pen', '🖊️'), W('map', '🗺️'), W('mug', '☕'), W('nut', '🥜'), W('van', '🚐'),
  W('log', '🪵'), W('web', '🕸️'), W('cup', '🥤'), W('rat', '🐀'), W('lip', '👄'), W('can', '🥫'),
];

/** Words with digraphs and vowel teams: more letters than sounds. */
export const TEAM_WORDS: BlendWord[] = [
  W('ship', '🚢', ['sh', 'i', 'p']), W('fish', '🐟', ['f', 'i', 'sh']), W('chip', '🍟', ['ch', 'i', 'p']),
  W('duck', '🦆', ['d', 'u', 'ck']), W('ring', '💍', ['r', 'i', 'ng']), W('moon', '🌙', ['m', 'oo', 'n']),
  W('rain', '🌧️', ['r', 'ai', 'n']), W('boat', '⛵', ['b', 'oa', 't']), W('car', '🚗', ['c', 'ar']),
  W('fork', '🍴', ['f', 'or', 'k']), W('bee', '🐝', ['b', 'ee']), W('sheep', '🐑', ['sh', 'ee', 'p']),
  W('king', '🤴', ['k', 'i', 'ng']), W('leaf', '🍃', ['l', 'ee', 'f']), W('star', '⭐', ['s', 't', 'ar']),
  W('moth', '🦋', ['m', 'o', 'th']), W('coat', '🧥', ['c', 'oa', 't']), W('sock', '🧦', ['s', 'o', 'ck']),
  W('train', '🚂', ['t', 'r', 'ai', 'n']), W('cloud', '☁️', ['c', 'l', 'ou', 'd']),
];

export const sayUnit = (unit: string) => PHONEME_BY_GRAPHEME[unit]?.say ?? unit;
