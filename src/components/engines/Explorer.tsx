import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { sfx } from '../../lib/sfx';
import { MascotSays } from '../ui/Mascot';

interface Props<T> {
  items: T[];
  itemKey: (t: T) => string;
  renderTile: (t: T) => ReactNode;
  renderCard: (t: T) => ReactNode;
  /** Called whenever an item is opened – play its sound / award a star here. */
  onOpen?: (t: T) => void;
  /** Tailwind grid columns for the tile grid. */
  gridClass?: string;
  /** What the mascot says before anything is opened. */
  hint?: string;
}

/** A tile grid; tapping a tile opens a big card with previous / next arrows. */
export function Explorer<T>({
  items, itemKey, renderTile, renderCard, onOpen,
  gridClass = 'grid-cols-4 sm:grid-cols-6', hint = 'Tap a card to explore!',
}: Props<T>) {
  const [index, setIndex] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const top = useRef<HTMLDivElement>(null);

  // A different item list (e.g. new filter) closes the card.
  const signature = items.map(itemKey).join(',');
  useEffect(() => setIndex(null), [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (i: number) => {
    const n = (i + items.length) % items.length;
    sfx.tap();
    setIndex(n);
    setSeen(s => new Set(s).add(itemKey(items[n])));
    onOpen?.(items[n]);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const seenHere = items.filter(it => seen.has(itemKey(it))).length;

  return (
    <div className="mx-auto w-full max-w-3xl pb-8">
      <div ref={top} className="scroll-mt-24" />
      <AnimatePresence mode="wait">
        {index !== null ? (
          <motion.div
            key={itemKey(items[index])}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="chunky relative mb-6 overflow-hidden rounded-[2rem] bg-paper text-center"
          >
            <div className="h-3 bg-accent" />
            <button type="button" aria-label="Close" onClick={() => setIndex(null)}
              className="absolute right-3 top-6 rounded-full p-1.5 text-ink-soft hover:bg-ink/5"><X size={22} /></button>
            <div className="px-5 pb-5 pt-5 sm:px-10 sm:pb-8">{renderCard(items[index])}</div>
            <div className="flex items-center justify-between border-t-[3px] border-ink bg-accent-soft px-3 py-2.5">
              <button type="button" aria-label="Previous" onClick={() => open(index - 1)}
                className="chunky-sm flex h-11 w-11 items-center justify-center rounded-full bg-paper"><ChevronLeft size={24} /></button>
              <span className="font-bold text-ink-soft">{index + 1} of {items.length}</span>
              <button type="button" aria-label="Next" onClick={() => open(index + 1)}
                className="chunky-sm flex h-11 w-11 items-center justify-center rounded-full bg-paper"><ChevronRight size={24} /></button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
            <MascotSays>{hint}</MascotSays>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-3 flex items-center justify-between px-1 text-sm font-bold text-ink-soft">
        <span>Explored {seenHere} of {items.length}</span>
        <span className="h-2.5 w-32 overflow-hidden rounded-full bg-ink/10">
          <span className="block h-full rounded-full bg-accent transition-all" style={{ width: `${(seenHere / items.length) * 100}%` }} />
        </span>
      </div>
      <div className={`grid gap-2.5 sm:gap-3 ${gridClass}`}>
        {items.map((it, i) => {
          const active = i === index;
          const visited = seen.has(itemKey(it));
          return (
            <button
              key={itemKey(it)}
              data-explore-tile
              type="button"
              onClick={() => open(i)}
              className={`chunky-sm relative flex aspect-square items-center justify-center rounded-2xl text-2xl font-black sm:text-3xl
                ${active ? 'bg-accent text-white' : visited ? 'bg-accent-soft text-accent-deep' : 'bg-paper text-ink'}`}
            >
              {renderTile(it)}
              {visited && !active && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
