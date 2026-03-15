import React from 'react';

interface SectionElementProps {
  children?: React.ReactNode;
  bgColor?: string;
  padding?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function SectionElement({ children, bgColor = '#ffffff', padding = 64, styles, onSelect }: SectionElementProps) {
  return (
    <section
      style={{ backgroundColor: bgColor, paddingTop: padding, paddingBottom: padding, paddingLeft: 32, paddingRight: 32, ...styles }}
      className="w-full"
      onClick={onSelect}
    >
      {children ?? (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400 text-sm">
          Seção — arraste elementos aqui
        </div>
      )}
    </section>
  );
}
