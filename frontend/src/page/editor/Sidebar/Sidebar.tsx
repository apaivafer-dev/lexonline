import { useState } from 'react';
import { ElementsSearch } from './ElementsSearch';
import { ElementsTab } from './ElementsTab';

interface SidebarProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Sidebar({ isVisible, onMouseEnter, onMouseLeave }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'width 200ms ease' }}
      className={`absolute left-0 top-0 h-full bg-white border-r border-slate-200 overflow-hidden z-30 shadow-md ${
        isVisible ? 'w-72' : 'w-0'
      }`}
    >
      <div className="w-72 h-full flex flex-col">
        <div className="p-3 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Elementos</h3>
          <ElementsSearch value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ElementsTab searchTerm={searchTerm} />
        </div>
        <div className="p-3 border-t border-slate-100 flex-shrink-0">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Arraste elementos para o canvas ou use "+" para blocos
          </p>
        </div>
      </div>
    </div>
  );
}
