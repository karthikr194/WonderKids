# WonderKids 🎈

A playful learning app for children aged 2–8. React 19 + TypeScript + Vite + Tailwind CSS 4, installable as a PWA and fully usable offline after the first visit. Progress is saved on the device.

## Learning sections

| Section | What's inside |
| --- | --- |
| 🔊 **Phonics** | Real letter *sounds* (not letter names) with mouth tips, "sound it out → say it fast" blending, building words from sounds, letter teams (sh, ch, th, ck, ng, ee, oo, ai, oa, ar, or, ou), sound-matching quizzes |
| 🔢 **Number Words** | Numbers 0–100 with their words and base-ten pictures, number ↔ word matching, spelling number words, word math ("two plus three equals…"), "what comes next" in words |
| 📚 **Reading** | Sight-word flashcards, find the word you hear, fill the gap in a sentence, match words to pictures |
| 🧮 **Math Fun** | Counting, adding, taking away, more-or-less |
| ⏰ **Time & Calendar** | Reading an analog clock, days, months, seasons, parts of the day |
| 🌍 **My World** | Animal sounds, homes and babies, naming everyday things, opposites |
| 🎨 **Shapes & Colours** | Shapes and their sides, colour names, objects and colour mixing |
| 🧠 **Brain Games** | Memory match, patterns, odd-one-out, riddles |

Difficulty adapts: each section has 3 levels that rise as stars are earned (older children start higher). A sticker is awarded every 10 stars.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-checks, then builds to dist/
npm run preview
```

## How it's organised

```
src/
  App.tsx, store.ts          app shell, saved profile + progress rules
  sections/                  one file per learning section → list of "modes"
  components/engines/        Quiz, WordBuilder, Explorer, BlendIt – reused by every mode
  data/                      all content (phonics, reading, world…) – edit these to add content
  lib/                       speech (TTS + phoneme playback), sound effects, number-to-words
```

A new quiz is just a function `(level) => QuizQuestion` handed to `<Quiz />`; a new section is a list of modes registered in `src/sections/index.ts`.

## Phonics sound quality

Browsers can't speak a bare phoneme from a letter, so each sound has a spoken respelling (`say` in `src/data/phonics.ts`). How natural it sounds depends on the device's voice. For the best result, add real recordings in `public/audio/phonics/` — see the README there. Recordings are picked up automatically.

## Guided English, Hindi and Tamil

Choose a language from the home screen. Each course shares a seven-step lesson
player covering introduction, sound, vocabulary, repetition, recognition,
practice and rewards. Tamil compound letters are organised by consonant into
18 units of 12 lessons. The parent dashboard shows completed lessons,
practice accuracy, stars, XP, streaks and suggested review.

The curriculum lives in `src/learning/curriculum.ts`. Preserve lesson IDs when
editing released content because child progress is stored by ID. The existing
`wonderkids:v2` profile and subject stats migrate in place. Switching players
archives the current local profile so children can return to it later.

### Pictures and pronunciation

The original storybook picture library is in `public/learning/pictures/`.
Each picture has a 128px and 208px WebP variant. Legacy activities use the new
art wherever a matching asset is available. A portion of legacy activity art
and some new vocabulary still need picture coverage.

Add reviewed native-speaker recordings to
`public/learning/audio/{en,hi,ta}/{lesson-id}-{kind}.mp3` and include the
root-relative paths in `src/learning/recordings.json`. Supported kinds are
`name`, `sound`, `word` and `sentence`. Record isolated sounds without adding
the English letter name or a trailing vowel. Confirm the recording's licence
and native-speaker review before shipping it.

The draft includes a starter set of attributed Wikimedia Commons recordings.
See [audio credits](public/learning/audio/CREDITS.md) for their sources.
Unrecorded names, words and sentences can play through a matching device
voice. Isolated sounds in the guided course require a recording. When audio is missing, children can continue with the visual
lesson. Repetition is self-guided and does not grade spoken pronunciation.

### Offline and verification

The production service worker caches the app shell and script fonts during
installation. Pictures and audio cache when requested while the worker is
active. Open a lesson and play its clips while online before relying on those
assets offline. Offline device speech depends on installed voices.

```sh
npm ci
npm run lint
npm test
npm run build
npx playwright install chromium
npm run preview
# In a second terminal
npm run test:browser
```

The browser check writes English, Hindi, Tamil and picture-game screenshots to
`artifacts/screenshots/`. GitHub Actions uploads them as a run artifact.
Physical Android testing and native-language curriculum review are pending.
