import React from 'react';
import { Users, Award, MapPin } from 'lucide-react';

export function AboutBlock() {
  return (
    <div className="w-full py-16 px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center text-slate-400 mb-0">
            Foto do escritório
          </div>
        </div>
        <div>
          <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wider text-sm">Quem Somos</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Sobre Nosso Escritório</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Fundado em 2008, somos especialistas em direito do consumidor com escritórios em São Paulo,
            Rio de Janeiro e Belo Horizonte. Nossa missão é garantir que todo cidadão tenha acesso à justiça.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Users size={20} className="text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-slate-900">25+</p>
              <p className="text-xs text-slate-500">Advogados</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Award size={20} className="text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-slate-900">15</p>
              <p className="text-xs text-slate-500">Anos</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <MapPin size={20} className="text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-slate-900">3</p>
              <p className="text-xs text-slate-500">Escritórios</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Conheça Melhor
          </button>
        </div>
      </div>
    </div>
  );
}
