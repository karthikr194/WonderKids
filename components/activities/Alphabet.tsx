import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const WORDS: Record<string, string> = {
  A: "Apple", B: "Ball", C: "Cat", D: "Dog", E: "Elephant",
  F: "Fish", G: "Giraffe", H: "House", I: "Ice Cream", J: "Jelly",
  K: "Kite", L: "Lion", M: "Monkey", N: "Nest", O: "Orange",
  P: "Penguin", Q: "Queen", R: "Rainbow", S: "Sun", T: "Tiger",
  U: "Umbrella", V: "Violin", W: "Whale", X: "Xylophone", Y: "Yak", Z: "Zebra"
};

// Simple Emoji mapping for visuals
const EMOJIS: Record<string, string> = {
  A: "🍎", B: "⚽", C: "🐱", D: "🐶", E: "🐘",
  F: "🐟", G: "🦒", H: "🏠", I: "🍦", J: "🍮",
  K: "🪁", L: "🦁", M: "🐵", N: "🪺", O: "🍊",
  P: "🐧", Q: "👑", R: "🌈", S: "☀️", T: "🐯",
  U: "☂️", V: "🎻", W: "🐋", X: "🎹", Y: "🐂", Z: "🦓"
};

interface Props {
  user: UserProfile;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

export const Alphabet: React.FC<Props> = ({ user, onBack, onUpdate }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    speak(`${letter}. ${WORDS[letter]}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    // Alphabet is exploration, so we just give points for engagement
    onUpdate(true);
  };

  return (
    <div className="flex flex-col h-full p-4 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button size="sm" onClick={onBack} variant="secondary">
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-blue-500 ml-4 flex-1 text-center">
          ABC Fun!
        </h2>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <AnimatePresence mode="wait">
        {!selectedLetter ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 overflow-y-auto pb-20"
          >
            {ALPHABET.map((letter, index) => (
              <motion.button
                key={letter}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.03, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLetterClick(letter)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl shadow-lg border-b-8 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-1 transition-all
                  ${['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-orange-300'][index % 6]}
                  border-black/10`}
              >
                <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{letter}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl relative border-8 border-blue-200"
          >
             <button 
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
            >
              ❌
            </button>

            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[150px] leading-none mb-4"
            >
              {EMOJIS[selectedLetter]}
            </motion.div>
            
            <h1 className="text-[120px] font-black text-blue-500 leading-none mb-2 drop-shadow-lg">
              {selectedLetter}
            </h1>
            
            <h2 className="text-5xl text-gray-700 font-bold mb-8">
              {WORDS[selectedLetter]}
            </h2>

            <Button size="lg" onClick={() => speak(`${selectedLetter}. ${WORDS[selectedLetter]}`)} variant="primary">
               <Volume2 className="mr-2 inline-block" /> Listen Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
