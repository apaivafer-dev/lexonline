import React from 'react';

interface DividerElementProps {
  color?: string;
  thickness?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  margin?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function DividerElement({ color = '#e2e8f0', thickness = 1, style: borderStyle = 'solid', margin = 16, styles, onSelect }: DividerElementProps) {
  return (
    <hr
      style={{
        borderColor: color,
        borderTopWidth: thickness,
        borderStyle: borderStyle,
        marginTop: margin,
        marginBottom: margin,
        ...styles,
      }}
      className="w-full cursor-pointer"
      onClick={onSelect}
    />
  );
}
