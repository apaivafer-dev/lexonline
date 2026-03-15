import React from 'react';

interface TextAreaElementProps {
  placeholder?: string;
  label?: string;
  rows?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function TextAreaElement({ placeholder = 'Digite sua mensagem...', label = 'Mensagem', rows = 4, styles, onSelect }: TextAreaElementProps) {
  return (
    <div style={styles} onClick={onSelect}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}
