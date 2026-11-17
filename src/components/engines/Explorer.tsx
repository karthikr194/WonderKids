import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sfx } from '../../lib/sfx';
import type { Theme } from '../../types';

interface Props<T> {
  items: T[];
  itemKey: (t: T) => string;
  renderTile: (t: T) => ReactNode;
  renderCard: (t: T) => ReactNode;
  /** Called whenever an item is opened – play its sound / award a star here. */
  onOpen?: (t: T) => void;
  theme: Theme;
  /** Tailwind grid columns for the tile grid. */
  gridClass?: string;
}

/** A tile grid; tapping a tile opens a big card with previous / next arrows. */
export function Explorer<T>({
  items, itemKey, renderTile, renderCard, onOpen, theme,
  gridClass = 'grid-cols-4 sm:grid-cols-6',
}: Props<T>) {
  const [index, setIndex] = useState<number | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // A different item list (e.g. new filter) closes the card.
  const signature = items.map(itemKey).join(',');
  useEffect(() => setIndex(null), [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (i: number) => {
    const n = (i + items.length) % items.length;
    sfx.tap();
    setIndex(n);
    onOpen?.(items[n]);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const current = index === null ? null : items[index];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div ref={top} className="scroll-mt-20" />
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={itemKey(current)}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className={`relative mb-6 rounded-[2rem] border-4 bg-white p-5 text-center shadow-xl sm:p-8 ${theme.border}`}
          >
            <button
              type="button" aria-label="Previous"
              onClick={() => open(index! - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-3 text-slate-500 active:scale-90 sm:left-4"
            ><ChevronLeft size={28} /></button>
            <button
              type="button" aria-label="Next"
              onClick={() => open(index! + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-3 text-slate-500 active:scale-90 sm:right-4"
            ><ChevronRight size={28} /></button>
            <div className="mx-10 sm:mx-14">{renderCard(current)}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-2 sm:gap-3 ${gridClass}`}>
        {items.map((it, i) => (
          <motion.button
            key={itemKey(it)}
            data-explore-tile
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => open(i)}
            className={`flex aspect-square items-center justify-center rounded-2xl border-b-4 text-2xl font-black shadow-sm sm:text-3xl
              ${i === index ? `${theme.solid} border-black/20 text-white` : `bg-white ${theme.text} border-slate-200`}`}
          >
            {renderTile(it)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
