import React from 'react';
import { Maximize2 } from 'lucide-react';

interface SpacerElementProps {
  height?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function SpacerElement({ height = 48, styles, onSelect }: SpacerElementProps) {
  return (
    <div
      style={{ height, ...styles }}
      className="w-full flex items-center justify-center border border-dashed border-slate-200 rounded cursor-pointer hover:bg-slate-50 group transition"
      onClick={onSelect}
    >
      <div className="flex items-center gap-1 text-slate-300 group-hover:text-slate-400 transition">
        <Maximize2 size={14} />
        <span className="text-xs">{height}px</span>
      </div>
    </div>
  );
}
