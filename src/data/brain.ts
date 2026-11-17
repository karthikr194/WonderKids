export interface LogicQ { q: string; options: string[]; answer: string; why: string; level: 1 | 2 | 3 }

export const LOGIC: LogicQ[] = [
  { level: 1, q: "Which animal says 'Meow'?", options: ['Dog', 'Cat', 'Cow'], answer: 'Cat', why: 'Cats say meow!' },
  { level: 1, q: 'Which one is a fruit?', options: ['Car', 'Apple', 'Ball'], answer: 'Apple', why: 'An apple is a yummy fruit.' },
  { level: 1, q: 'What colour is the sky on a sunny day?', options: ['Blue', 'Green', 'Purple'], answer: 'Blue', why: 'Look up! The sky is blue.' },
  { level: 1, q: 'Which one is the biggest?', options: ['Ant', 'Mouse', 'Elephant'], answer: 'Elephant', why: 'Elephants are huge!' },
  { level: 1, q: 'What do you use to eat soup?', options: ['Fork', 'Spoon', 'Knife'], answer: 'Spoon', why: 'A spoon scoops up the soup.' },
  { level: 1, q: 'What do you wear on your feet?', options: ['Hat', 'Shoes', 'Gloves'], answer: 'Shoes', why: 'Shoes keep your feet safe.' },
  { level: 1, q: 'Which one can fly?', options: ['Fish', 'Bird', 'Dog'], answer: 'Bird', why: 'Birds have wings to fly.' },
  { level: 1, q: 'What do we drink?', options: ['Milk', 'Rock', 'Shoe'], answer: 'Milk', why: 'Milk is a yummy drink.' },
  { level: 2, q: 'Which shape has 3 sides?', options: ['Square', 'Circle', 'Triangle'], answer: 'Triangle', why: 'Tri means three!' },
  { level: 2, q: 'You have 2 apples and get 1 more. How many now?', options: ['2', '3', '4'], answer: '3', why: '2 + 1 = 3.' },
  { level: 2, q: 'Which one does not belong?', options: ['Car', 'Bus', 'Banana'], answer: 'Banana', why: 'A banana is food. The others are vehicles.' },
  { level: 2, q: 'Which one is cold?', options: ['Ice cream', 'Soup', 'Fire'], answer: 'Ice cream', why: 'Ice cream is frozen and cold.' },
  { level: 2, q: 'What do bees make?', options: ['Honey', 'Milk', 'Bread'], answer: 'Honey', why: 'Bees make sweet honey.' },
  { level: 2, q: 'What do you use to brush your teeth?', options: ['Comb', 'Toothbrush', 'Spoon'], answer: 'Toothbrush', why: 'A toothbrush keeps teeth clean.' },
  { level: 2, q: 'Which one lives in water?', options: ['Fish', 'Horse', 'Cat'], answer: 'Fish', why: 'Fish breathe underwater.' },
  { level: 2, q: 'How many legs does a dog have?', options: ['2', '4', '6'], answer: '4', why: 'Dogs walk on four legs.' },
  { level: 3, q: 'Ice is cold. Fire is ...?', options: ['Wet', 'Hot', 'Blue'], answer: 'Hot', why: 'Fire is the opposite of ice.' },
  { level: 3, q: 'Which one is a solid?', options: ['Water', 'Rock', 'Air'], answer: 'Rock', why: 'A rock is hard and solid.' },
  { level: 3, q: 'If yesterday was Monday, what is today?', options: ['Sunday', 'Tuesday', 'Wednesday'], answer: 'Tuesday', why: 'Tuesday comes after Monday.' },
  { level: 3, q: 'What do plants need to grow?', options: ['Candy', 'Sunlight', 'Toys'], answer: 'Sunlight', why: 'Plants need sunlight and water.' },
  { level: 3, q: 'Which season is the coldest?', options: ['Summer', 'Winter', 'Spring'], answer: 'Winter', why: 'Winter brings snow and ice.' },
  { level: 3, q: 'A caterpillar turns into a ...?', options: ['Butterfly', 'Bird', 'Frog'], answer: 'Butterfly', why: 'Caterpillars grow into butterflies.' },
  { level: 3, q: 'Which one is heavier?', options: ['Feather', 'Elephant', 'Leaf'], answer: 'Elephant', why: 'Elephants are very heavy.' },
  { level: 3, q: 'What comes after winter?', options: ['Autumn', 'Spring', 'Summer'], answer: 'Spring', why: 'The seasons go winter, spring, summer, autumn.' },
];

export const PATTERN_ITEMS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '🌙', '🍎', '🍌', '🐶', '🐱', '🌸', '🚗'];
