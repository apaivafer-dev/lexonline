import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ElementCategoryProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function ElementCategory({ title, isOpen, onToggle }: ElementCategoryProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-100 rounded-lg transition text-left group"
    >
      <ChevronRight
        size={14}
        className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
      />
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
        {title}
      </span>
    </button>
  );
}
