export const languages = ['en', 'hi', 'ta'] as const;
export type Language = typeof languages[number];
export const languageInfo = {
  en: { title: 'English', locale: 'en-IN', color: '#e9e5ff', art: 'cat' },
  hi: { title: 'हिन्दी', locale: 'hi-IN', color: '#ffedd9', art: 'mango' },
  ta: { title: 'தமிழ்', locale: 'ta-IN', color: '#ddf5ec', art: 'squirrel' },
};

export interface Lesson {
  id: string;
  language: Language;
  locale: string;
  group: string;
  order: number;
  difficulty: 1 | 2 | 3;
  letter: string;
  lowercase?: string;
  word: string;
  picture?: string;
  phoneme?: string;
  sentence: string;
  tiles?: string[];
  quantity?: number;
  transliteration?: string;
  combination?: string;
}

type Entry = [letter: string, word?: string, picture?: string, phoneme?: string, tiles?: string[]];
const curriculum: Lesson[] = [];

function unit(language: Language, key: string, group: string, difficulty: Lesson['difficulty'], entries: Entry[]) {
  entries.forEach(([letter, example, picture, phoneme, tiles], index) => {
    const word = example ?? letter;
    const quantity = key === 'numbers' ? index : undefined;
    const lowercase = key === 'abc' ? letter.toLowerCase() : undefined;
    const sentence = word === letter ? letter : language === 'hi'
      ? (word.startsWith(letter) ? `${letter} से ${word}` : `${word} में ${letter} की ध्वनि सुनो।`)
      : language === 'ta' ? `${letter}. ${word}.` : `Listen to the sound in ${word}.`;
    curriculum.push({ id: `${language}-${key}-${index + 1}`, language, locale: languageInfo[language].locale,
      group, difficulty, order: curriculum.length, letter, lowercase, word, picture, phoneme, sentence, tiles, quantity });
  });
}

const abcWords = 'apple ball cat dog elephant fish grapes hat ice-cream jug kite lion mango nest orange parrot queen rabbit sun tiger umbrella van watch xylophone yak zebra'.split(' ');
const abcSounds = 'æ b k d ɛ f ɡ h aɪ dʒ k l m n ɒ p kw r s t ʌ v w z j z'.split(' ');
unit('en', 'abc', 'Alphabet and sounds', 1, Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter, i) => [
  letter, abcWords[i].replace('-', ' '), abcWords[i], abcSounds[i],
]));
unit('en', 'vowels', 'Short vowels', 1, [
  ['A', 'cat', 'cat', 'æ'], ['E', 'nest', 'nest', 'ɛ'], ['I', 'fish', 'fish', 'ɪ'],
  ['O', 'dog', 'dog', 'ɒ'], ['U', 'sun', 'sun', 'ʌ'],
]);
unit('en', 'long', 'Long vowels', 2, [
  ['A', 'cake', 'cake', 'eɪ'], ['E', 'leaf', 'leaf', 'iː'], ['I', 'kite', 'kite', 'aɪ'], ['O', 'goat', 'goat', 'əʊ'], ['U', 'cube', 'cube', 'juː'],
]);
unit('en', 'cvc', 'Blend and build', 2, ['cat', 'hat', 'dog', 'sun', 'van', 'jug', 'bus', 'hen', 'pig', 'bat', 'bug', 'bed', 'fox', 'pen', 'map', 'mug', 'log', 'web', 'cup', 'can'].map(word => [
  word, word, word, undefined, Array.from(word),
]));
unit('en', 'consonants', 'More consonant sounds', 2, [
  ['C', 'cat', 'cat', 'k'], ['G', 'grapes', 'grapes', 'ɡ'], ['X', 'box', 'box', 'ks'],
]);
unit('en', 'picture-words', 'Picture vocabulary', 1, [
  ['mango', 'mango', 'mango'], ['rabbit', 'rabbit', 'rabbit'], ['kite', 'kite', 'kite'],
  ['watch', 'watch', 'watch'], ['elephant', 'elephant', 'elephant'],
]);
unit('en', 'rhymes', 'Rhyming words', 2, [
  ['cat / hat', 'hat', 'hat'], ['sun / fun', 'sun', 'sun'], ['dog / log', 'log', 'log'],
]);
unit('en', 'sight', 'Sight words', 2, ['I', 'the', 'see', 'a', 'is', 'we', 'you', 'my', 'can', 'like'].map(word => [word]));
unit('en', 'read', 'Read a sentence', 3, [
  ['I see a cat.', undefined, 'cat'], ['The dog can run.', undefined, 'dog'], ['My kite is up.', undefined, 'kite'],
]);

