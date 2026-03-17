import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ElementVisualRenderer } from './ElementVisualRenderer';
import type { PageColumn, PageElement, PageSchema, Page } from '@/types/page.types';

interface SectionColumnsProps {
  section: PageSchema;
  page: Page;
  onPageUpdate: (page: Page) => void;
  onElementSelect?: (element: { id: string; type: string; styles: Record<string, string>; sectionId: string; columnId: string }) => void;
}

interface ColumnDropZoneProps {
  column: PageColumn;
  onDropElement: (elementType: string) => void;
  onElementClick: (element: PageElement) => void;
  onRemoveElement: (elementId: string) => void;
}

function ElementRenderer({ element, onClick, onRemove }: { element: PageElement; onClick: () => void; onRemove: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-element-hover
      className={`relative group rounded-md transition cursor-pointer ${hovered ? 'ring-2 ring-blue-400' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {hovered && (
        <div className="absolute -top-3 right-1 flex gap-0.5 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-0.5 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 transition"
            title="Remover"
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
      <ElementVisualRenderer element={element} />
    </div>
  );
}

function ColumnDropZone({ column, onDropElement, onElementClick, onRemoveElement }: ColumnDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex-1 min-h-[80px] rounded-lg border-2 border-dashed transition-all p-2 space-y-1.5 ${
        dragOver
          ? 'border-blue-400 bg-blue-50'
          : column.elements.length > 0
            ? 'border-transparent bg-transparent'
            : 'border-slate-200 bg-slate-50/80'
      }`}
      style={{ flex: column.width }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={(e) => { e.stopPropagation(); setDragOver(false); }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const elementType = e.dataTransfer.getData('element-type');
        if (elementType) onDropElement(elementType);
      }}
    >
      {column.elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-xs text-slate-400">
          <Plus size={14} className="mr-1" />
          Soltar elemento
        </div>
      ) : (
        column.elements.map((el) => (
          <ElementRenderer
            key={el.id}
            element={el}
            onClick={() => onElementClick(el)}
            onRemove={() => onRemoveElement(el.id)}
          />
        ))
      )}
    </div>
  );
}

export function SectionColumns({ section, page, onPageUpdate, onElementSelect }: SectionColumnsProps) {
  const handleDropElement = (columnId: string, elementType: string) => {
    const newElement: PageElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: elementType,
      content: '',
      styles: {},
    };

    const newSchema = page.schema.map((s) => {
      if (s.id !== section.id) return s;
      return {
        ...s,
        columns: s.columns.map((col) => {
          if (col.id !== columnId) return col;
          return { ...col, elements: [...col.elements, newElement] };
        }),
      };
    });

    onPageUpdate({ ...page, schema: newSchema });
  };

  const handleRemoveElement = (columnId: string, elementId: string) => {
    const newSchema = page.schema.map((s) => {
      if (s.id !== section.id) return s;
      return {
        ...s,
        columns: s.columns.map((col) => {
          if (col.id !== columnId) return col;
          return { ...col, elements: col.elements.filter((el) => el.id !== elementId) };
        }),
      };
    });

    onPageUpdate({ ...page, schema: newSchema });
  };

  const handleElementClick = (columnId: string, element: PageElement) => {
    onElementSelect?.({
      id: element.id,
      type: element.type,
      styles: element.styles,
      sectionId: section.id,
      columnId,
    });
  };

  if (section.columns.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
        Seção vazia
      </div>
    );
  }

  // Apply section-level styles (backgroundColor, padding, textAlign, color) from the schema
  const sectionStyles: React.CSSProperties = {};
  if (section.styles) {
    const ss = section.styles;
    if (ss.backgroundColor) sectionStyles.backgroundColor = ss.backgroundColor;
    if (ss.padding) sectionStyles.padding = ss.padding;
    if (ss.textAlign) sectionStyles.textAlign = ss.textAlign as React.CSSProperties['textAlign'];
    if (ss.color) sectionStyles.color = ss.color;
  }

  return (
    <div className="flex gap-2 min-h-[60px]" style={{ padding: '12px', ...sectionStyles }}>
      {section.columns.map((col) => (
        <ColumnDropZone
          key={col.id}
          column={col}
          onDropElement={(type) => handleDropElement(col.id, type)}
          onElementClick={(el) => handleElementClick(col.id, el)}
          onRemoveElement={(elId) => handleRemoveElement(col.id, elId)}
        />
      ))}
    </div>
  );
}
