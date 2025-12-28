import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-[6px] transition-all border-4 border-white/20";
  
  const variants = {
    primary: "bg-blue-400 text-white hover:bg-blue-500",
    secondary: "bg-purple-400 text-white hover:bg-purple-500",
    danger: "bg-red-400 text-white hover:bg-red-500",
    success: "bg-green-400 text-white hover:bg-green-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-lg",
    md: "px-6 py-3 text-xl",
    lg: "px-8 py-4 text-2xl w-full",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};