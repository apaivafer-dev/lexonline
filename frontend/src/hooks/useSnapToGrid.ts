import { useCallback } from 'react';

export function useSnapToGrid(gridSize = 8) {
  const snap = useCallback(
    (value: number, shiftKey = false): number => {
      if (shiftKey) return value; // Shift desativa snap
      return Math.round(value / gridSize) * gridSize;
    },
    [gridSize]
  );

  const snapPosition = useCallback(
    (x: number, y: number, shiftKey = false): { x: number; y: number } => ({
      x: snap(x, shiftKey),
      y: snap(y, shiftKey),
    }),
    [snap]
  );

  return { snap, snapPosition, gridSize };
}
