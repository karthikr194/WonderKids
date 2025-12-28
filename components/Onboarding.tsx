import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, AVATARS, ActivityType } from '../types';
import { Button } from './ui/Button';

interface Props {
  onComplete: (user: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      const initialStats = {
        level: 1,
        xp: 0,
        streak: 0
      };
      
      onComplete({ 
        name, 
        age: Number(age), 
        avatar: selectedAvatar,
        stickers: [],
        stats: {
          [ActivityType.ALPHABET]: { ...initialStats },
          [ActivityType.NUMBERS]: { ...initialStats },
          [ActivityType.COLORS]: { ...initialStats },
          [ActivityType.LOGIC]: { ...initialStats },
          [ActivityType.SHAPES]: { ...initialStats },
          [ActivityType.MEMORY]: { ...initialStats },
          [ActivityType.IDENTIFY]: { ...initialStats },
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl max-w-lg w-full border-[6px] border-blue-200"
      >
        <h1 className="text-4xl md:text-5xl font-black text-center text-blue-500 mb-8 tracking-tight">
          Welcome to <br/> WonderKidz! 🎈
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <label className="block text-xl font-bold text-gray-600 mb-2">What is your name?</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-2xl p-4 rounded-2xl border-4 border-gray-100 focus:border-blue-400 outline-none transition-colors bg-gray-50 placeholder-gray-300"
              placeholder="Start typing..."
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold text-gray-600 mb-2">How old are you?</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[2, 3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAge(num)}
                  className={`flex-shrink-0 w-14 h-14 rounded-full text-2xl font-bold border-4 transition-all
                    ${age === num ? 'bg-blue-500 text-white border-blue-500 scale-110' : 'bg-white text-gray-400 border-gray-200 hover:border-blue-200'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-xl font-bold text-gray-600 mb-2">Pick an avatar!</label>
             <div className="grid grid-cols-4 gap-2">
               {AVATARS.map(avatar => (
                 <button
                   key={avatar}
                   type="button"
                   onClick={() => setSelectedAvatar(avatar)}
                   className={`text-4xl p-2 rounded-xl transition-all border-4 ${selectedAvatar === avatar ? 'bg-yellow-100 border-yellow-400 scale-110' : 'border-transparent hover:bg-gray-100'}`}
                 >
                   {avatar}
                 </button>
               ))}
             </div>
          </div>

          <Button type="submit" size="lg" disabled={!name || !age}>
            Let's Play! 🚀
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
