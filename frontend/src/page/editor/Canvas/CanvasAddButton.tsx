import React from 'react';
import { Plus } from 'lucide-react';

interface CanvasAddButtonProps {
  onClick: () => void;
  position?: 'between' | 'end';
}

export function CanvasAddButton({ onClick, position = 'end' }: CanvasAddButtonProps) {
  return (
    <div className={`flex items-center justify-center ${position === 'between' ? 'py-1' : 'py-4'}`}>
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium group"
        title="Adicionar bloco"
      >
        <Plus size={16} className="group-hover:scale-110 transition-transform" />
        {position === 'end' && <span>Adicionar bloco</span>}
      </button>
    </div>
  );
}
