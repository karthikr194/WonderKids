import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { UserProfile, ColorItem } from '../../types';
import confetti from 'canvas-confetti';

const ALL_COLORS: ColorItem[] = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Gray', hex: '#6B7280' },
];

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

export const Colors: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const [targetColor, setTargetColor] = useState<ColorItem>(ALL_COLORS[0]);
  const [options, setOptions] = useState<ColorItem[]>([]);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getLevelColors = () => {
      if (level === 1) {
          return ALL_COLORS.slice(0, 4);
      }
      return ALL_COLORS;
  };

  const setupGame = () => {
    setMessage('');
    const levelColors = getLevelColors();
    const target = levelColors[Math.floor(Math.random() * levelColors.length)];
    setTargetColor(target);
    
    const numOptions = level === 1 ? 2 : 4;

    let newOptions = [target];
    while (newOptions.length < numOptions) {
      const random = levelColors[Math.floor(Math.random() * levelColors.length)];
      if (!newOptions.find(o => o.name === random.name)) {
        newOptions.push(random);
      }
    }
    newOptions = newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);
    speak(`Find the ${target.name} color`);
  };

  useEffect(() => {
    setupGame();
  }, [level]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleGuess = (color: ColorItem) => {
    if (color.name === targetColor.name) {
      confetti({ particleCount: 100, spread: 70 });
      setMessage('Correct! 🎉');
      speak("Correct! That is " + color.name);
      onUpdate(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(setupGame, 1500);
    } else {
      speak(`Oops, that is ${color.name}. Try again!`);
      setMessage('Try again! 🤔');
      onUpdate(false);
    }
  };

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
            <h2 className="text-3xl font-bold text-pink-500">Color Splash</h2>
            <p className="text-pink-600/60 font-bold text-sm">Level {level}</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 w-full overflow-y-auto rounded-3xl">
        <div className="min-h-full flex flex-col items-center justify-center pb-8">
            <motion.div 
              className="text-center mb-10 shrink-0"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-gray-700 mb-2">
                Find <span style={{ color: targetColor.hex }}>{targetColor.name}</span>!
              </h3>
              <p className="text-xl text-gray-500 h-8">{message}</p>
            </motion.div>

            <div className={`grid gap-6 md:gap-8 max-w-md w-full ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-2'}`}>
              {options.map((color, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleGuess(color)}
                  className="aspect-square rounded-full shadow-lg border-4 border-white ring-4 ring-black/5"
                  style={{ backgroundColor: color.hex }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
