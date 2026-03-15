import React from 'react';

interface SelectElementProps {
  label?: string;
  options?: string[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function SelectElement({ label = 'Selecione uma opção', options = ['Opção 1', 'Opção 2', 'Opção 3'], styles, onSelect }: SelectElementProps) {
  return (
    <div style={styles} onClick={onSelect}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="">Selecione...</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
