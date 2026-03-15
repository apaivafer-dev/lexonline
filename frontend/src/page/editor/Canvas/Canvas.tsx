import React, { useState } from 'react';
import { DEVICE_WIDTHS } from '@/types/editor.types';
import { CanvasAddButton } from './CanvasAddButton';
import { AddBlockPanel } from './AddBlockPanel';
import { BlockWrapper } from './BlockWrapper';
import { BlockRenderer } from './BlockRenderer';
import { SectionColumns } from './SectionColumns';
import { GridOverlay } from './GridOverlay';
import { DropIndicator } from './DropIndicator';
import { useBlocks } from '@/hooks/useBlocks';
import type { DeviceType, SelectedElement } from '@/types/editor.types';
import type { Page } from '@/types/page.types';

interface CanvasProps {
  page: Page | null;
  device: DeviceType;
  onAddBlock: (type: string) => void;
  onCreateFromLayout: (columns: number[]) => void;
  onPageUpdate?: (page: Page) => void;
  onElementSelect?: (element: SelectedElement) => void;
  showGrid?: boolean;
}

export function Canvas({ page, device, onAddBlock, onCreateFromLayout, onPageUpdate, onElementSelect, showGrid = false }: CanvasProps) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [insertAfterIndex, setInsertAfterIndex] = useState<number | undefined>(undefined);
  const [dropActive, setDropActive] = useState(false);
  const width = DEVICE_WIDTHS[device];

  const pageUpdateFn = onPageUpdate ?? (() => {});

  const { addBlock, addEmptyBlock, removeBlock, reorderBlock, duplicateBlock, updateBlockStyle } = useBlocks(
    page,
    pageUpdateFn
  );

  const handleAddBlock = (type: string) => {
    addBlock(type, insertAfterIndex);
    onAddBlock(type);
    setShowAddPanel(false);
  };

  const handleCreateFromLayout = (cols: number[]) => {
    addEmptyBlock(cols, insertAfterIndex);
    onCreateFromLayout(cols);
    setShowAddPanel(false);
  };

  const openAddPanel = (afterIndex?: number) => {
    setInsertAfterIndex(afterIndex);
    setShowAddPanel(true);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    const elementType = e.dataTransfer.getData('element-type');
    if (elementType && page) {
      const newElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: elementType,
        content: '',
        styles: {},
      };
      const newBlock = {
        id: `block-${Date.now()}`,
        type: 'section' as const,
        styles: {},
        columns: [{
          id: `col-${Date.now()}`,
          width: 12,
          elements: [newElement],
        }],
      };
      pageUpdateFn({ ...page, schema: [...page.schema, newBlock] });
    }
  };

  const isBlankSection = (section: Page['schema'][0]) => {
    return !section.styles?.blockType || section.styles.blockType === 'section';
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-auto flex items-start justify-center py-8 px-4">
      <div
        className="bg-white rounded-xl shadow-lg min-h-[calc(100vh-8rem)] transition-all duration-300 overflow-hidden relative"
        style={{ width: `${width}px`, maxWidth: '100%' }}
        onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
        onDragLeave={() => setDropActive(false)}
        onDrop={handleCanvasDrop}
      >
        <GridOverlay visible={showGrid} />
        <DropIndicator isActive={dropActive} position="inside" label="Soltar elemento aqui" />
        {page ? (
          <div>
            {page.schema.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                <p className="text-slate-400 text-lg mb-2">Página em branco</p>
                <p className="text-slate-400 text-sm mb-6">Clique no "+" para adicionar o primeiro bloco</p>
                <CanvasAddButton onClick={() => openAddPanel(undefined)} position="end" />
              </div>
            ) : (
              <div>
                {page.schema.map((section, idx) => (
                  <div key={section.id}>
                    <BlockWrapper
                      blockId={section.id}
                      blockType={section.styles?.blockType ?? section.type}
                      index={idx}
                      total={page.schema.length}
                      onMoveUp={() => reorderBlock(idx, idx - 1)}
                      onMoveDown={() => reorderBlock(idx, idx + 1)}
                      onDuplicate={duplicateBlock}
                      onDelete={removeBlock}
                      onUpdateStyle={updateBlockStyle}
                      onSelect={() => onElementSelect?.({
                        id: section.id,
                        type: section.styles?.blockType ?? section.type,
                        styles: section.styles ?? {},
                        sectionId: section.id,
                        columnId: '',
                      })}
                    >
                      {isBlankSection(section) ? (
                        <SectionColumns
                          section={section}
                          page={page}
                          onPageUpdate={pageUpdateFn}
                          onElementSelect={onElementSelect ? (el) => onElementSelect({
                            id: el.id,
                            type: el.type,
                            styles: el.styles,
                            sectionId: el.sectionId,
                            columnId: el.columnId,
                          }) : undefined}
                        />
                      ) : (
                        <BlockRenderer blockType={section.styles?.blockType ?? section.type} />
                      )}
                    </BlockWrapper>

                    {idx < page.schema.length - 1 && (
                      <CanvasAddButton onClick={() => openAddPanel(idx)} position="between" />
                    )}
                  </div>
                ))}
                <div className="px-8 pb-8">
                  <CanvasAddButton onClick={() => openAddPanel(page.schema.length - 1)} position="end" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">Carregando página...</p>
          </div>
        )}
      </div>

      {showAddPanel && (
        <AddBlockPanel
          onClose={() => setShowAddPanel(false)}
          onAddBlock={handleAddBlock}
          onCreateFromLayout={handleCreateFromLayout}
        />
      )}
    </div>
  );
}
