import React from 'react';

interface RadioElementProps {
  label?: string;
  name?: string;
  options?: string[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function RadioElement({ label = 'Escolha uma opção', name = 'radio-group', options = ['Opção A', 'Opção B', 'Opção C'], styles, onSelect }: RadioElementProps) {
  return (
    <div style={styles} onClick={onSelect}>
      {label && <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>}
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={name} className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
