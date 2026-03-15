import React from 'react';
import { ImageIcon } from 'lucide-react';

interface GalleryElementProps {
  images?: string[];
  columns?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function GalleryElement({ images = [], columns = 3, styles, onSelect }: GalleryElementProps) {
  const placeholders = Array.from({ length: Math.max(images.length, columns) });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8, ...styles }} onClick={onSelect}>
      {placeholders.map((_, i) => (
        images[i] ? (
          <img key={i} src={images[i]} alt={`Gallery ${i + 1}`} className="rounded-lg object-cover w-full aspect-square" />
        ) : (
          <div key={i} className="bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-300 aspect-square">
            <ImageIcon size={24} className="text-slate-400" />
          </div>
        )
      ))}
    </div>
  );
}
