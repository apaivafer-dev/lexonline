import React from 'react';

interface ColumnElementProps {
  children?: React.ReactNode;
  width?: string;
  gap?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function ColumnElement({ children, width = '1fr', gap = 16, styles, onSelect }: ColumnElementProps) {
  return (
    <div
      style={{ flex: 1, minWidth: 0, ...styles }}
      onClick={onSelect}
    >
      {children ?? (
        <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center text-slate-400 text-xs h-20 flex items-center justify-center">
          Coluna
        </div>
      )}
    </div>
  );
}
