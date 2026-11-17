import confetti from 'canvas-confetti';

const base = { disableForReducedMotion: true, zIndex: 100 } as const;

export const burst = (strong = false) =>
  confetti({ ...base, particleCount: strong ? 180 : 50, spread: strong ? 100 : 60, origin: { y: strong ? 0.55 : 0.7 } });

export const fireworks = () => {
  burst(true);
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 250);
  setTimeout(() => confetti({ ...base, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 400);
};
