import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { MascotSays } from './ui/Mascot';
import { AVATARS, type Profile } from '../types';
import { newProfile } from '../store';

export function Onboarding({ onComplete }: { onComplete: (p: Profile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && age) onComplete(newProfile(name.trim(), age, avatar));
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg">
        <div className="mb-5 text-center">
          <h1 className="text-5xl font-black tracking-tight">
            Wonder<span className="text-[#ff6b6b]">K</span><span className="text-[#4d96ff]">i</span><span className="text-[#2bc48a]">d</span><span className="text-[#ff9f1c]">s</span>
          </h1>
          <p className="mt-1 font-bold text-ink-soft">Sounds, words, numbers & more</p>
        </div>
        <div className="mb-5"><MascotSays size="lg">Hoo-hoo! I'm Ollie. Let's get to know you!</MascotSays></div>

        <form onSubmit={submit} className="chunky space-y-6 rounded-[2.25rem] bg-paper p-6 sm:p-8">
          <label className="block">
            <span className="mb-2 block text-lg font-black">What's your name?</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              autoComplete="given-name"
              placeholder="Type your name"
              className="w-full rounded-2xl border-[3px] border-ink bg-cream p-4 text-2xl font-bold outline-none placeholder:text-ink/30 focus:bg-white"
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-lg font-black">How old are you?</legend>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {[2, 3, 4, 5, 6, 7, 8].map(n => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={age === n}
                  onClick={() => setAge(n)}
                  className={`chunky-sm aspect-square rounded-2xl text-2xl font-black ${age === n ? 'bg-[#4d96ff] text-white' : 'bg-cream'}`}
                >{n}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-lg font-black">Pick your buddy</legend>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map(a => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={avatar === a}
                  onClick={() => setAvatar(a)}
                  className={`chunky-sm aspect-square rounded-2xl text-4xl ${avatar === a ? 'bg-sun' : 'bg-cream'}`}
                >{a}</button>
              ))}
            </div>
          </fieldset>

          <Button type="submit" size="lg" variant="good" disabled={!name.trim() || !age}>Let's learn! 🚀</Button>
        </form>
      </motion.div>
    </div>
  );
}
