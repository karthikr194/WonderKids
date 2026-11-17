const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 0–999 in words, e.g. 42 -> "forty-two", 100 -> "one hundred". */
export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) throw new RangeError(`numberToWords: ${n}`);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  const rest = n % 100;
  return `${ONES[Math.floor(n / 100)]} hundred${rest ? ` ${numberToWords(rest)}` : ''}`;
}

/** Same words, with hyphens turned into spaces so speech engines read them cleanly. */
export const spokenNumber = (n: number) => numberToWords(n).replace(/-/g, ' ');

/** A word that can be spelled with letter tiles (no hyphen / space): 0–20, then the tens. */
export const isSpellable = (n: number) => n <= 20 || (n < 100 && n % 10 === 0) || n === 100;
export const spellableWord = (n: number) => (n === 100 ? 'hundred' : numberToWords(n));

export const ORDINALS = [
  'zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
];
