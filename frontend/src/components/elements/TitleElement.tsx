import React, { useState } from 'react';

interface TitleElementProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  content?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function TitleElement({ level = 1, content = 'Seu Titulo Aqui', styles, onSelect }: TitleElementProps) {
  const [text, setText] = useState(content);

  const defaultStyles: React.CSSProperties = {
    fontSize: level === 1 ? 48 : level === 2 ? 36 : level === 3 ? 28 : level === 4 ? 22 : level === 5 ? 18 : 16,
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.2,
    ...styles,
  };

  return React.createElement(
    `h${level}`,
    {
      contentEditable: true,
      suppressContentEditableWarning: true,
      style: defaultStyles,
      className: 'outline-none focus:outline-blue-300 focus:outline-2 rounded cursor-text',
      onClick: onSelect,
      onBlur: (e: React.FocusEvent<HTMLElement>) => setText(e.currentTarget.textContent || ''),
    },
    text,
  );
}
