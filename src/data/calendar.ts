export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const SEASONS: { name: string; emoji: string; months: number[] }[] = [
  { name: 'Winter', emoji: '⛄', months: [11, 0, 1] },
  { name: 'Spring', emoji: '🌷', months: [2, 3, 4] },
  { name: 'Summer', emoji: '🏖️', months: [5, 6, 7] },
  { name: 'Autumn', emoji: '🍂', months: [8, 9, 10] },
];

export const DAY_PARTS: { name: string; emoji: string; things: { text: string; emoji: string }[] }[] = [
  { name: 'Morning', emoji: '🌅', things: [{ text: 'eat breakfast', emoji: '🥣' }, { text: 'wake up', emoji: '⏰' }, { text: 'see the sunrise', emoji: '🌄' }] },
  { name: 'Afternoon', emoji: '☀️', things: [{ text: 'eat lunch', emoji: '🥪' }, { text: 'play at the park', emoji: '🛝' }, { text: 'have a snack', emoji: '🍎' }] },
  { name: 'Night', emoji: '🌙', things: [{ text: 'go to bed', emoji: '🛏️' }, { text: 'see the stars', emoji: '✨' }, { text: 'read a bedtime story', emoji: '📖' }] },
];
