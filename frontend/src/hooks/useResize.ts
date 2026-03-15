import { useState, useRef, useCallback } from 'react';

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface Size { width: number; height: number; }

interface UseResizeOptions {
  initialSize: Size;
  onResize: (size: Size) => void;
  onResizeEnd?: (size: Size) => void;
  minSize?: Size;
}

export function useResize({
  initialSize,
  onResize,
  onResizeEnd,
  minSize = { width: 20, height: 20 },
}: UseResizeOptions) {
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleHandleMouseDown = useCallback(
    (handle: ResizeHandle) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setActiveHandle(handle);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = elementRef.current?.offsetWidth ?? initialSize.width;
      const startHeight = elementRef.current?.offsetHeight ?? initialSize.height;
      const aspectRatio = startWidth / startHeight;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        switch (handle) {
          case 'nw': newWidth = startWidth - deltaX; newHeight = startHeight - deltaY; break;
          case 'n':  newHeight = startHeight - deltaY; break;
          case 'ne': newWidth = startWidth + deltaX; newHeight = startHeight - deltaY; break;
          case 'e':  newWidth = startWidth + deltaX; break;
          case 'se': newWidth = startWidth + deltaX; newHeight = startHeight + deltaY; break;
          case 's':  newHeight = startHeight + deltaY; break;
          case 'sw': newWidth = startWidth - deltaX; newHeight = startHeight + deltaY; break;
          case 'w':  newWidth = startWidth - deltaX; break;
        }

        // Shift = manter proporção
        if (moveEvent.shiftKey) {
          newHeight = newWidth / aspectRatio;
        }

        newWidth = Math.max(minSize.width, newWidth);
        newHeight = Math.max(minSize.height, newHeight);

        const size = { width: Math.round(newWidth), height: Math.round(newHeight) };
        onResize(size);

        if (elementRef.current) {
          elementRef.current.style.width = `${size.width}px`;
          elementRef.current.style.height = `${size.height}px`;
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setActiveHandle(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        if (elementRef.current) {
          onResizeEnd?.({
            width: elementRef.current.offsetWidth,
            height: elementRef.current.offsetHeight,
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [initialSize, onResize, onResizeEnd, minSize]
  );

  return { elementRef, handleHandleMouseDown, isResizing, activeHandle };
}

export const CURSOR_MAP: Record<ResizeHandle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
};
