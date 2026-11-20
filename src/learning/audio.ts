import { isSoundEnabled, stopSpeaking, onSpeechStop } from '../lib/speech';
import { mayUseDeviceSpeech, pickVoice } from './voices';
import type { Lesson } from './curriculum';

export type AudioKind = 'name' | 'sound' | 'word' | 'sentence';
export type Playback = 'idle' | 'playing' | 'unavailable';
import recordings from './recordings.json';

const assets = new Set<string>(recordings);
export const recordingPath = (lesson: Lesson, kind: AudioKind) => {
  const path = `/learning/audio/${lesson.language}/${lesson.id}-${kind}.mp3`;
  return assets.has(path) ? path : undefined;
};

export function playTeachingAudio(lesson: Lesson, kind: AudioKind, slow: boolean, update: (state: Playback) => void, override?: string) {
  stopSpeaking();
  if (!isSoundEnabled()) return;
  const recorded = override ? undefined : recordingPath(lesson, kind);
  let audio: HTMLAudioElement | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cancelled = false;
  const unsubscribe = onSpeechStop(() => {
    cancelled = true;
    audio?.pause();
    clearTimeout(timer);
    unsubscribe();
    update('idle');
  });
  const finish = (state: Playback) => {
    if (cancelled) return;
    cancelled = true;
    clearTimeout(timer);
    unsubscribe();
    update(state);
  };
  const fallback = () => {
    if (cancelled) return;
    // Isolated sounds require recordings. Speaking a glyph would often play its name or add a vowel.
    if (!mayUseDeviceSpeech(kind) || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      finish('unavailable');
      return;
    }
    const synth = window.speechSynthesis;
    const voice = pickVoice(synth.getVoices(), lesson.locale, !navigator.onLine);
    if (!voice) { finish('unavailable'); return; }
    const message = override ?? (kind === 'name' ? lesson.letter : kind === 'word' ? lesson.word : lesson.sentence);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = slow ? 0.65 : 0.85;
    utterance.onend = () => finish('idle');
    utterance.onerror = () => finish('unavailable');
    timer = setTimeout(() => {
      finish('unavailable');
      synth.cancel();
    }, 3500 + message.length * 240);
    update('playing');
    synth.speak(utterance);
  };
  if (recorded) {
    audio = new Audio(recorded);
    audio.playbackRate = slow ? 0.7 : 1;
    audio.onended = () => finish('idle');
    let failed = false;
    const fail = () => {
      if (failed || cancelled) return;
      failed = true;
      fallback();
    };
    audio.onerror = fail;
    update('playing');
    audio.play().catch(fail);
  } else fallback();
}
