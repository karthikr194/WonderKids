import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft, Grid } from 'lucide-react';
import { UserProfile } from '../../types';
import confetti from 'canvas-confetti';

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

const ALL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const Memory: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocking, setIsLocking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const initializeGame = () => {
    const pairsCount = level === 1 ? 3 : (level === 2 ? 4 : 6);
    const gameEmojis = ALL_EMOJIS.sort(() => Math.random() - 0.5).slice(0, pairsCount);
    
    const newCards: Card[] = [...gameEmojis, ...gameEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(newCards);
    setFlippedIndices([]);
    setIsLocking(false);
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  const handleCardClick = (index: number) => {
    if (isLocking || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocking(true);
      checkForMatch(newFlippedIndices, newCards);
    }
  };

  const checkForMatch = (indices: number[], currentCards: Card[]) => {
    const [firstIndex, secondIndex] = indices;
    const isMatch = currentCards[firstIndex].emoji === currentCards[secondIndex].emoji;

    if (isMatch) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const matchedCards = currentCards.map((card, i) => 
          indices.includes(i) ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setFlippedIndices([]);
        setIsLocking(false);
        onUpdate(true);

        if (matchedCards.every(c => c.isMatched)) {
             confetti({ particleCount: 150, spread: 100 });
             const utterance = new SpeechSynthesisUtterance("Amazing! You matched them all!");
             window.speechSynthesis.speak(utterance);
             setTimeout(initializeGame, 3000);
        } else {
             const utterance = new SpeechSynthesisUtterance("Good match!");
             window.speechSynthesis.speak(utterance);
        }
      }, 500);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const resetCards = currentCards.map((card, i) => 
          indices.includes(i) ? { ...card, isFlipped: false } : card
        );
        setCards(resetCards);
        setFlippedIndices([]);
        setIsLocking(false);
      }, 1000);
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
            <h2 className="text-3xl font-bold text-teal-500 flex items-center justify-center gap-2">
               <Grid /> Memory Match
            </h2>
            <p className="text-teal-600/60 font-bold text-sm">Level {level}</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 w-full overflow-y-auto rounded-3xl">
        <div className="min-h-full flex flex-col items-center justify-center pb-8">
            <div className={`grid gap-4 ${cards.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="relative aspect-square w-20 md:w-28 cursor-pointer"
                  onClick={() => handleCardClick(i)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-full h-full absolute rounded-xl shadow-lg backface-hidden"
                    initial={false}
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div 
                      className="absolute w-full h-full bg-teal-400 rounded-xl border-4 border-white flex items-center justify-center backface-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="text-4xl text-white/50">?</span>
                    </div>
                    <div 
                      className="absolute w-full h-full bg-white rounded-xl border-4 border-teal-200 flex items-center justify-center backface-hidden"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-4xl md:text-5xl">{card.emoji}</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
