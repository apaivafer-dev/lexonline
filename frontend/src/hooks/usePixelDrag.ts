import { useState, useEffect, useRef, useCallback } from 'react';
import { useSnapToGrid } from './useSnapToGrid';

interface Position { x: number; y: number; }

interface UsePixelDragOptions {
  initialPosition: Position;
  onMove: (pos: Position) => void;
  onMoveEnd?: (pos: Position) => void;
  containerRef?: React.RefObject<HTMLElement>;
  gridSize?: number;
}

export function usePixelDrag({
  initialPosition,
  onMove,
  onMoveEnd,
  containerRef,
  gridSize = 8,
}: UsePixelDragOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const { snapPosition } = useSnapToGrid(gridSize);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Skip if clicking a resize handle
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    e.preventDefault();

    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    setIsDragging(true);

    if (elementRef.current) {
      elementRef.current.style.opacity = '0.8';
      elementRef.current.style.cursor = 'grabbing';
    }
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef?.current ?? elementRef.current?.parentElement;
      const parentRect = container?.getBoundingClientRect();
      if (!parentRect) return;

      let rawX = e.clientX - parentRect.left - dragOffsetRef.current.x;
      let rawY = e.clientY - parentRect.top - dragOffsetRef.current.y;

      const maxX = parentRect.width - (elementRef.current?.offsetWidth ?? 100);
      const maxY = parentRect.height - (elementRef.current?.offsetHeight ?? 100);

      rawX = Math.max(0, Math.min(rawX, maxX));
      rawY = Math.max(0, Math.min(rawY, maxY));

      const snapped = snapPosition(rawX, rawY, e.shiftKey);
      setPosition(snapped);
      onMove(snapped);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);

      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
        elementRef.current.style.cursor = 'grab';
      }

      const container = containerRef?.current ?? elementRef.current?.parentElement;
      const parentRect = container?.getBoundingClientRect();
      if (parentRect) {
        let rawX = e.clientX - parentRect.left - dragOffsetRef.current.x;
        let rawY = e.clientY - parentRect.top - dragOffsetRef.current.y;
        const maxX = parentRect.width - (elementRef.current?.offsetWidth ?? 100);
        const maxY = parentRect.height - (elementRef.current?.offsetHeight ?? 100);
        rawX = Math.max(0, Math.min(rawX, maxX));
        rawY = Math.max(0, Math.min(rawY, maxY));
        const snapped = snapPosition(rawX, rawY, e.shiftKey);
        onMoveEnd?.(snapped);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onMove, onMoveEnd, snapPosition, containerRef]);

  return { elementRef, handleMouseDown, isDragging, position };
}
