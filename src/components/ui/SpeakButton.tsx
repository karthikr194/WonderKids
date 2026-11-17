import { Volume2 } from 'lucide-react';

export function SpeakButton({ onClick, label = 'Listen', className = '' }: {
  onClick: () => void; label?: string; className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chunky-sm inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-lg font-bold text-ink ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white"><Volume2 size={16} /></span>
      {label}
    </button>
  );
}
