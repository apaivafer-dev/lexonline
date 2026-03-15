import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function HeroVslBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full py-20 px-8 bg-slate-900 text-center">
      <p className="text-blue-400 font-semibold mb-3 uppercase tracking-wider text-sm">Antes de continuar, assista</p>
      <h1 className="text-4xl font-bold text-white mb-4">Descubra Como Resolvemos 500+ Casos</h1>
      <p className="text-slate-400 mb-10 text-lg">Assista este vídeo de 3 minutos e entenda nosso método</p>
      <div
        className="relative max-w-3xl mx-auto bg-slate-800 rounded-2xl overflow-hidden cursor-pointer group"
        style={{ aspectRatio: '16/9' }}
        onClick={() => setPlaying(true)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {!playing ? (
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition shadow-2xl">
              <Play size={32} className="text-white ml-1" />
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Vídeo seria carregado aqui</p>
          )}
        </div>
        {!playing && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />}
      </div>
      <button className="mt-8 px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition text-lg">
        Fale Conosco
      </button>
    </div>
  );
}
