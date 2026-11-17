import type { ShapeItem } from '../../data/shapesColors';

export const BigEmoji = ({ children }: { children: string }) => (
  <span className="text-8xl leading-none sm:text-9xl" aria-hidden>{children}</span>
);

export const OptionText = ({ children, small = false }: { children: React.ReactNode; small?: boolean }) => (
  <span className={`font-black leading-none ${small ? 'text-3xl' : 'text-5xl sm:text-6xl'}`}>{children}</span>
);

export const OptionEmoji = ({ children }: { children: string }) => (
  <span className="text-6xl leading-none" aria-hidden>{children}</span>
);

/** A row of repeated emoji; `crossed` of them are shown struck out (for subtraction). */
export function EmojiGroup({ emoji, count, crossed = 0, size = 'text-4xl' }: {
  emoji: string; count: number; crossed?: number; size?: string;
}) {
  return (
    <div className={`flex max-w-sm flex-wrap justify-center gap-1 ${size}`} role="img" aria-label={`${count} ${emoji}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`relative ${i >= count - crossed ? 'opacity-30 grayscale' : ''}`} aria-hidden>
          {emoji}
          {i >= count - crossed && <span className="absolute inset-0 flex items-center justify-center text-red-500">✕</span>}
        </span>
      ))}
    </div>
  );
}

export const Swatch = ({ hex, size = 'h-20 w-20' }: { hex: string; size?: string }) => (
  <span className={`inline-block rounded-full border-[3px] border-ink shadow-[inset_0_-6px_0_rgb(0_0_0/0.12)] ${size}`} style={{ backgroundColor: hex }} aria-hidden />
);

export function ShapeSvg({ shape, size = 120 }: { shape: ShapeItem; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <path d={shape.path} fill={shape.color} stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockFace({ hour, minute, size = 220 }: { hour: number; minute: number; size?: number }) {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Clock showing ${hour}:${String(minute).padStart(2, '0')}`}>
      <circle cx="100" cy="100" r="94" fill="#FFFDF8" stroke="#23264A" strokeWidth="7" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const long = i % 5 === 0;
        const r1 = long ? 78 : 84, r2 = 88;
        return <line key={i} x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)} x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)}
          stroke={long ? '#334155' : '#CBD5E1'} strokeWidth={long ? 3 : 1.5} strokeLinecap="round" />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return <text key={n} x={100 + 62 * Math.sin(a)} y={100 - 62 * Math.cos(a) + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1E293B">{n}</text>;
      })}
      <line x1="100" y1="100" x2="100" y2="54" stroke="#EF4444" strokeWidth="9" strokeLinecap="round" transform={`rotate(${hourAngle} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="28" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" transform={`rotate(${minuteAngle} 100 100)`} />
      <circle cx="100" cy="100" r="7" fill="#1E293B" />
    </svg>
  );
}

/** Quantity picture: dots in fives for up to 20, base-ten rods and units above that. */
export function NumberVisual({ n }: { n: number }) {
  if (n === 0) return <p className="text-lg font-bold text-ink-soft">Nothing here – zero!</p>;
  if (n <= 20) {
    return (
      <div className="flex flex-col items-center gap-1" role="img" aria-label={`${n} dots`}>
        {[0, 10].map(start => n > start && (
          <div key={start} className="flex gap-2">
            {[0, 5].map(half => (
              <div key={half} className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const idx = start + half + i;
                  return <span key={i} className={`h-6 w-6 rounded-full sm:h-7 sm:w-7 ${idx < n ? (start === 0 ? 'bg-rose-400' : 'bg-sky-400') : 'bg-cream'}`} />;
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    <div className="flex flex-wrap items-end justify-center gap-3" role="img" aria-label={`${tens} tens and ${ones} ones`}>
      <div className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: tens }, (_, i) => (
          <div key={i} className="flex flex-col gap-px rounded bg-emerald-600 p-px">
            {Array.from({ length: 10 }, (_, j) => <span key={j} className="h-2 w-4 bg-emerald-300 sm:h-2.5 sm:w-5" />)}
          </div>
        ))}
      </div>
      <div className="flex max-w-20 flex-wrap gap-1">
        {Array.from({ length: ones }, (_, i) => <span key={i} className="h-3 w-3 rounded-sm bg-amber-400 sm:h-4 sm:w-4" />)}
      </div>
    </div>
  );
}
