import React from 'react';
import { Zap } from 'lucide-react';

interface LottieElementProps {
  animationUrl?: string;
  width?: number;
  height?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function LottieElement({ animationUrl, width = 200, height = 200, styles, onSelect }: LottieElementProps) {
  return (
    <div
      style={{ width, height, ...styles }}
      className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-100 transition"
      onClick={onSelect}
    >
      <Zap size={40} className="text-yellow-400 mb-2" />
      <p className="text-slate-500 text-sm font-medium">Animação Lottie</p>
      <p className="text-slate-400 text-xs mt-1">{animationUrl ? 'Animação carregada' : 'Adicionar URL do JSON'}</p>
    </div>
  );
}
