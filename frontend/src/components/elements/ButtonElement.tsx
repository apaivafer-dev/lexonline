import React from 'react';
import { ArrowRight } from 'lucide-react';

type ButtonVariant = 'filled' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonElementProps {
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string;
  href?: string;
  showIcon?: boolean;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function ButtonElement({ text = 'Clique Aqui', variant = 'filled', size = 'md', color = '#2563eb', showIcon = false, styles, onSelect }: ButtonElementProps) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  const variants = {
    filled: { backgroundColor: color, color: '#fff', border: 'none' },
    outline: { backgroundColor: 'transparent', color, border: `2px solid ${color}` },
    ghost: { backgroundColor: 'transparent', color, border: 'none' },
  };

  return (
    <button
      style={{ ...variants[variant], borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, ...styles }}
      className={`${sizes[size]} transition hover:opacity-90`}
      onClick={onSelect}
    >
      {text}
      {showIcon && <ArrowRight size={16} />}
    </button>
  );
}
