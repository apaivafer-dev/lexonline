import React from 'react';

interface GridOverlayProps {
  visible: boolean;
  gridSize?: number;
}

export function GridOverlay({ visible, gridSize = 8 }: GridOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent ${gridSize - 1}px, rgba(0,0,0,0.04) ${gridSize - 1}px, rgba(0,0,0,0.04) ${gridSize}px),
          linear-gradient(90deg, transparent ${gridSize - 1}px, rgba(0,0,0,0.04) ${gridSize - 1}px, rgba(0,0,0,0.04) ${gridSize}px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
}
