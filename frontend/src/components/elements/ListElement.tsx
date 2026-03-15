import React from 'react';

interface ListElementProps {
  ordered?: boolean;
  items?: string[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function ListElement({ ordered = false, items = ['Primeiro item da lista', 'Segundo item da lista', 'Terceiro item da lista'], styles, onSelect }: ListElementProps) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      style={{ color: '#475569', paddingLeft: 24, lineHeight: 1.8, ...styles }}
      className={`${ordered ? 'list-decimal' : 'list-disc'} space-y-1`}
      onClick={onSelect}
    >
      {items.map((item, i) => (
        <li key={i} contentEditable suppressContentEditableWarning className="outline-none">
          {item}
        </li>
      ))}
    </Tag>
  );
}