unit('hi', 'swar', 'स्वर', 1, [
  ['अ', 'अनार', 'pomegranate'], ['आ', 'आम', 'mango'], ['इ', 'इमली', 'tamarind'], ['ई', 'ईख', 'sugarcane'],
  ['उ', 'उल्लू', 'owl'], ['ऊ', 'ऊन', 'yarn'], ['ऋ', 'ऋषि', 'sage'], ['ए', 'एड़ी', 'heel'], ['ऐ', 'ऐनक', 'glasses'], ['ओ', 'ओखली', 'mortar'],
  ['औ', 'औरत', 'woman'], ['अं', 'अंगूर', 'grapes'], ['अः', 'दुःख'],
]);
const swarTransliteration = 'a ā i ī u ū ṛ e ai o au aṃ aḥ'.split(' ');
curriculum.filter(lesson => lesson.id.startsWith('hi-swar-')).forEach((lesson, i) => {
  lesson.transliteration = swarTransliteration[i];
});
const hindiLetters = 'क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह'.split(' ');
const hindiWords = 'कमल खरगोश गमला घर अङ्ग चम्मच छाता जहाज झंडा पञ्च टमाटर ठेला डमरू ढोल बाण तरबूज थाली दरवाज़ा धनुष नल पतंग फल बकरी भालू मछली योग रस लड्डू वन शेर षट्कोण सूरज हाथी'.split(' ');
const hindiPictures: Record<string, string> = {
  कमल: 'lotus', गमला: 'potted-plant', घर: 'house', चम्मच: 'spoon', जहाज: 'airplane', झंडा: 'flag',
  टमाटर: 'tomato', ठेला: 'handcart', डमरू: 'damaru', ढोल: 'dhol', बाण: 'arrow', तरबूज: 'watermelon',
  थाली: 'thali', दरवाज़ा: 'door', धनुष: 'bow', नल: 'tap', भालू: 'bear', रस: 'juice', लड्डू: 'laddu',
  वन: 'forest', षट्कोण: 'hexagon', खरगोश: 'rabbit', छाता: 'umbrella', पतंग: 'kite', बकरी: 'goat', मछली: 'fish', सूरज: 'sun', हाथी: 'elephant' };
unit('hi', 'vyanjan', 'व्यंजन', 1, hindiLetters.map((letter, i) => [letter, hindiWords[i], hindiPictures[hindiWords[i]]]));
unit('hi', 'conjuncts', 'संयुक्त व्यंजन', 2, [['क्ष', 'कक्षा'], ['त्र', 'त्रिशूल'], ['ज्ञ', 'ज्ञान'], ['श्र', 'श्रम']]);
const matras = 'ा ि ी ु ू ृ े ै ो ौ'.split(' ');
const matraVowels = 'आ इ ई उ ऊ ऋ ए ऐ ओ औ'.split(' ');
const matraWords = 'नाम दिन दीप पुल फूल कृपा सेब बैल मोर कौआ'.split(' ');
unit('hi', 'matras', 'मात्राएँ', 2, matras.map((mark, i) => [`क${mark}`, matraWords[i], [undefined, undefined, 'lamp', 'bridge', 'flower', undefined, 'apple', 'bull', 'peacock', 'crow'][i]]));
unit('hi', 'read', 'शब्द और वाक्य', 3, [
  ['क + म + ल', 'कमल', 'lotus', undefined, ['क', 'म', 'ल']],
  ['न + ल', 'नल', 'tap', undefined, ['न', 'ल']],
  ['यह आम है।', undefined, 'mango'], ['यह छाता है।', undefined, 'umbrella'],
]);

curriculum.filter(lesson => lesson.id.startsWith('hi-matras-')).forEach((lesson, i) => {
  lesson.combination = `क् + ${matraVowels[i]} → ${lesson.letter}`;
  lesson.sentence = `${lesson.letter}। ${lesson.word}।`;
});

