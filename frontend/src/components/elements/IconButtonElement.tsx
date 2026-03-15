import React from 'react';
import { ArrowRight } from 'lucide-react';

interface IconButtonElementProps {
  icon?: string;
  size?: number;
  color?: string;
  bgColor?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function IconButtonElement({ size = 20, color = '#fff', bgColor = '#2563eb', styles, onSelect }: IconButtonElementProps) {
  return (
    <button
      style={{ backgroundColor: bgColor, width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', ...styles }}
      className="hover:opacity-90 transition"
      onClick={onSelect}
    >
      <ArrowRight size={size} color={color} />
    </button>
  );
}
