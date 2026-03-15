import React from 'react';
import { Phone, Award, CheckCircle } from 'lucide-react';

export function LawyerProfileBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="bg-gradient-to-b from-blue-600 to-blue-800 p-8 text-white text-center">
            <div className="w-32 h-32 bg-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
              JS
            </div>
            <h3 className="text-xl font-bold mb-1">Dr. João Silva</h3>
            <p className="text-blue-200 text-sm mb-3">Especialista em Direito do Consumidor</p>
            <div className="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block">OAB SP 123456</div>
          </div>
          <div className="md:col-span-2 p-8">
            <p className="text-slate-600 leading-relaxed mb-6">
              Mais de 15 anos de experiência em direito do consumidor, com atuação em casos de alta complexidade.
              Especialista pela Escola Paulista de Direito e membro ativo da OAB-SP.
            </p>
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {['Direito do Consumidor', 'Indenizações', 'Contratos', 'Responsabilidade Civil'].map((s) => (
                  <span key={s} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600"><Award size={16} className="text-blue-600" /> 500+ casos</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle size={16} className="text-green-600" /> 95% de sucesso</div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              <Phone size={16} /> Agendar Consultoria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
