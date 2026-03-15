import React from 'react';

export function HeroVideoBlock() {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="absolute inset-0 bg-slate-800" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full py-32 px-8 text-center text-white">
        <p className="text-blue-300 font-semibold mb-3 uppercase tracking-wider text-sm">Advocacia Especializada</p>
        <h1 className="text-5xl font-bold mb-4 max-w-3xl">Transformando Vidas Através da Justiça</h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl">Advocacia especializada em direitos do consumidor com mais de 15 anos de experiência</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg">
            Consulte Agora
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition text-lg">
            Saiba Mais
          </button>
        </div>
      </div>
    </div>
  );
}
