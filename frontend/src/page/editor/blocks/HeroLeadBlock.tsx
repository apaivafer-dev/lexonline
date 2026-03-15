import React from 'react';

export function HeroLeadBlock() {
  return (
    <div className="w-full py-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Aproveite sua Consultoria Jurídica Gratuita</h1>
          <p className="text-xl text-blue-100 mb-6">Análise completa do seu caso em 15 minutos</p>
          <ul className="space-y-2 text-blue-100">
            <li>✓ Sem compromisso</li>
            <li>✓ Resposta em até 24h</li>
            <li>✓ Advogados especializados</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-2xl">
          <h3 className="font-bold text-slate-900 text-lg mb-4">Informe Seus Dados</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Seu nome" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Seu e-mail" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" placeholder="Seu telefone" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Agendar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
