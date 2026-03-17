import React from 'react';
import { Play } from 'lucide-react';

interface VideoElementProps {
  url?: string;
  thumbnail?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function VideoElement({ url, styles, onSelect }: VideoElementProps) {
  if (url?.includes('youtube') || url?.includes('youtu.be') || url?.includes('vimeo')) {
    const embedUrl = url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
    return (
      <div style={{ aspectRatio: '16/9', ...styles }} className="rounded-lg overflow-hidden" onClick={onSelect}>
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video" />
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: '16/9', backgroundColor: '#0f172a', ...styles }}
      className="rounded-lg flex items-center justify-center cursor-pointer group hover:bg-slate-800 transition"
      onClick={onSelect}
    >
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
        <Play size={28} className="text-white ml-1" />
      </div>
      <p className="absolute text-white/60 text-sm mt-20">Clique para configurar o vídeo</p>
    </div>
  );
}
