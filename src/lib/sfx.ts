import { isSoundEnabled } from './speech';

let ctx: AudioContext | null = null;
const audio = () => {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
};

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.12) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

const play = (fn: () => void) => { if (isSoundEnabled()) { try { fn(); } catch { /* audio is optional */ } } };

export const sfx = {
  tap: () => play(() => tone(660, 0, 0.08, 'triangle', 0.08)),
  correct: () => play(() => { tone(523, 0, 0.12); tone(659, 0.1, 0.12); tone(784, 0.2, 0.22); }),
  wrong: () => play(() => { tone(260, 0, 0.18, 'triangle', 0.1); tone(220, 0.14, 0.22, 'triangle', 0.1); }),
  win: () => play(() => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.2))),
  sticker: () => play(() => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.25))),
};
