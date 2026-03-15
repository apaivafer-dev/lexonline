import React, { useState } from 'react';
import { Code } from 'lucide-react';

interface HtmlCustomElementProps {
  html?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function HtmlCustomElement({ html = '<p>Código HTML personalizado</p>', styles, onSelect }: HtmlCustomElementProps) {
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState(html);

  if (editing) {
    return (
      <div style={styles}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 font-mono text-xs border border-blue-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900 text-green-400"
        />
        <button onClick={() => setEditing(false)} className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
          Aplicar
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ border: '1px dashed #e2e8f0', borderRadius: 8, padding: 12, ...styles }}
      className="relative group cursor-pointer hover:border-blue-300 transition"
      onClick={onSelect}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <button onClick={(e) => { e.stopPropagation(); setEditing(true); }} className="px-2 py-1 bg-slate-800 text-white text-xs rounded flex items-center gap-1">
          <Code size={12} /> Editar
        </button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
}
