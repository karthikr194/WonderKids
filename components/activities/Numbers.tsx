import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

export const Numbers: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const mode = level >= 2 ? 'addition' : 'counting';

  const [countNumber, setCountNumber] = useState(1);
  const [countItems, setCountItems] = useState<string[]>([]);
  
  const [addProblem, setAddProblem] = useState({ a: 1, b: 1 });
  const [addOptions, setAddOptions] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['🍎', '🚗', '🐶', '⭐️', '🎈', '🍪', '🐱', '🦋'];

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mode === 'counting') {
        setCountItems(Array(countNumber).fill(getRandomEmoji()));
        speak(countNumber.toString());
    } else {
        generateAdditionProblem();
    }
  }, [countNumber, mode]);

  const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

  const generateAdditionProblem = () => {
      setMessage('');
      const a = Math.floor(Math.random() * (level * 2)) + 1;
      const b = Math.floor(Math.random() * (level * 2)) + 1;
      setAddProblem({ a, b });

      const sum = a + b;
      const wrong1 = sum + Math.floor(Math.random() * 3) + 1;
      const wrong2 = Math.max(1, sum - Math.floor(Math.random() * 3) - 1);
      
      setAddOptions([sum, wrong1, wrong2].sort(() => Math.random() - 0.5));
      speak(`What is ${a} plus ${b}?`);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextCount = () => {
    if (countNumber < 20) {
      setCountNumber(p => p + 1);
      onUpdate(true);
      confetti({ particleCount: 30, spread: 50, origin: { x: 0.8, y: 0.8 } });
    }
  };

  const handlePrevCount = () => {
    if (countNumber > 1) setCountNumber(p => p - 1);
  };

  const handleAdditionGuess = (guess: number) => {
      if (guess === addProblem.a + addProblem.b) {
          confetti({ particleCount: 100, spread: 70 });
          setMessage('Correct! 🎉');
          speak(`Correct! ${addProblem.a} plus ${addProblem.b} is ${guess}`);
          onUpdate(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(generateAdditionProblem, 1500);
      } else {
          speak(`Oops, try again!`);
          onUpdate(false);
          setMessage('Try again!');
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
            <h2 className="text-3xl font-bold text-green-500">
            {mode === 'counting' ? "Let's Count!" : "Let's Add!"}
            </h2>
            <p className="text-green-600/60 font-bold text-sm">Level {level}</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 w-full overflow-y-auto rounded-3xl">
        <div className="min-h-full flex flex-col justify-center pb-8">
            {mode === 'counting' ? (
                 <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center shrink-0">
                    <motion.div
                        key={countNumber}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[180px] font-black text-green-500 drop-shadow-2xl leading-none"
                    >
                        {countNumber}
                    </motion.div>
                    <div className="flex gap-4 mt-8">
                        <Button onClick={handlePrevCount} disabled={countNumber === 1} className={countNumber === 1 ? 'opacity-50' : ''} variant="secondary">➖</Button>
                        <Button onClick={() => speak(countNumber.toString())} variant="primary">🗣️ Say It</Button>
                        <Button onClick={handleNextCount} disabled={countNumber === 20} className={countNumber === 20 ? 'opacity-50' : ''} variant="success">➕</Button>
                    </div>
                    </div>
                    <div className="flex-1 bg-white/50 rounded-3xl p-8 min-h-[300px] w-full border-4 border-green-200 shadow-inner flex flex-wrap content-center justify-center gap-4">
                    {countItems.map((item, i) => (
                        <motion.div
                        key={`${countNumber}-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05, type: 'spring' }}
                        className="text-6xl"
                        onClick={() => speak("One item")}
                        >
                        {item}
                        </motion.div>
                    ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8">
                     <div className="flex items-center gap-4 text-6xl md:text-8xl font-black text-gray-700 bg-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200 max-w-full overflow-x-auto">
                        <div className="flex gap-2">
                            {Array(addProblem.a).fill('🍎').map((e,i) => <span key={i} className="text-4xl md:text-6xl">{e}</span>)}
                        </div>
                        <span className="text-green-500">+</span>
                        <div className="flex gap-2">
                            {Array(addProblem.b).fill('🍏').map((e,i) => <span key={i} className="text-4xl md:text-6xl">{e}</span>)}
                        </div>
                        <span className="text-green-500">=</span>
                        <span className="text-gray-400">?</span>
                     </div>
                     
                     <p className="h-8 text-xl text-green-600 font-bold">{message}</p>

                     <div className="flex gap-6 flex-wrap justify-center">
                         {addOptions.map((opt, i) => (
                             <Button key={i} size="lg" onClick={() => handleAdditionGuess(opt)} variant="primary" className="text-4xl py-6 px-10">
                                 {opt}
                             </Button>
                         ))}
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
