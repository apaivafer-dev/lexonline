import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setActive(false);
    }
  }, []);

  useEffect(() => {
    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [active, handleClickOutside]);

  const outlineClass = active
    ? 'outline outline-2 outline-blue-400 outline-offset-1 rounded-sm'
    : hovered
      ? 'outline outline-1 outline-blue-300/60 outline-offset-1 rounded-sm [&:has([data-element-hover]:hover)]:outline-transparent'
      : '';

  return (
    <>
      <div
        ref={wrapperRef}
        className={`relative transition-all cursor-pointer ${outlineClass}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
          onSelect?.();
        }}
      >
        {active && (
          <BlockFloatingControls
            blockId={blockId}
            onMoveUp={(id) => { onMoveUp(id); setActive(false); }}
            onMoveDown={(id) => { onMoveDown(id); setActive(false); }}
            onDuplicate={(id) => { onDuplicate(id); setActive(false); }}
            onDelete={(id) => { onDelete(id); setActive(false); }}
            onSettings={() => { setShowSettings(true); setActive(false); }}
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
