import React from 'react';

interface QuoteElementProps {
  content?: string;
  author?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function QuoteElement({ content = 'A justiça não é uma virtude entre outras; é a virtude que garante todas as demais.', author = 'Aristóteles', styles, onSelect }: QuoteElementProps) {
  return (
    <blockquote
      style={styles}
      className="border-l-4 border-blue-500 pl-6 py-2"
      onClick={onSelect}
    >
      <p
        contentEditable
        suppressContentEditableWarning
        className="text-xl text-slate-700 italic mb-2 outline-none"
      >
        "{content}"
      </p>
      <cite
        contentEditable
        suppressContentEditableWarning
        className="text-slate-500 text-sm font-medium outline-none not-italic"
      >
        — {author}
      </cite>
    </blockquote>
  );
}
