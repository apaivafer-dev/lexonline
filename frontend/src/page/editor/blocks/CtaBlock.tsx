import React from 'react';
import { ArrowRight } from 'lucide-react';

export function CtaBlock() {
  return (
    <div className="w-full py-20 px-8 bg-blue-600 text-center">
      <h2 className="text-4xl font-bold text-white mb-4">Pronto Para Resolver Seu Caso?</h2>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Agende uma consultoria gratuita com nossos especialistas e dê o primeiro passo rumo à solução.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition text-lg flex items-center gap-2 justify-center">
          Agendar Consultoria <ArrowRight size={20} />
        </button>
        <button className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition text-lg">
          Falar pelo WhatsApp
        </button>
      </div>
    </div>
  );
}
