import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ElementCard } from './ElementCard';
import { ELEMENT_CATEGORIES } from '@/constants/elements.constants';

interface ElementsTabProps {
  searchTerm: string;
}

export function ElementsTab({ searchTerm }: ElementsTabProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([ELEMENT_CATEGORIES[0].id])
  );

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCategories = searchTerm.trim()
    ? ELEMENT_CATEGORIES.map((cat) => ({
        ...cat,
        elements: cat.elements.filter((el) =>
          el.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter((cat) => cat.elements.length > 0)
    : ELEMENT_CATEGORIES;

  if (filteredCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 text-sm">Nenhum elemento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {filteredCategories.map((cat) => {
        const isOpen = searchTerm.trim() ? true : openCategories.has(cat.id);
        return (
          <div key={cat.id}>
            <button
              onClick={() => !searchTerm.trim() && toggleCategory(cat.id)}
              className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-100 transition text-left"
            >
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                {cat.label}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">{cat.elements.length}</span>
                {!searchTerm.trim() && (
                  <ChevronRight
                    size={14}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="grid grid-cols-2 gap-1.5 px-1 pb-2">
                {cat.elements.map((el) => (
                  <ElementCard key={el.id} element={el} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
