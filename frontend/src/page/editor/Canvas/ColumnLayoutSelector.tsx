import { X } from 'lucide-react';

interface ColumnLayoutSelectorProps {
  onSelect: (columns: number[]) => void;
  onClose: () => void;
}

const LAYOUTS = [
  { name: '1 Coluna', columns: [12] },
  { name: '2 Colunas (50/50)', columns: [6, 6] },
  { name: '3 Colunas (1/3 cada)', columns: [4, 4, 4] },
  { name: '4 Colunas', columns: [3, 3, 3, 3] },
  { name: '2 Colunas (60/40)', columns: [7, 5] },
  { name: '2 Colunas (66/33)', columns: [8, 4] },
];

export function ColumnLayoutSelector({ onSelect, onClose }: ColumnLayoutSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-xl w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Escolha um Layout</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {LAYOUTS.map((layout, idx) => (
            <button
              key={idx}
              onClick={() => { onSelect(layout.columns); onClose(); }}
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left group"
            >
              <div className="flex gap-1 h-12 bg-slate-100 rounded-lg p-1.5 mb-3">
                {layout.columns.map((width, colIdx) => (
                  <div
                    key={colIdx}
                    style={{ flex: width }}
                    className="bg-blue-200 group-hover:bg-blue-400 rounded transition-colors"
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-700">{layout.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {layout.columns.join(' + ')} cols
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
