import { useState, useCallback, useEffect } from 'react';

interface Rect { id: string; x: number; y: number; width: number; height: number; }

interface UseMultiSelectOptions {
  elements: Rect[];
  onSelectChange?: (ids: string[]) => void;
  onDeleteSelected?: (ids: string[]) => void;
  onMoveSelected?: (ids: string[], delta: { x: number; y: number }) => void;
}

interface DragSelect { startX: number; startY: number; endX: number; endY: number; }

export function useMultiSelect({
  elements,
  onSelectChange,
  onDeleteSelected,
  onMoveSelected,
}: UseMultiSelectOptions) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dragSelect, setDragSelect] = useState<DragSelect | null>(null);
  const [isDragSelecting, setIsDragSelecting] = useState(false);

  const select = useCallback(
    (ids: string[]) => {
      setSelectedIds(ids);
      onSelectChange?.(ids);
    },
    [onSelectChange]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      select([]);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragSelect({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      });
      setIsDragSelecting(true);
    },
    [select]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDragSelecting || !dragSelect) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const updated: DragSelect = {
        ...dragSelect,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      };
      setDragSelect(updated);

      const selectLeft = Math.min(updated.startX, updated.endX);
      const selectTop = Math.min(updated.startY, updated.endY);
      const selectRight = Math.max(updated.startX, updated.endX);
      const selectBottom = Math.max(updated.startY, updated.endY);

      const newSelected = elements
        .filter((el) => {
          const elRight = el.x + el.width;
          const elBottom = el.y + el.height;
          return !(elRight < selectLeft || el.x > selectRight || elBottom < selectTop || el.y > selectBottom);
        })
        .map((el) => el.id);

      select(newSelected);
    },
    [isDragSelecting, dragSelect, elements, select]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragSelecting(false);
    setDragSelect(null);
  }, []);

  const handleElementClick = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
        const newSelected = selectedIds.includes(elementId)
          ? selectedIds.filter((id) => id !== elementId)
          : [...selectedIds, elementId];
        select(newSelected);
      } else {
        select([elementId]);
      }
    },
    [selectedIds, select]
  );

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedIds.length) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteSelected?.(selectedIds);
        select([]);
        return;
      }

      const delta = e.shiftKey ? 10 : 1;
      const directions: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -delta },
        ArrowDown: { x: 0, y: delta },
        ArrowLeft: { x: -delta, y: 0 },
        ArrowRight: { x: delta, y: 0 },
      };

      if (directions[e.key]) {
        e.preventDefault();
        onMoveSelected?.(selectedIds, directions[e.key]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, onDeleteSelected, onMoveSelected, select]);

  // Escape deselects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select([]);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [select]);

  return {
    selectedIds,
    dragSelect,
    isDragSelecting,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementClick,
    select,
  };
}
