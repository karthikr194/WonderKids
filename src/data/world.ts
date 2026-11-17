export interface Thing { name: string; emoji: string; category: string }

const cat = (category: string, rows: string): Thing[] =>
  rows.split(',').map(r => {
    const [name, emoji] = r.trim().split('|');
    return { name, emoji, category };
  });

export const CATEGORIES = ['Fruits', 'Vegetables', 'Pets & Farm', 'Wild Animals', 'Birds', 'Sea Animals', 'Vehicles', 'Food'] as const;

export const THINGS: Thing[] = [
  ...cat('Fruits', 'Apple|🍎, Pear|🍐, Orange|🍊, Lemon|🍋, Banana|🍌, Watermelon|🍉, Grapes|🍇, Strawberry|🍓, Cherry|🍒, Peach|🍑, Mango|🥭, Pineapple|🍍, Kiwi|🥝, Coconut|🥥'),
  ...cat('Vegetables', 'Carrot|🥕, Corn|🌽, Broccoli|🥦, Tomato|🍅, Potato|🥔, Cucumber|🥒, Mushroom|🍄, Eggplant|🍆, Onion|🧅, Pepper|🫑'),
  ...cat('Pets & Farm', 'Dog|🐶, Cat|🐱, Rabbit|🐰, Hamster|🐹, Cow|🐮, Pig|🐷, Horse|🐴, Sheep|🐑, Goat|🐐, Duck|🦆, Chicken|🐔'),
  ...cat('Wild Animals', 'Lion|🦁, Tiger|🐯, Bear|🐻, Panda|🐼, Koala|🐨, Monkey|🐵, Giraffe|🦒, Zebra|🦓, Elephant|🐘, Hippo|🦛, Kangaroo|🦘, Fox|🦊, Wolf|🐺, Deer|🦌'),
  ...cat('Birds', 'Owl|🦉, Parrot|🦜, Penguin|🐧, Eagle|🦅, Flamingo|🦩, Peacock|🦚, Swan|🦢, Chick|🐥, Dove|🕊️'),
  ...cat('Sea Animals', 'Fish|🐟, Whale|🐋, Dolphin|🐬, Shark|🦈, Octopus|🐙, Crab|🦀, Turtle|🐢, Shrimp|🦐, Seal|🦭, Squid|🦑'),
  ...cat('Vehicles', 'Car|🚗, Bus|🚌, Train|🚂, Plane|✈️, Boat|⛵, Bicycle|🚲, Rocket|🚀, Helicopter|🚁, Tractor|🚜, Fire Truck|🚒, Ambulance|🚑'),
  ...cat('Food', 'Pizza|🍕, Burger|🍔, Cookie|🍪, Cake|🍰, Ice Cream|🍦, Bread|🍞, Cheese|🧀, Egg|🥚, Donut|🍩, Popcorn|🍿'),
];

export interface Animal {
  name: string; emoji: string; sound: string; home: string; baby: string; food: string; fact: string;
}

export const ANIMALS: Animal[] = [
  { name: 'Cow', emoji: '🐮', sound: 'Moo', home: 'Farm', baby: 'Calf', food: 'Grass', fact: 'Cows give us milk.' },
  { name: 'Dog', emoji: '🐶', sound: 'Woof', home: 'House', baby: 'Puppy', food: 'Bones', fact: 'Dogs wag their tails when they are happy.' },
  { name: 'Cat', emoji: '🐱', sound: 'Meow', home: 'House', baby: 'Kitten', food: 'Fish', fact: 'Cats purr when they feel cozy.' },
  { name: 'Duck', emoji: '🦆', sound: 'Quack', home: 'Pond', baby: 'Duckling', food: 'Bugs', fact: 'Ducks have waterproof feathers.' },
  { name: 'Sheep', emoji: '🐑', sound: 'Baa', home: 'Farm', baby: 'Lamb', food: 'Grass', fact: 'Wool from sheep makes warm sweaters.' },
  { name: 'Pig', emoji: '🐷', sound: 'Oink', home: 'Farm', baby: 'Piglet', food: 'Corn', fact: 'Pigs are very clever.' },
  { name: 'Horse', emoji: '🐴', sound: 'Neigh', home: 'Stable', baby: 'Foal', food: 'Hay', fact: 'Horses can sleep standing up.' },
  { name: 'Chicken', emoji: '🐔', sound: 'Cluck', home: 'Coop', baby: 'Chick', food: 'Seeds', fact: 'Hens lay eggs.' },
  { name: 'Lion', emoji: '🦁', sound: 'Roar', home: 'Savanna', baby: 'Cub', food: 'Meat', fact: 'A lion\'s roar can be heard far away.' },
  { name: 'Elephant', emoji: '🐘', sound: 'Trumpet', home: 'Savanna', baby: 'Calf', food: 'Plants', fact: 'Elephants use their trunks like a hand.' },
  { name: 'Frog', emoji: '🐸', sound: 'Ribbit', home: 'Pond', baby: 'Tadpole', food: 'Flies', fact: 'Frogs start life as tadpoles.' },
  { name: 'Owl', emoji: '🦉', sound: 'Hoot', home: 'Tree', baby: 'Owlet', food: 'Mice', fact: 'Owls are awake at night.' },
  { name: 'Bee', emoji: '🐝', sound: 'Buzz', home: 'Hive', baby: 'Larva', food: 'Nectar', fact: 'Bees make honey from flowers.' },
  { name: 'Snake', emoji: '🐍', sound: 'Hiss', home: 'Ground', baby: 'Hatchling', food: 'Mice', fact: 'Snakes smell with their tongues.' },
  { name: 'Monkey', emoji: '🐵', sound: 'Ooh ooh', home: 'Jungle', baby: 'Infant', food: 'Bananas', fact: 'Monkeys swing from tree to tree.' },
  { name: 'Penguin', emoji: '🐧', sound: 'Squawk', home: 'Ice', baby: 'Chick', food: 'Fish', fact: 'Penguins are birds that swim instead of fly.' },
];

export interface OppositePair { a: string; b: string; ae: string; be: string }
export const OPPOSITES: OppositePair[] = [
  { a: 'Hot', b: 'Cold', ae: '🔥', be: '🧊' },
  { a: 'Big', b: 'Small', ae: '🐘', be: '🐭' },
  { a: 'Up', b: 'Down', ae: '⬆️', be: '⬇️' },
  { a: 'Day', b: 'Night', ae: '☀️', be: '🌙' },
  { a: 'Happy', b: 'Sad', ae: '😀', be: '😢' },
  { a: 'Fast', b: 'Slow', ae: '🐇', be: '🐢' },
  { a: 'Full', b: 'Empty', ae: '🥛', be: '🫙' },
  { a: 'Tall', b: 'Short', ae: '🦒', be: '🐕' },
  { a: 'Wet', b: 'Dry', ae: '💧', be: '🏜️' },
  { a: 'Open', b: 'Closed', ae: '🚪', be: '🔒' },
  { a: 'Heavy', b: 'Light', ae: '🪨', be: '🪶' },
  { a: 'Loud', b: 'Quiet', ae: '📢', be: '🤫' },
  { a: 'Awake', b: 'Asleep', ae: '😃', be: '😴' },
  { a: 'Old', b: 'New', ae: '👴', be: '👶' },
  { a: 'In', b: 'Out', ae: '📥', be: '📤' },
  { a: 'Clean', b: 'Dirty', ae: '🛁', be: '🐷' },
];
