import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const IMAGES = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  label: `Foto ${i + 1}`,
  color: ['#dbeafe', '#ede9fe', '#dcfce7', '#fef9c3', '#fee2e2', '#f0f9ff'][i],
}));

export function GalleryBlock() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Nossa Galeria</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {IMAGES.map(({ id, label, color }) => (
          <div
            key={id}
            onClick={() => setLightbox(id)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '4/3', backgroundColor: color }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">{label}</div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-slate-300 transition"><X size={32} /></button>
          <div className="bg-slate-200 rounded-xl flex items-center justify-center text-slate-500" style={{ width: 640, height: 480 }}>
            Imagem {lightbox} em tamanho completo
          </div>
        </div>
      )}
    </div>
  );
}
