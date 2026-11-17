import { Volume2 } from 'lucide-react';

export function SpeakButton({ onClick, label = 'Listen', className = '' }: {
  onClick: () => void; label?: string; className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-lg font-bold text-slate-600 shadow-md border-b-4 border-slate-200 active:translate-y-0.5 active:border-b-2 ${className}`}
    >
      <Volume2 size={22} /> {label}
    </button>
  );
}
