import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'success' | 'ghost' | 'warn';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  primary: 'bg-blue-500 text-white border-blue-700',
  success: 'bg-green-500 text-white border-green-700',
  warn: 'bg-orange-500 text-white border-orange-700',
  ghost: 'bg-white text-slate-600 border-slate-300',
};
const SIZES = {
  sm: 'px-4 py-2 text-base',
  md: 'px-6 py-3 text-xl',
  lg: 'px-8 py-4 text-2xl w-full',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96, y: 3 }}
      className={`rounded-2xl border-b-[5px] font-bold shadow-md transition-colors disabled:opacity-40 disabled:pointer-events-none
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
