import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselElementProps {
  slides?: Array<{ title: string; description: string; color: string; }>;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function CarouselElement({ slides = [{ title: 'Slide 1', description: 'Conteúdo do primeiro slide', color: '#dbeafe' }, { title: 'Slide 2', description: 'Conteúdo do segundo slide', color: '#ede9fe' }, { title: 'Slide 3', description: 'Conteúdo do terceiro slide', color: '#dcfce7' }], styles, onSelect }: CarouselElementProps) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div style={{ position: 'relative', ...styles }} onClick={onSelect}>
      <div style={{ backgroundColor: slides[current].color, borderRadius: 12, padding: 48, textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{slides[current].title}</h3>
        <p className="text-slate-600">{slides[current].description}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-slate-100 transition">
        <ChevronLeft size={16} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-slate-100 transition">
        <ChevronRight size={16} />
      </button>
      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-blue-600' : 'bg-slate-300'}`} />
        ))}
      </div>
    </div>
  );
}
