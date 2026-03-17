import { useState, useMemo } from 'react';
import { X, Search, Lock } from 'lucide-react';
import { BLOCK_REGISTRY, BLOCKS_BY_CATEGORY } from '@/constants/blocks.constants';
import type { BlockCategory } from '@/types/block.types';

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  hero: 'Hero',
  social_proof: 'Prova Social',
  benefits: 'Benefícios',
  conversion: 'Conversão',
  legal: 'Jurídico',
  structure: 'Estrutura',
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as BlockCategory[];

interface AddBlockPanelProps {
  onClose: () => void;
  onAddBlock: (type: string) => void;
  onCreateFromLayout: (columns: number[]) => void;
}

export function AddBlockPanel({ onClose, onAddBlock, onCreateFromLayout }: AddBlockPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allBlocks = useMemo(() => {
    return Object.values(BLOCK_REGISTRY);
  }, []);

  const filteredBlocks = useMemo(() => {
    let blocks = selectedCategory === 'all'
      ? allBlocks
      : BLOCKS_BY_CATEGORY[selectedCategory].map((type) => BLOCK_REGISTRY[type as keyof typeof BLOCK_REGISTRY]);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      blocks = blocks.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.description.toLowerCase().includes(term)
      );
    }

    return blocks;
  }, [selectedCategory, searchTerm, allBlocks]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-[680px] max-h-[85vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Adicionar Bloco</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2 flex-shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar bloco..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Blank block */}
        {!searchTerm.trim() && (
          <div className="px-6 py-3 flex-shrink-0">
            <button
              onClick={() => onCreateFromLayout([12])}
              className="w-full flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition group"
            >
              <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-5 border-2 border-slate-300 group-hover:border-blue-400 rounded-sm" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Bloco em Branco</p>
                <p className="text-xs text-slate-400">Bloco vazio para arrastar elementos</p>
              </div>
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b border-slate-100 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Blocks list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhum bloco encontrado para "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredBlocks.map((block) => (
                <button
                  key={block.type}
                  onClick={() => !block.is_premium && onAddBlock(block.type)}
                  className={`text-left p-3 rounded-xl border transition group ${
                    block.is_premium
                      ? 'border-amber-200 bg-amber-50 cursor-not-allowed'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${block.is_premium ? 'text-amber-700' : 'text-slate-900 group-hover:text-blue-700'}`}>
                        {block.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{block.description}</p>
                    </div>
                    {block.is_premium && (
                      <Lock size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <span className="inline-block mt-1.5 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {CATEGORY_LABELS[block.category]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
