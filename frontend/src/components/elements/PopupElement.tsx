import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PopupElementProps {
  triggerText?: string;
  title?: string;
  content?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function PopupElement({ triggerText = 'Abrir Popup', title = 'Título do Popup', content = 'Conteúdo do popup aqui. Configure o texto e as ações desejadas.', styles, onSelect }: PopupElementProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles} onClick={onSelect}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        {triggerText}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{title}</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded transition"><X size={18} /></button>
            </div>
            <p className="text-slate-600 text-sm mb-4">{content}</p>
            <button onClick={() => setOpen(false)} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
