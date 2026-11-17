import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

export const MASCOT = '🦉';

export function MascotAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'h-24 w-24 text-6xl' : size === 'md' ? 'h-16 w-16 text-4xl' : 'h-12 w-12 text-3xl';
  return (
    <div className={`chunky-sm animate-bob flex shrink-0 items-center justify-center rounded-full bg-sun ${s}`} aria-hidden>
      {MASCOT}
    </div>
  );
}

/** Ollie the owl says something in a speech bubble; tapping the speaker repeats it. */
export function MascotSays({ children, onSpeak, size = 'md' }: {
  children: ReactNode; onSpeak?: () => void; size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className="flex items-end gap-3">
      <MascotAvatar size={size} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -8 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="chunky-sm relative flex flex-1 items-center gap-3 rounded-3xl rounded-bl-md bg-paper px-4 py-3"
      >
        <div className="flex-1 text-xl font-bold leading-snug text-ink sm:text-2xl">{children}</div>
        {onSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            aria-label="Hear it again"
            className="chunky-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white"
          >
            <Volume2 size={22} />
          </button>
        )}
      </motion.div>
    </div>
  );
}
