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
