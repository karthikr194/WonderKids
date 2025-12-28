import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowLeft, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile, LogicQuestion } from '../../types';
import { generateLogicQuestion, getEncouragement } from '../../services/gemini';
import confetti from 'canvas-confetti';

interface Props {
  user: UserProfile;
  level: number;
  onBack: () => void;
  onUpdate: (success: boolean) => void;
}

export const Logic: React.FC<Props> = ({ user, level, onBack, onUpdate }) => {
  const [question, setQuestion] = useState<LogicQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const loadQuestion = async () => {
    setLoading(true);
    setQuestion(null);
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    
    // Pass level to AI
    const q = await generateLogicQuestion(user.age, level);
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [level]);

  const handleOptionClick = async (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const isCorrect = option === question?.correctAnswer;
    
    if (isCorrect) {
      confetti({ particleCount: 100, spread: 70 });
      const praise = await getEncouragement(user.name, true);
      setFeedback(praise);
      setShowExplanation(true);
      onUpdate(true);
    } else {
      setFeedback("Oops! Give it another try!");
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
            <h2 className="text-3xl font-bold text-purple-500 flex items-center justify-center gap-2">
            <BrainCircuit /> Logic Lab
            </h2>
            <p className="text-purple-600/60 font-bold text-sm">Level {level}</p>
        </div>
        <div className="w-20" />
      </div>

      <div className="flex-1 w-full overflow-y-auto rounded-3xl">
        <div className="min-h-full flex flex-col items-center justify-center pb-8">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="text-6xl"
                 >
                   🤔
                 </motion.div>
                 <p className="text-xl text-purple-600 font-bold animate-pulse">Thinking up a Level {level} puzzle...</p>
              </div>
            ) : question ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white rounded-3xl p-6 md:p-10 shadow-xl border-b-8 border-purple-200"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                  {question.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === question.correctAnswer;
                    let bgClass = "bg-blue-50 hover:bg-blue-100 border-blue-200";
                    if (selectedOption) {
                        if (isCorrect) bgClass = "bg-green-100 border-green-400";
                        else if (isSelected) bgClass = "bg-red-100 border-red-400";
                        else bgClass = "opacity-50";
                    }

                    return (
                      <motion.button
                        key={i}
                        whileHover={!selectedOption ? { scale: 1.02 } : {}}
                        whileTap={!selectedOption ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionClick(opt)}
                        className={`p-4 rounded-xl text-lg font-semibold border-2 transition-all ${bgClass} text-left min-h-[80px] flex items-center justify-center`}
                      >
                        {opt}
                      </motion.button>
                    )
                  })}
                </div>

                {feedback && (
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-8 text-center"
                    >
                        <p className={`text-2xl font-bold mb-4 ${selectedOption === question.correctAnswer ? 'text-green-500' : 'text-orange-500'}`}>
                            {feedback}
                        </p>
                        
                        {showExplanation && (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6 text-gray-700">
                                 <Sparkles className="inline-block text-yellow-500 mb-1 mr-2"/>
                                 <span className="font-medium">{question.explanation}</span>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                             {selectedOption !== question.correctAnswer && (
                                 <Button onClick={() => { setSelectedOption(null); setFeedback(null); }} variant="secondary" size="sm">
                                    Try Again
                                 </Button>
                             )}
                             {selectedOption === question.correctAnswer && (
                                 <Button onClick={loadQuestion} variant="primary">
                                    Next Puzzle ➜
                                 </Button>
                             )}
                        </div>
                    </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center">
                <AlertCircle className="text-red-400 w-16 h-16 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">Failed to load logic puzzle.</p>
                <Button onClick={loadQuestion}>Retry</Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
