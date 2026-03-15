import React, { useState } from 'react';

interface Tab { label: string; content: string; }

interface TabsElementProps {
  tabs?: Tab[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function TabsElement({ tabs = [{ label: 'Aba 1', content: 'Conteúdo da primeira aba.' }, { label: 'Aba 2', content: 'Conteúdo da segunda aba.' }, { label: 'Aba 3', content: 'Conteúdo da terceira aba.' }], styles, onSelect }: TabsElementProps) {
  const [active, setActive] = useState(0);
  return (
    <div style={styles} onClick={onSelect}>
      <div className="flex border-b border-slate-200">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setActive(i); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${active === i ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 text-slate-700 text-sm">{tabs[active]?.content}</div>
    </div>
  );
}
