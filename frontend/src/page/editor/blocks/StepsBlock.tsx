import React from 'react';

const STEPS = [
  { number: 1, title: 'Consulta Inicial', description: 'Entendemos seu caso em detalhe, sem compromisso.' },
  { number: 2, title: 'Análise Jurídica', description: 'Avaliamos todas as opções legais disponíveis.' },
  { number: 3, title: 'Estratégia', description: 'Definimos o plano de ação mais eficiente.' },
  { number: 4, title: 'Ação', description: 'Executamos a solução com agilidade e precisão.' },
];

export function StepsBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Como Funciona Nosso Atendimento</h2>
      <div className="max-w-4xl mx-auto relative">
        <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-blue-200 z-0" style={{ marginLeft: '10%', marginRight: '10%' }} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {STEPS.map(({ number, title, description }) => (
            <div key={number} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-xl">{number}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
