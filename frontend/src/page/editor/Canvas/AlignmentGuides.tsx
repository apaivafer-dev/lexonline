import React, { useMemo } from 'react';

interface ElementRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Guide {
  type: 'vertical' | 'horizontal';
  position: number;
}

interface AlignmentGuidesProps {
  elements: ElementRect[];
  selectedElementId: string | null;
  snapThreshold?: number;
}

export function AlignmentGuides({
  elements,
  selectedElementId,
  snapThreshold = 5,
}: AlignmentGuidesProps) {
  const guides = useMemo<Guide[]>(() => {
    if (!selectedElementId) return [];
    const selected = elements.find((el) => el.id === selectedElementId);
    if (!selected) return [];

    const sr = {
      left: selected.x,
      top: selected.y,
      right: selected.x + selected.width,
      bottom: selected.y + selected.height,
      centerX: selected.x + selected.width / 2,
      centerY: selected.y + selected.height / 2,
    };

    const result: Guide[] = [];

    elements.forEach((el) => {
      if (el.id === selectedElementId) return;

      const or = {
        left: el.x,
        top: el.y,
        right: el.x + el.width,
        bottom: el.y + el.height,
        centerX: el.x + el.width / 2,
        centerY: el.y + el.height / 2,
      };

      // Vertical guides
      if (Math.abs(sr.left - or.left) < snapThreshold)
        result.push({ type: 'vertical', position: sr.left });
      if (Math.abs(sr.right - or.right) < snapThreshold)
        result.push({ type: 'vertical', position: sr.right });
      if (Math.abs(sr.centerX - or.centerX) < snapThreshold)
        result.push({ type: 'vertical', position: sr.centerX });
      if (Math.abs(sr.left - or.right) < snapThreshold)
        result.push({ type: 'vertical', position: sr.left });
      if (Math.abs(sr.right - or.left) < snapThreshold)
        result.push({ type: 'vertical', position: sr.right });

      // Horizontal guides
      if (Math.abs(sr.top - or.top) < snapThreshold)
        result.push({ type: 'horizontal', position: sr.top });
      if (Math.abs(sr.bottom - or.bottom) < snapThreshold)
        result.push({ type: 'horizontal', position: sr.bottom });
      if (Math.abs(sr.centerY - or.centerY) < snapThreshold)
        result.push({ type: 'horizontal', position: sr.centerY });
      if (Math.abs(sr.top - or.bottom) < snapThreshold)
        result.push({ type: 'horizontal', position: sr.top });
      if (Math.abs(sr.bottom - or.top) < snapThreshold)
        result.push({ type: 'horizontal', position: sr.bottom });
    });

    // Deduplicate guides
    return result.filter(
      (g, i, arr) =>
        arr.findIndex((g2) => g2.type === g.type && g2.position === g.position) === i
    );
  }, [elements, selectedElementId, snapThreshold]);

  if (!guides.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {guides.map((guide, idx) =>
        guide.type === 'vertical' ? (
          <div
            key={idx}
            className="absolute top-0 h-full border-l-2 border-dashed border-red-500"
            style={{ left: guide.position, opacity: 0.75 }}
          />
        ) : (
          <div
            key={idx}
            className="absolute left-0 w-full border-t-2 border-dashed border-red-500"
            style={{ top: guide.position, opacity: 0.75 }}
          />
        )
      )}
    </div>
  );
}
