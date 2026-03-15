import React from 'react';

interface InputElementProps {
  placeholder?: string;
  label?: string;
  inputType?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function InputElement({ placeholder = 'Digite aqui...', label = 'Campo de texto', inputType = 'text', styles, onSelect }: InputElementProps) {
  return (
    <div style={styles} onClick={onSelect}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <input
        type={inputType}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
