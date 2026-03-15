import React from 'react';
import { X } from 'lucide-react';

interface BlockSettingsProps {
  blockId: string;
  blockType: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStyle: (blockId: string, styles: Record<string, string>) => void;
}

export function BlockSettings({ blockId, blockType, isOpen, onClose, onUpdateStyle }: BlockSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-white border-l border-slate-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Configurações do Bloco</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded transition">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Tipo</label>
            <p className="text-sm text-slate-700 font-medium">{blockType}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Cor de Fundo</label>
            <input
              type="color"
              defaultValue="#ffffff"
              onChange={(e) => onUpdateStyle(blockId, { backgroundColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Padding (px)</label>
            <input
              type="number"
              defaultValue={64}
              onChange={(e) => onUpdateStyle(blockId, { paddingTop: `${e.target.value}px`, paddingBottom: `${e.target.value}px` })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Margem (px)</label>
            <input
              type="number"
              defaultValue={0}
              onChange={(e) => onUpdateStyle(blockId, { marginTop: `${e.target.value}px`, marginBottom: `${e.target.value}px` })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Borda Arredondada (px)</label>
            <input
              type="number"
              defaultValue={0}
              onChange={(e) => onUpdateStyle(blockId, { borderRadius: `${e.target.value}px` })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
