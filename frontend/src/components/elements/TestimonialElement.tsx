import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialElementProps {
  text?: string;
  author?: string;
  role?: string;
  rating?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function TestimonialElement({ text = 'Excelente atendimento! Resolverem meu caso com muita competência e dedicação.', author = 'João Silva', role = 'Cliente', rating = 5, styles, onSelect }: TestimonialElementProps) {
  return (
    <div style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 24, ...styles }} onClick={onSelect}>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
      </div>
      <p className="text-slate-700 italic mb-4">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{author[0]}</div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{author}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
