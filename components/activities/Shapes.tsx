import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft, Shapes as ShapesIcon } from 'lucide-react';
import { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

const SHAPES_DATA = [
  { name: 'Circle', path: 'M50 50 m-40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0', color: '#EF4444' }, // Red
  { name: 'Square', path: 'M10 10 H90 V90 H10 Z', color: '#3B82F6' }, // Blue
  { name: 'Triangle', path: 'M50 10 L90 90 H10 Z', color: '#22C55E' }, // Green
  { name: 'Star', path: 'M50 10 L61 35 L88 35 L66 50 L75 75 L50 60 L25 75 L34 50 L12 35 L39 35 Z', color: '#EAB308' }, // Yellow
  { name: 'Heart', path: 'M50 80 C10 50 10 20 30 10 C40 5 50 15 50 25 C50 15 60 5 70 10 C90 20 90 50 50 80 Z', color: '#EC4899' }, // Pink
  { name: 'Diamond', path: 'M50 10 L90 50 L50 90 L10 50 Z', color: '#A855F7' }, // Purple
  { name: 'Pentagon', path: 'M50 10 L90 38 L75 90 H25 L10 38 Z', color: '#14B8A6' }, // Teal
  { name: 'Hexagon', path: 'M50 5 L90 27 L90 73 L50 95 L10 73 L10 27 Z', color: '#F97316' }, // Orange
  { name: 'Oval', path: 'M50 50 m-45 0 a 45 28 0 1 0 90 0 a 45 28 0 1 0 -90 0', color: '#6366F1' }, // Indigo
  { name: 'Trapezoid', path: 'M25 25 H75 L90 75 H10 Z', color: '#0EA5E9' }, // Sky Blue
  { name: 'Rectangle', path: 'M10 30 H90 V70 H10 Z', color: '#10B981' }, // Emerald
  { name: 'Crescent', path: 'M50 10 A 35 35 0 1 1 50 90 A 25 25 0 1 0 50 10 Z', color: '#FBBF24' }, // Amber
  { name: 'Cross', path: 'M35 10 H65 V35 H90 V65 H65 V90 H35 V65 H10 V35 H35 Z', color: '#EF4444' }, // Red
  { name: 'Arrow', path: 'M50 10 L90 50 L65 50 L65 90 L35 90 L35 50 L10 50 Z', color: '#8B5CF6' }, // Violet
  { name: 'Octagon', path: 'M30 10 H70 L90 30 V70 L70 90 H30 L10 70 V30 Z', color: '#F59E0B' }, // Amber
  { name: 'Cloud', path: 'M20 60 Q20 40 35 35 Q35 20 50 20 Q65 20 65 35 Q80 40 80 60 Q80 75 65 75 H35 Q20 75 20 60 Z', color: '#60A5FA' }, // Light Blue
  { name: 'Moon', path: 'M50 10 A 35 35 0 1 1 50 90 A 30 30 0 1 0 50 10 Z', color: '#DBEAFE' }, // Very Light Blue
  { name: 'Lightning', path: 'M55 10 L30 50 H45 L40 90 L75 40 H55 Z', color: '#FACC15' }, // Yellow
];

export const Shapes: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const [targetShape, setTargetShape] = useState(SHAPES_DATA[0]);
  const [options, setOptions] = useState<typeof SHAPES_DATA>([]);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setupGame = () => {
    setMessage('');
    const availableShapes = SHAPES_DATA;
    const target = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setTargetShape(target);

    // Pick 3 options including target
    let newOptions = [target];
    while (newOptions.length < 3) {
      const random = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      if (!newOptions.find(o => o.name === random.name)) {
        newOptions.push(random);
      }
    }
    newOptions = newOptions.sort(() => Math.random() - 0.5);
    setOptions(newOptions);
    
    speak(`Find the ${target.name}`);
  };

  useEffect(() => {
    setupGame();
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const playSound = (isCorrect: boolean) => {
    const url = isCorrect
      ? 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' // Happy chime
      : 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'; // Gentle boop
    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const handleGuess = (shape: typeof SHAPES_DATA[0]) => {
    if (shape.name === targetShape.name) {
      playSound(true);
      confetti({ particleCount: 100, spread: 70 });
      setMessage('Correct! 🎉');
      speak(`You found the ${shape.name}!`);
      onUpdate(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(setupGame, 1500);
    } else {
      playSound(false);
      speak(`That is a ${shape.name}. Try again!`);
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
            <h2 className="text-3xl font-bold text-orange-500 flex items-center justify-center gap-2">
               <ShapesIcon /> Shape Shifter
            </h2>
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
              Find the <span className="text-blue-500">{targetShape.name}</span>
            </h3>
            <p className="text-xl text-gray-500 h-8">{message}</p>
          </motion.div>

          <div className="flex flex-wrap gap-8 justify-center items-center">
            {options.map((shape, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleGuess(shape)}
                className="w-40 h-40 bg-white rounded-3xl shadow-lg border-4 border-gray-100 flex items-center justify-center p-4 hover:border-blue-200 transition-colors shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <path d={shape.path} fill={shape.color} />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
