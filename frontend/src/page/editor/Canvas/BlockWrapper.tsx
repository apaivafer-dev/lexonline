import React, { useState } from 'react';
import { BlockFloatingControls } from './BlockFloatingControls';
import { BlockSettings } from './BlockSettings';

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  index: number;
  total: number;
  children: React.ReactNode;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onUpdateStyle: (blockId: string, styles: Record<string, string>) => void;
  onSelect?: () => void;
}

export function BlockWrapper({
  blockId,
  blockType,
  index,
  total,
  children,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onUpdateStyle,
  onSelect,
}: BlockWrapperProps) {
  const [hovered, setHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div
        className={`relative transition-all cursor-pointer ${hovered ? 'outline outline-2 outline-blue-400 outline-offset-1 rounded-sm' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        {hovered && (
          <BlockFloatingControls
            blockId={blockId}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onSettings={() => setShowSettings(true)}
            canMoveUp={index > 0}
            canMoveDown={index < total - 1}
          />
        )}

        {children}
      </div>

      <BlockSettings
        blockId={blockId}
        blockType={blockType}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onUpdateStyle={onUpdateStyle}
      />
    </>
  );
}
