export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** n random items from arr, never including anything in `exclude`. */
export function sample<T>(arr: readonly T[], n: number, exclude: readonly T[] = []): T[] {
  return shuffle(arr.filter(x => !exclude.includes(x))).slice(0, n);
}

/** Correct answer + (count-1) distractors, shuffled. */
export function withDistractors<T>(correct: T, pool: readonly T[], count: number): T[] {
  return shuffle([correct, ...sample([...new Set(pool)], count - 1, [correct])]);
}
