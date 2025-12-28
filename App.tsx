import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Alphabet } from './components/activities/Alphabet';
import { Numbers } from './components/activities/Numbers';
import { Colors } from './components/activities/Colors';
import { Logic } from './components/activities/Logic';
import { Shapes } from './components/activities/Shapes';
import { Memory } from './components/activities/Memory';
import { Identify } from './components/activities/Identify';
import { UserProfile, ActivityType } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Calculator, Type, Brain, Star, Shapes as ShapesIcon, Grid, Trophy, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

const STICKER_COLLECTION = ['🦖', '🦄', '🚀', '🌟', '🍭', '🍕', '🎮', '🌈', '🎸', '⚽', '🦋', '🍦', '🍩', '🏀', '🚗', '🎈'];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [newStickerModal, setNewStickerModal] = useState<string | null>(null);

  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  const updateProgress = (type: ActivityType, success: boolean) => {
    setUser(prev => {
      if (!prev) return null;
      const stats = { ...prev.stats };
      const currentStats = stats[type];

      let newStreak = success ? currentStats.streak + 1 : 0;
      let newXp = success ? currentStats.xp + 1 : currentStats.xp;
      let newLevel = currentStats.level;
      let newStickers = [...prev.stickers];
      let awardedSticker = null;

      // Adaptive Logic
      if (newStreak > 0 && newStreak % 5 === 0) {
        newLevel += 1;
      }

      // Sticker Logic: Award a sticker every 10 stars (simplified for quick feedback)
      const totalStars = Object.values(stats).reduce((acc, curr) => acc + curr.xp, 0);
      if (success && (totalStars + 1) % 10 === 0) {
         const unowned = STICKER_COLLECTION.filter(s => !newStickers.includes(s));
         if (unowned.length > 0) {
             awardedSticker = unowned[Math.floor(Math.random() * unowned.length)];
             newStickers.push(awardedSticker);
         }
      }

      if (awardedSticker) {
          setNewStickerModal(awardedSticker);
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
          audio.play().catch(() => {}); 
      }

      return {
        ...prev,
        stickers: newStickers,
        stats: {
          ...stats,
          [type]: {
            ...currentStats,
            streak: newStreak,
            xp: newXp,
            level: newLevel
          }
        }
      };
    });
  };

  const totalStars = Object.values(user.stats).reduce((acc, curr) => acc + curr.xp, 0);

  const renderActivity = () => {
    switch (currentActivity) {
      case ActivityType.ALPHABET:
        return (
          <Alphabet 
            user={user} 
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.ALPHABET, success)}
          />
        );
      case ActivityType.NUMBERS:
        return (
          <Numbers 
            user={user} 
            level={user.stats[ActivityType.NUMBERS].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.NUMBERS, success)}
          />
        );
      case ActivityType.COLORS:
        return (
          <Colors 
            user={user} 
            level={user.stats[ActivityType.COLORS].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.COLORS, success)}
          />
        );
      case ActivityType.LOGIC:
        return (
          <Logic 
            user={user} 
            level={user.stats[ActivityType.LOGIC].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.LOGIC, success)}
          />
        );
      case ActivityType.SHAPES:
        return (
          <Shapes 
            user={user} 
            level={user.stats[ActivityType.SHAPES].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.SHAPES, success)}
          />
        );
      case ActivityType.MEMORY:
        return (
          <Memory 
            user={user} 
            level={user.stats[ActivityType.MEMORY].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.MEMORY, success)}
          />
        );
      case ActivityType.IDENTIFY:
        return (
          <Identify 
            user={user} 
            level={user.stats[ActivityType.IDENTIFY].level}
            onBack={() => setCurrentActivity(null)} 
            onUpdate={(success) => updateProgress(ActivityType.IDENTIFY, success)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF9C3] overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentActivity ? (
          <motion.div 
            key="activity"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="h-screen"
          >
            {renderActivity()}
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 md:p-8 max-w-6xl mx-auto h-screen flex flex-col overflow-y-auto"
          >
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl md:text-5xl bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg border-4 border-yellow-400">
                  {user.avatar}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-500">Hello,</h1>
                  <h2 className="text-3xl md:text-4xl font-black text-blue-500">{user.name}</h2>
                </div>
              </div>
              <div className="flex gap-2 md:gap-4">
                 <div className="bg-white px-4 py-2 rounded-xl font-bold text-yellow-500 shadow-sm flex items-center gap-2 border-2 border-yellow-100">
                    <Star className="fill-yellow-500" /> {totalStars}
                 </div>
                 <div className="bg-white px-3 py-2 rounded-xl font-bold text-gray-500 shadow-sm border-2 border-gray-100">
                    Lvl {Math.floor(totalStars / 50) + 1}
                 </div>
              </div>
            </header>

            <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> My Games
            </h3>
            
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              <ActivityCard 
                title="ABC's" 
                icon={<Type size={40} />}
                color="bg-red-400" 
                stats={user.stats[ActivityType.ALPHABET]}
                onClick={() => setCurrentActivity(ActivityType.ALPHABET)} 
                delay={0.1}
              />
              <ActivityCard 
                title="123's" 
                icon={<Calculator size={40} />}
                color="bg-green-400" 
                stats={user.stats[ActivityType.NUMBERS]}
                onClick={() => setCurrentActivity(ActivityType.NUMBERS)} 
                delay={0.15}
              />
              <ActivityCard 
                title="Colors" 
                icon={<Palette size={40} />}
                color="bg-pink-400" 
                stats={user.stats[ActivityType.COLORS]}
                onClick={() => setCurrentActivity(ActivityType.COLORS)} 
                delay={0.2}
              />
              <ActivityCard 
                title="Identify" 
                icon={<Search size={40} />}
                color="bg-indigo-400" 
                stats={user.stats[ActivityType.IDENTIFY]}
                onClick={() => setCurrentActivity(ActivityType.IDENTIFY)} 
                delay={0.25}
              />
              <ActivityCard 
                title="Logic" 
                icon={<Brain size={40} />}
                color="bg-purple-400" 
                stats={user.stats[ActivityType.LOGIC]}
                onClick={() => setCurrentActivity(ActivityType.LOGIC)} 
                delay={0.3}
              />
               <ActivityCard 
                title="Shapes" 
                icon={<ShapesIcon size={40} />}
                color="bg-orange-400" 
                stats={user.stats[ActivityType.SHAPES]}
                onClick={() => setCurrentActivity(ActivityType.SHAPES)} 
                delay={0.35}
              />
               <ActivityCard 
                title="Memory" 
                icon={<Grid size={40} />}
                color="bg-teal-400" 
                stats={user.stats[ActivityType.MEMORY]}
                onClick={() => setCurrentActivity(ActivityType.MEMORY)} 
                delay={0.4}
              />
            </main>

            {/* Sticker Book Section */}
            <div className="bg-white/60 rounded-3xl p-6 border-4 border-white">
                <h3 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
                    📚 Sticker Book <span className="text-sm font-normal text-gray-400">({user.stickers.length}/{STICKER_COLLECTION.length})</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                    {STICKER_COLLECTION.map((sticker, i) => {
                        const isUnlocked = user.stickers.includes(sticker);
                        return (
                            <div 
                                key={i}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-2 transition-all
                                    ${isUnlocked ? 'bg-white border-yellow-200 shadow-sm' : 'bg-gray-100 border-gray-200 opacity-50 grayscale'}`}
                            >
                                {isUnlocked ? sticker : '🔒'}
                            </div>
                        );
                    })}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Sticker Modal */}
      <AnimatePresence>
          {newStickerModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={() => setNewStickerModal(null)}
              >
                  <motion.div 
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="bg-white rounded-[40px] p-8 md:p-12 text-center max-w-md w-full relative overflow-hidden"
                    onClick={e => e.stopPropagation()}
                  >
                      <div className="absolute inset-0 bg-yellow-100/50 -z-10" />
                      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400" />
                      
                      <h2 className="text-3xl font-black text-gray-800 mb-2">New Sticker!</h2>
                      <p className="text-gray-500 mb-8">You are doing great!</p>
                      
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                        className="text-[120px] mb-8"
                      >
                          {newStickerModal}
                      </motion.div>
                      
                      <button 
                        onClick={() => setNewStickerModal(null)}
                        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-xl hover:bg-blue-600 transition-colors shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1"
                      >
                          Awesome!
                      </button>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const ActivityCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  color: string; 
  stats: { level: number; xp: number };
  onClick: () => void;
  delay: number;
}> = ({ title, icon, color, stats, onClick, delay }) => (
  <motion.button
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, type: 'spring' }}
    whileHover={{ scale: 1.03, rotate: 1 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} w-full rounded-[30px] p-6 flex flex-col items-center justify-between text-white shadow-xl border-b-[8px] border-black/10 active:border-b-0 active:translate-y-2 transition-all relative overflow-hidden group min-h-[180px]`}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
    <div className="flex flex-col items-center justify-center flex-1 z-10">
        <div className="mb-2 bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
        {icon}
        </div>
        <span className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-md">{title}</span>
    </div>
    
    <div className="w-full flex justify-between items-center bg-black/10 rounded-xl px-3 py-1 mt-2 z-10">
        <span className="font-bold text-xs md:text-sm opacity-90">Level {stats.level}</span>
        <div className="flex items-center gap-1 font-bold text-xs md:text-sm">
            <Star size={14} className="fill-white" /> {stats.xp}
        </div>
    </div>
  </motion.button>
);

export default App;