const tamilVowels: Entry[] = [
  ['அ', 'அணில்', 'squirrel'], ['ஆ', 'ஆடு', 'goat'], ['இ', 'இலை', 'leaf'], ['ஈ', 'ஈ', 'fly'],
  ['உ', 'உரல்', 'mortar'], ['ஊ', 'ஊஞ்சல்', 'swing'], ['எ', 'எலி', 'mouse'], ['ஏ', 'ஏணி', 'ladder'], ['ஐ', 'ஐந்து', 'five'],
  ['ஒ', 'ஒட்டகம்', 'camel'], ['ஓ', 'ஓநாய்', 'wolf'], ['ஔ', 'ஔவையார்', 'poet'],
];
unit('ta', 'uyir', 'உயிரெழுத்துகள்', 1, tamilVowels);
const uyirTransliteration = 'a ā i ī u ū e ē ai o ō au'.split(' ');
curriculum.filter(lesson => lesson.id.startsWith('ta-uyir-')).forEach((lesson, i) => {
  lesson.transliteration = uyirTransliteration[i];
});
const tamilBases = 'க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன'.split(' ');
const tamilExamples = 'கல் சங்கு பச்சைக்கிளி மஞ்சள் படம் கண் பந்து நண்டு பல் மரம் யானை அரிசி இலை வலை மாம்பழம் பள்ளி காற்று மீன்'.split(' ');
unit('ta', 'mei', 'மெய்யெழுத்துகள்', 1, tamilBases.map((letter, i) => [`${letter}்`, tamilExamples[i], 'stone conch parrot turmeric painting eye ball crab tooth tree elephant rice leaf net mango school wind fish'.split(' ')[i]]));
unit('ta', 'aytham', 'ஆய்த எழுத்து', 1, [['ஃ', 'எஃகு', 'steel']]);
const tamilMarks = ['', ...'ா ி ீ ு ூ ெ ே ை ொ ோ ௌ'.split(' ')];
tamilBases.forEach((base, i) => {
  unit('ta', `compound-${i+1}`, `${base}் வரிசை`, 2, tamilVowels.map(([vowel], j) => [
    `${base}${tamilMarks[j]}`, `${base}${tamilMarks[j]}`, undefined, undefined, [`${base}்`, vowel],
  ]));
});
unit('ta', 'read', 'சொற்களும் வாக்கியங்களும்', 3, [
  ['ஆ + டு', 'ஆடு', 'goat', undefined, ['ஆ', 'டு']], ['இ + லை', 'இலை', 'leaf', undefined, ['இ', 'லை']],
  ['இது ஓர் இலை.', undefined, 'leaf'], ['இது ஓர் ஆடு.', undefined, 'goat'],
]);
unit('hi', 'vocabulary', 'चित्र शब्दावली', 1, [
  ['कमल', 'कमल', 'lotus'], ['आम', 'आम', 'mango'], ['मछली', 'मछली', 'fish'], ['हाथी', 'हाथी', 'elephant'],
]);
unit('ta', 'vocabulary', 'படச் சொற்கள்', 1, [
  ['ஆடு', 'ஆடு', 'goat'], ['அணில்', 'அணில்', 'squirrel'], ['இலை', 'இலை', 'leaf'], ['மீன்', 'மீன்', 'fish'],
]);
const hindiNumbers = 'शून्य एक दो तीन चार पाँच छह सात आठ नौ दस'.split(' ');
const tamilNumbers = 'சுழியம் ஒன்று இரண்டு மூன்று நான்கு ஐந்து ஆறு ஏழு எட்டு ஒன்பது பத்து'.split(' ');
for (const [language, words, first] of [['hi', hindiNumbers, 0x966], ['ta', tamilNumbers, 0xbe6]] as const) {
  unit(language, 'numbers', language === 'hi' ? 'गिनती' : 'எண்கள்', 1,
    words.map((word, i) => [Array.from(String(i), digit => String.fromCodePoint(first + Number(digit))).join(''), word]));
}

export const courses = Object.fromEntries(languages.map(language => [
  language, curriculum.filter(lesson => lesson.language === language),
])) as Record<Language, Lesson[]>;

export function lessonOptions(lesson: Lesson, picturesOnly = false): Lesson[] {
  const key = (item: Lesson) => picturesOnly ? item.picture : item.letter;
  const pool = courses[lesson.language];
  const candidates = [...pool.filter(item => item.group === lesson.group), ...pool];
  const seen = new Set([key(lesson)]);
  const distractors = candidates.filter(item => {
    const value = key(item);
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  const start = lesson.order % Math.max(1, distractors.length - 1);
  const options = distractors.slice(start, start + 2);
  options.splice(lesson.order % 3, 0, lesson);
  return options;
}
