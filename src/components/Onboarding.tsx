import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
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
      <motion.form
        onSubmit={submit}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg space-y-7 rounded-[2.5rem] border-[6px] border-blue-200 bg-white p-7 shadow-2xl sm:p-10"
      >
        <h1 className="text-center text-4xl font-black tracking-tight text-blue-500 sm:text-5xl">
          Welcome to <br />WonderKids! 🎈
        </h1>

        <label className="block">
          <span className="mb-2 block text-xl font-bold text-slate-600">What is your name?</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            autoComplete="given-name"
            placeholder="Type here…"
            className="w-full rounded-2xl border-4 border-slate-100 bg-slate-50 p-4 text-2xl outline-none transition-colors placeholder:text-slate-300 focus:border-blue-400"
          />
        </label>

        <fieldset>
          <legend className="mb-2 text-xl font-bold text-slate-600">How old are you?</legend>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[2, 3, 4, 5, 6, 7, 8].map(n => (
              <button
                key={n}
                type="button"
                aria-pressed={age === n}
                onClick={() => setAge(n)}
                className={`h-14 w-14 shrink-0 rounded-full border-4 text-2xl font-bold transition-all
                  ${age === n ? 'scale-110 border-blue-500 bg-blue-500 text-white' : 'border-slate-200 bg-white text-slate-400 hover:border-blue-200'}`}
              >{n}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xl font-bold text-slate-600">Pick your buddy!</legend>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS.map(a => (
              <button
                key={a}
                type="button"
                aria-pressed={avatar === a}
                onClick={() => setAvatar(a)}
                className={`rounded-2xl border-4 p-2 text-4xl transition-all ${avatar === a ? 'scale-110 border-yellow-400 bg-yellow-100' : 'border-transparent hover:bg-slate-100'}`}
              >{a}</button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" disabled={!name.trim() || !age}>Let's learn! 🚀</Button>
      </motion.form>
    </div>
  );
}
