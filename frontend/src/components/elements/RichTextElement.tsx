import React from 'react';

interface RichTextElementProps {
  content?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function RichTextElement({ content, styles, onSelect }: RichTextElementProps) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      style={{ color: '#475569', fontSize: 16, lineHeight: 1.7, ...styles }}
      className="outline-none focus:outline-blue-300 focus:outline-2 rounded cursor-text prose max-w-none"
      onClick={onSelect}
      dangerouslySetInnerHTML={{ __html: content ?? '<p>Texto <strong>negrito</strong>, <em>itálico</em> e <a href="#">link</a>. Clique para editar.</p>' }}
    />
  );
}
