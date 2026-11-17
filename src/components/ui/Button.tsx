import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'good' | 'sun' | 'paper';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  accent: 'bg-accent text-white',
  good: 'bg-good text-white',
  sun: 'bg-sun text-ink',
  paper: 'bg-paper text-ink',
};
const SIZES = {
  sm: 'px-4 py-2 text-base rounded-2xl',
  md: 'px-6 py-3 text-xl rounded-2xl',
  lg: 'w-full px-6 py-4 text-2xl rounded-3xl',
};

export function Button({ variant = 'accent', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`chunky font-bold tracking-wide disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    />
  );
}

export function IconButton({ label, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`chunky-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper text-ink ${className}`}
      {...rest}
    />
  );
}
