/**
 * Speech helpers.
 *
 * Phonics needs *pure sounds* ("buh", not "bee"), which Web Speech cannot produce from a letter,
 * so every phoneme carries a spoken respelling (`say`). If a recording exists at
 * /audio/phonics/<id>.mp3 it is played instead – drop real recordings in and they win automatically.
 */

let soundOn = true;
let generation = 0;
let cachedVoice: SpeechSynthesisVoice | null | undefined;

export const setSoundEnabled = (on: boolean) => {
  soundOn = on;
  if (!on) stopSpeaking();
};
export const isSoundEnabled = () => soundOn;

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

const PREFERRED = [/samantha/i, /google us english/i, /aria|jenny|ava|emma/i, /karen|serena|moira|tessa/i, /female/i];

function chooseVoice(): SpeechSynthesisVoice | null {
  const s = synth();
  if (!s) return null;
  if (cachedVoice !== undefined && cachedVoice !== null) return cachedVoice;
  const english = s.getVoices().filter(v => /^en[-_]/i.test(v.lang));
  if (!english.length) return null;
  for (const re of PREFERRED) {
    const hit = english.find(v => re.test(v.name) && /^en[-_](US|GB|AU)/i.test(v.lang));
    if (hit) return (cachedVoice = hit);
  }
  return (cachedVoice = english.find(v => /^en[-_]US/i.test(v.lang)) ?? english[0]);
}

if (synth()) {
  // Voices load asynchronously in most browsers.
  synth()!.addEventListener?.('voiceschanged', () => { cachedVoice = undefined; });
}

export interface Utterance {
  text: string;
  rate?: number;
  pitch?: number;
  /** Silence after this part, in ms. */
  pause?: number;
  /** Called when this part starts (for highlighting letters while sounding out). */
  onStart?: () => void;
}
export type Part = string | Utterance;

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const stopListeners = new Set<() => void>();
export function onSpeechStop(listener: () => void) {
  stopListeners.add(listener);
  return () => { stopListeners.delete(listener); };
}

export function stopSpeaking() {
  stopListeners.forEach(listener => listener());
  generation++;
  synth()?.cancel();
  currentAudio?.pause();
  currentAudio = null;
}

function utter(u: Utterance): Promise<void> {
  const s = synth();
  if (!s) return Promise.resolve();
  return new Promise(resolve => {
    const ut = new SpeechSynthesisUtterance(u.text);
    ut.rate = u.rate ?? 0.85;
    ut.pitch = u.pitch ?? 1.1;
    ut.lang = 'en-US';
    const v = chooseVoice();
    if (v) { ut.voice = v; ut.lang = v.lang; }
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    ut.onend = finish;
    ut.onerror = finish;
    // Some engines never fire onend – never leave the UI waiting.
    setTimeout(finish, 1500 + u.text.length * 220);
    u.onStart?.();
    s.speak(ut);
  });
}

/** Speak parts one after another. Starting a new sequence cancels the previous one. */
export async function speakSequence(parts: Part[]): Promise<void> {
  if (!soundOn) { parts.forEach(p => typeof p !== 'string' && p.onStart?.()); return; }
  stopSpeaking();
  const mine = generation;
  for (const part of parts) {
    if (mine !== generation) return;
    const u = typeof part === 'string' ? { text: part } : part;
    await utter(u);
    if (u.pause) await sleep(u.pause);
  }
}

export const speak = (text: string, opts: Omit<Utterance, 'text'> = {}) =>
  speakSequence([{ text, ...opts }]);

/** "A", "B"... spoken as the letter *name* (not the sound). */
export const speakLetterName = (letter: string) => speak(letter.toUpperCase(), { rate: 0.8 });

// ---------- phoneme playback (recording first, speech second) ----------

let currentAudio: HTMLAudioElement | null = null;
const audioAvailable = new Map<string, boolean>();

async function tryRecording(id: string): Promise<boolean> {
  if (audioAvailable.get(id) === false) return false;
  return new Promise<boolean>(resolve => {
    const a = new Audio(`/audio/phonics/${id}.mp3`);
    currentAudio = a;
    a.onended = () => resolve(true);
    a.onerror = () => { audioAvailable.set(id, false); resolve(false); };
    a.play().then(() => audioAvailable.set(id, true)).catch(() => { audioAvailable.set(id, false); resolve(false); });
  });
}

/** Play one phoneme: a recording if one exists, otherwise its spoken respelling. */
export async function playPhoneme(id: string, say: string, opts: { rate?: number } = {}) {
  if (!soundOn) return;
  stopSpeaking();
  const mine = generation;
  if (await tryRecording(id)) return;
  if (mine !== generation) return;
  await speak(say, { rate: opts.rate ?? 0.55, pitch: 1 });
}
