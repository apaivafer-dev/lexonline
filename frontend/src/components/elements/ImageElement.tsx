import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageElementProps {
  src?: string;
  alt?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function ImageElement({ src, alt = 'Imagem', styles, onSelect }: ImageElementProps) {
  return (
    <div className="relative group" onClick={onSelect} style={styles}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-auto rounded-lg object-cover" />
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition" style={{ minHeight: 200 }}>
          <ImageIcon size={48} className="text-slate-400 mb-2" />
          <p className="text-slate-500 text-sm font-medium">Clique para adicionar imagem</p>
          <p className="text-slate-400 text-xs mt-1">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
}
