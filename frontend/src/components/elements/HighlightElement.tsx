import React from 'react';

interface HighlightElementProps {
  content?: string;
  color?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function HighlightElement({ content = 'Texto em destaque importante', color = '#fef08a', styles, onSelect }: HighlightElementProps) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      style={{ backgroundColor: color, padding: '2px 8px', borderRadius: 4, fontWeight: 600, ...styles }}
      className="outline-none cursor-text"
      onClick={onSelect}
    >
      {content}
    </span>
  );
}
