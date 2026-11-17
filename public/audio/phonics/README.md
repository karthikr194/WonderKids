# Phoneme recordings (optional)

WonderKids says phonics sounds with the browser's text-to-speech using a spoken respelling
("buh", "sss", "shhh"). Text-to-speech is decent, but a real teacher's voice is better.

To use recordings, drop short MP3 files here named after the phoneme `id` in `src/data/phonics.ts`:

| Sound           | File name                |
| --------------- | ------------------------ |
| Letters a – z   | `a.mp3`, `b.mp3` … `z.mp3` |
| Letter teams    | `sh.mp3`, `ch.mp3`, `th.mp3`, `ck.mp3`, `ng.mp3`, `ee.mp3`, `oo.mp3`, `ai.mp3`, `oa.mp3`, `ar.mp3`, `or.mp3`, `ou.mp3` |

A file that exists is played instead of text-to-speech everywhere that phoneme is used
(letter cards, Sound Match, Blend It). A file that is missing silently falls back to speech.

Tips: record the *pure* sound ("b" as in "buh", not "bee"), keep each clip under 1.5 seconds,
and trim leading silence.
