import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft, Search } from 'lucide-react';
import { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

type Category = 'Fruits' | 'Animals' | 'Birds' | 'Sea Animals';

interface Item {
  name: string;
  emoji: string;
  category: Category;
}

const ITEMS: Item[] = [
  // --- FRUITS ---
  { name: 'Apple', emoji: '🍎', category: 'Fruits' },
  { name: 'Green Apple', emoji: '🍏', category: 'Fruits' },
  { name: 'Pear', emoji: '🍐', category: 'Fruits' },
  { name: 'Orange', emoji: '🍊', category: 'Fruits' },
  { name: 'Lemon', emoji: '🍋', category: 'Fruits' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits' },
  { name: 'Watermelon', emoji: '🍉', category: 'Fruits' },
  { name: 'Grapes', emoji: '🍇', category: 'Fruits' },
  { name: 'Strawberry', emoji: '🍓', category: 'Fruits' },
  { name: 'Blueberry', emoji: '🫐', category: 'Fruits' },
  { name: 'Melon', emoji: '🍈', category: 'Fruits' },
  { name: 'Cherry', emoji: '🍒', category: 'Fruits' },
  { name: 'Peach', emoji: '🍑', category: 'Fruits' },
  { name: 'Mango', emoji: '🥭', category: 'Fruits' },
  { name: 'Pineapple', emoji: '🍍', category: 'Fruits' },
  { name: 'Coconut', emoji: '🥥', category: 'Fruits' },
  { name: 'Kiwi', emoji: '🥝', category: 'Fruits' },
  { name: 'Tomato', emoji: '🍅', category: 'Fruits' },
  { name: 'Avocado', emoji: '🥑', category: 'Fruits' },
  { name: 'Carrot', emoji: '🥕', category: 'Fruits' }, // Often grouped with fresh produce for kids
  { name: 'Corn', emoji: '🌽', category: 'Fruits' },
  { name: 'Broccoli', emoji: '🥦', category: 'Fruits' },
  { name: 'Mushroom', emoji: '🍄', category: 'Fruits' },
  { name: 'Eggplant', emoji: '🍆', category: 'Fruits' },
  { name: 'Cucumber', emoji: '🥒', category: 'Fruits' },
  
  // --- ANIMALS (Land) ---
  { name: 'Dog', emoji: '🐶', category: 'Animals' },
  { name: 'Puppy', emoji: '🐕', category: 'Animals' },
  { name: 'Poodle', emoji: '🐩', category: 'Animals' },
  { name: 'Cat', emoji: '🐱', category: 'Animals' },
  { name: 'Black Cat', emoji: '🐈‍⬛', category: 'Animals' },
  { name: 'Mouse', emoji: '🐭', category: 'Animals' },
  { name: 'Hamster', emoji: '🐹', category: 'Animals' },
  { name: 'Rabbit', emoji: '🐰', category: 'Animals' },
  { name: 'Fox', emoji: '🦊', category: 'Animals' },
  { name: 'Bear', emoji: '🐻', category: 'Animals' },
  { name: 'Polar Bear', emoji: '🐻‍❄️', category: 'Animals' },
  { name: 'Panda', emoji: '🐼', category: 'Animals' },
  { name: 'Koala', emoji: '🐨', category: 'Animals' },
  { name: 'Tiger', emoji: '🐯', category: 'Animals' },
  { name: 'Lion', emoji: '🦁', category: 'Animals' },
  { name: 'Cow', emoji: '🐮', category: 'Animals' },
  { name: 'Ox', emoji: '🐂', category: 'Animals' },
  { name: 'Pig', emoji: '🐷', category: 'Animals' },
  { name: 'Boar', emoji: '🐗', category: 'Animals' },
  { name: 'Monkey', emoji: '🐵', category: 'Animals' },
  { name: 'Gorilla', emoji: '🦍', category: 'Animals' },
  { name: 'Orangutan', emoji: '🦧', category: 'Animals' },
  { name: 'Horse', emoji: '🐴', category: 'Animals' },
  { name: 'Zebra', emoji: '🦓', category: 'Animals' },
  { name: 'Deer', emoji: '🦌', category: 'Animals' },
  { name: 'Giraffe', emoji: '🦒', category: 'Animals' },
  { name: 'Elephant', emoji: '🐘', category: 'Animals' },
  { name: 'Rhinoceros', emoji: '🦏', category: 'Animals' },
  { name: 'Hippo', emoji: '🦛', category: 'Animals' },
  { name: 'Camel', emoji: '🐫', category: 'Animals' },
  { name: 'Llama', emoji: '🦙', category: 'Animals' },
  { name: 'Kangaroo', emoji: '🦘', category: 'Animals' },
  { name: 'Sloth', emoji: '🦥', category: 'Animals' },
  { name: 'Otter', emoji: '🦦', category: 'Animals' },
  { name: 'Skunk', emoji: '🦨', category: 'Animals' },
  { name: 'Badger', emoji: '🦡', category: 'Animals' },
  { name: 'Hedgehog', emoji: '🦔', category: 'Animals' },
  { name: 'Squirrel', emoji: '🐿️', category: 'Animals' },
  { name: 'Lizard', emoji: '🦎', category: 'Animals' },
  { name: 'Snake', emoji: '🐍', category: 'Animals' },
  { name: 'Turtle', emoji: '🐢', category: 'Animals' },
  { name: 'Crocodile', emoji: '🐊', category: 'Animals' },
  { name: 'Frog', emoji: '🐸', category: 'Animals' },
  { name: 'T-Rex', emoji: '🦖', category: 'Animals' },
  { name: 'Dinosaur', emoji: '🦕', category: 'Animals' },
  { name: 'Snail', emoji: '🐌', category: 'Animals' },
  { name: 'Butterfly', emoji: '🦋', category: 'Animals' },
  { name: 'Bug', emoji: '🐛', category: 'Animals' },
  { name: 'Ant', emoji: '🐜', category: 'Animals' },
  { name: 'Bee', emoji: '🐝', category: 'Animals' },
  { name: 'Ladybug', emoji: '🐞', category: 'Animals' },
  { name: 'Spider', emoji: '🕷️', category: 'Animals' },
  { name: 'Scorpion', emoji: '🦂', category: 'Animals' },
  { name: 'Wolf', emoji: '🐺', category: 'Animals' },
  { name: 'Sheep', emoji: '🐑', category: 'Animals' },
  { name: 'Goat', emoji: '🐐', category: 'Animals' },
  { name: 'Unicorn', emoji: '🦄', category: 'Animals' },
  { name: 'Chipmunk', emoji: '🐿️', category: 'Animals' },
  { name: 'Bat', emoji: '🦇', category: 'Animals' },
  { name: 'Donkey', emoji: '🫏', category: 'Animals' },
  { name: 'Bison', emoji: '🦬', category: 'Animals' },
  { name: 'Buffalo', emoji: '🐃', category: 'Animals' },
  { name: 'Water Buffalo', emoji: '🐄', category: 'Animals' },
  { name: 'Ram', emoji: '🐏', category: 'Animals' },
  { name: 'Leopard', emoji: '🐆', category: 'Animals' },
  { name: 'Cheetah', emoji: '🐅', category: 'Animals' },
  { name: 'Racoon', emoji: '🦝', category: 'Animals' },
  
  // --- BIRDS ---
  { name: 'Bird', emoji: '🐦', category: 'Birds' },
  { name: 'Chicken', emoji: '🐔', category: 'Birds' },
  { name: 'Rooster', emoji: '🐓', category: 'Birds' },
  { name: 'Chick', emoji: '🐤', category: 'Birds' },
  { name: 'Baby Chick', emoji: '🐣', category: 'Birds' },
  { name: 'Turkey', emoji: '🦃', category: 'Birds' },
  { name: 'Dove', emoji: '🕊️', category: 'Birds' },
  { name: 'Eagle', emoji: '🦅', category: 'Birds' },
  { name: 'Duck', emoji: '🦆', category: 'Birds' },
  { name: 'Swan', emoji: '🦢', category: 'Birds' },
  { name: 'Owl', emoji: '🦉', category: 'Birds' },
  { name: 'Flamingo', emoji: '🦩', category: 'Birds' },
  { name: 'Peacock', emoji: '🦚', category: 'Birds' },
  { name: 'Parrot', emoji: '🦜', category: 'Birds' },
  { name: 'Penguin', emoji: '🐧', category: 'Birds' },
  { name: 'Dodo', emoji: '🦤', category: 'Birds' },
  { name: 'Crow', emoji: '🐦‍⬛', category: 'Birds' },
  { name: 'Blackbird', emoji: '🐦', category: 'Birds' },
  { name: 'Hatching Chick', emoji: '🐥', category: 'Birds' },
  { name: 'Feather', emoji: '🪶', category: 'Birds' },
  { name: 'Swan', emoji: '🦢', category: 'Birds' },
  { name: 'Goose', emoji: '🪿', category: 'Birds' },
  
  // --- SEA ANIMALS ---
  { name: 'Whale', emoji: '🐋', category: 'Sea Animals' },
  { name: 'Big Whale', emoji: '🐳', category: 'Sea Animals' },
  { name: 'Dolphin', emoji: '🐬', category: 'Sea Animals' },
  { name: 'Fish', emoji: '🐟', category: 'Sea Animals' },
  { name: 'Tropical Fish', emoji: '🐠', category: 'Sea Animals' },
  { name: 'Blowfish', emoji: '🐡', category: 'Sea Animals' },
  { name: 'Shark', emoji: '🦈', category: 'Sea Animals' },
  { name: 'Octopus', emoji: '🐙', category: 'Sea Animals' },
  { name: 'Spiral Shell', emoji: '🐚', category: 'Sea Animals' },
  { name: 'Crab', emoji: '🦀', category: 'Sea Animals' },
  { name: 'Lobster', emoji: '🦞', category: 'Sea Animals' },
  { name: 'Shrimp', emoji: '🦐', category: 'Sea Animals' },
  { name: 'Squid', emoji: '🦑', category: 'Sea Animals' },
  { name: 'Oyster', emoji: '🦪', category: 'Sea Animals' },
  { name: 'Seal', emoji: '🦭', category: 'Sea Animals' },
  { name: 'Jellyfish', emoji: '🪼', category: 'Sea Animals' },
  { name: 'Coral', emoji: '🪸', category: 'Sea Animals' },
  { name: 'Starfish', emoji: '⭐', category: 'Sea Animals' },
  { name: 'Sea Turtle', emoji: '🐢', category: 'Sea Animals' },
  { name: 'Walrus', emoji: '🦭', category: 'Sea Animals' },
  { name: 'Seahorse', emoji: '🐴', category: 'Sea Animals' },
  { name: 'Narwhal', emoji: '🐋', category: 'Sea Animals' },
  { name: 'Clownfish', emoji: '🐠', category: 'Sea Animals' },
];

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

export const Identify: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const [targetItem, setTargetItem] = useState<Item | null>(null);
  const [options, setOptions] = useState<Item[]>([]);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Slightly slower and higher pitch for kids
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const playSound = (isCorrect: boolean) => {
    const url = isCorrect
      ? 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
      : 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3';
    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const playRevealSound = () => {
    // A playful pop sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const setupGame = () => {
    setMessage('');
    
    // Pick a random category to focus on, or random mixed?
    // Let's mix it up but prioritize variety
    const target = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    setTargetItem(target);

    // Pick 3 unique distractors
    const newOptions = [target];
    while (newOptions.length < 4) {
      const random = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      if (!newOptions.find(o => o.name === random.name)) {
        newOptions.push(random);
      }
    }
    
    // Shuffle options
    const shuffled = newOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    playRevealSound();

    const questionText = `Find the ${target.name}`;
    speak(questionText);
  };

  useEffect(() => {
    setupGame();
  }, []);

  const handleGuess = (item: Item) => {
    if (!targetItem) return;

    if (item.name === targetItem.name) {
      // Correct
      playSound(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMessage(`Yes! That is the ${item.name}! 🎉`);
      speak(`Good job! That is the ${item.name}`);
      onUpdate(true);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(setupGame, 2000);
    } else {
      // Incorrect
      playSound(false);
      setMessage(`That is a ${item.name}. Try again! 🤔`);
      speak(`That is a ${item.name}. Try finding the ${targetItem.name}.`);
      onUpdate(false);
    }
  };

  if (!targetItem) return null;

  return (
    <div className="flex flex-col h-full p-4 max-w-4xl mx-auto">
      <div className="flex items-center mb-6 shrink-0">
        <Button 
          size="sm" 
          onClick={() => { window.speechSynthesis.cancel(); onBack(); }} 
          variant="secondary"
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <div className="ml-4 flex-1 text-center">
            <h2 className="text-3xl font-bold text-indigo-500 flex items-center justify-center gap-2">
               <Search /> Safari Search
            </h2>
            <p className="text-indigo-400 font-bold text-sm">{targetItem.category}</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 w-full overflow-y-auto rounded-3xl">
        <div className="min-h-full flex flex-col items-center justify-center pb-8">
          <motion.div 
            className="text-center mb-10 shrink-0"
            key={targetItem.name} // Re-animate on new target
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
              Find the <span className="text-indigo-500 underline decoration-wavy decoration-indigo-300 underline-offset-8">{targetItem.name}</span>
            </h3>
            <p className="text-xl text-gray-500 h-8 font-medium">{message}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-2xl w-full">
            <AnimatePresence mode="popLayout">
              {options.map((item) => (
                <motion.button
                  key={item.name}
                  layout
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGuess(item)}
                  className="aspect-[4/3] bg-white rounded-3xl shadow-xl border-b-8 border-indigo-100 flex flex-col items-center justify-center p-4 hover:border-indigo-300 transition-colors group"
                >
                  <span className="text-7xl md:text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-8">
            <Button size="sm" variant="secondary" onClick={() => speak(`Find the ${targetItem.name}`)}>
                🔊 Hear it again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
