import { useState } from 'react';
import { X } from 'lucide-react';
import { ContentTab } from './tabs/ContentTab';
import { StyleTab } from './tabs/StyleTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import type { SelectedElement } from '@/types/editor.types';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: SelectedElement | null;
  onUpdateElement?: (data: Partial<SelectedElement>) => void;
  pageId?: string;
}

type TabId = 'content' | 'style' | 'advanced';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'content', label: 'Conteúdo' },
  { id: 'style', label: 'Estilo' },
  { id: 'advanced', label: 'Avançado' },
];

export function RightPanel({ isOpen, onClose, selectedElement, onUpdateElement, pageId }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('content');

  const handleUpdate = (data: Partial<SelectedElement>) => {
    onUpdateElement?.(data);
  };

  return (
    <div
      style={{ transition: 'width 200ms ease' }}
      className={`absolute right-0 top-0 h-full bg-white border-l border-slate-200 shadow-lg z-40 overflow-hidden flex-shrink-0 ${
        isOpen ? 'w-80' : 'w-0'
      }`}
    >
      <div className="w-80 h-full overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-sm">Propriedades</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {selectedElement ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-200 flex-shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'content' && (
                <ContentTab element={selectedElement} onUpdate={handleUpdate} pageId={pageId} />
              )}
              {activeTab === 'style' && (
                <StyleTab element={selectedElement} onUpdate={handleUpdate} />
              )}
              {activeTab === 'advanced' && (
                <AdvancedTab element={selectedElement} onUpdate={handleUpdate} />
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl text-slate-400">▣</span>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Nenhum elemento selecionado</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Clique em um elemento no canvas para editar suas propriedades
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
