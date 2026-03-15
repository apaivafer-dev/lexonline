import React from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Settings } from 'lucide-react';

interface BlockFloatingControlsProps {
  blockId: string;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onSettings: (blockId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockFloatingControls({
  blockId,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
  canMoveUp,
  canMoveDown,
}: BlockFloatingControlsProps) {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-300 rounded-lg shadow-lg flex items-center gap-1 p-1.5 z-30 whitespace-nowrap">
      <button
        onClick={(e) => { e.stopPropagation(); onMoveUp(blockId); }}
        disabled={!canMoveUp}
        className="p-1.5 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded transition"
        title="Mover para cima"
      >
        <ArrowUp size={15} className="text-slate-600" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onMoveDown(blockId); }}
        disabled={!canMoveDown}
        className="p-1.5 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded transition"
        title="Mover para baixo"
      >
        <ArrowDown size={15} className="text-slate-600" />
      </button>

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      <button
        onClick={(e) => { e.stopPropagation(); onDuplicate(blockId); }}
        className="p-1.5 hover:bg-slate-100 rounded transition"
        title="Duplicar bloco"
      >
        <Copy size={15} className="text-slate-600" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(blockId); }}
        className="p-1.5 hover:bg-red-50 rounded transition"
        title="Excluir bloco"
      >
        <Trash2 size={15} className="text-red-500" />
      </button>

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      <button
        onClick={(e) => { e.stopPropagation(); onSettings(blockId); }}
        className="p-1.5 hover:bg-slate-100 rounded transition"
        title="Configurações do bloco"
      >
        <Settings size={15} className="text-slate-600" />
      </button>
    </div>
  );
}
