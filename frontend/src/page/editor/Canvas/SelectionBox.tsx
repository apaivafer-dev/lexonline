import React from 'react';
import type { ResizeHandle } from '@/hooks/useResize';
import { CURSOR_MAP } from '@/hooks/useResize';

const HANDLES: Array<{ name: ResizeHandle; className: string }> = [
  { name: 'nw', className: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { name: 'n',  className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
  { name: 'ne', className: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { name: 'e',  className: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  { name: 'se', className: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
  { name: 's',  className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
  { name: 'sw', className: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { name: 'w',  className: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
];

interface SelectionBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (handle: ResizeHandle) => (e: React.MouseEvent) => void;
  label?: string;
}

export function SelectionBox({
  x,
  y,
  width,
  height,
  onDragStart,
  onResizeStart,
  label,
}: SelectionBoxProps) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, width, height, pointerEvents: 'none' }}
    >
      {/* Borda de seleção */}
      <div className="absolute inset-0 border-2 border-blue-500 rounded-sm">
        {/* Label */}
        {label && (
          <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
            {label}
          </div>
        )}

        {/* Overlay drag area */}
        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing bg-blue-500/5"
          style={{ pointerEvents: 'auto' }}
          onMouseDown={onDragStart}
        />

        {/* 8 resize handles */}
        {HANDLES.map(({ name, className }) => (
          <div
            key={name}
            className={`resize-handle absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-500 transition-colors ${className}`}
            style={{ pointerEvents: 'auto', cursor: CURSOR_MAP[name] }}
            onMouseDown={onResizeStart(name)}
          />
        ))}
      </div>
    </div>
  );
}
