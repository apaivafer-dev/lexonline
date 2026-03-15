import React, { useState } from 'react';

interface TextElementProps {
  content?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function TextElement({ content = 'Clique para editar este parágrafo. Adicione o texto que deseja exibir na sua página.', styles, onSelect }: TextElementProps) {
  return (
    <p
      contentEditable
      suppressContentEditableWarning
      style={{ color: '#475569', fontSize: 16, lineHeight: 1.7, ...styles }}
      className="outline-none focus:outline-blue-300 focus:outline-2 rounded cursor-text"
      onClick={onSelect}
    >
      {content}
    </p>
  );
}
