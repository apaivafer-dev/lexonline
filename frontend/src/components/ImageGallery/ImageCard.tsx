import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import type { ImageAsset } from '@/services/imageApi';

interface ImageCardProps {
  image: ImageAsset;
  onSelect: (image: ImageAsset) => void;
  onDelete: (id: string) => void;
}

export function ImageCard({ image, onSelect, onDelete }: ImageCardProps) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    onDelete(image.id);
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-slate-100 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(image)}
    >
      {/* Thumbnail */}
      <div className="aspect-square">
        <img
          src={image.urlThumb}
          alt={image.filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      {hovered && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(image); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition w-full justify-center"
          >
            <Check size={12} /> Selecionar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition w-full justify-center disabled:opacity-50"
          >
            <Trash2 size={12} /> {deleting ? '...' : 'Excluir'}
          </button>
        </div>
      )}

      {/* Filename */}
      <div className="px-2 py-1.5 bg-white text-xs text-slate-600 truncate border-t border-slate-100">
        {image.filename}
      </div>
    </div>
  );
}
