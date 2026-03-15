import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem { question: string; answer: string; }

interface FaqElementProps {
  items?: FaqItem[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function FaqElement({ items = [{ question: 'Qual é o valor da consultoria?', answer: 'A consultoria inicial é gratuita e sem compromisso.' }, { question: 'Quanto tempo leva o processo?', answer: 'Varia de acordo com a complexidade do caso.' }], styles, onSelect }: FaqElementProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={styles} className="space-y-2" onClick={onSelect}>
      {items.map(({ question, answer }, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={(e) => { e.stopPropagation(); setOpen(open === i ? null : i); }} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition text-sm font-medium text-slate-900">
            {question}
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <div className="px-4 pb-3 text-sm text-slate-600 border-t border-slate-100 pt-2">{answer}</div>}
        </div>
      ))}
    </div>
  );
}
