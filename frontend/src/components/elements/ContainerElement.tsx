import React from 'react';

interface ContainerElementProps {
  children?: React.ReactNode;
  maxWidth?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function ContainerElement({ children, maxWidth = 1200, styles, onSelect }: ContainerElementProps) {
  return (
    <div
      style={{ maxWidth, marginLeft: 'auto', marginRight: 'auto', padding: '0 16px', ...styles }}
      onClick={onSelect}
    >
      {children ?? (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 text-sm">
          Container — arraste elementos aqui
        </div>
      )}
    </div>
  );
}
