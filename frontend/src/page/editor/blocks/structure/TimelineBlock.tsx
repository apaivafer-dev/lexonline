import React from 'react';

const EVENTS = [
  { year: 2008, title: 'Fundação', description: 'Início das atividades com foco em direito do consumidor' },
  { year: 2012, title: 'Expansão', description: 'Abertura de filiais em Rio de Janeiro e Belo Horizonte' },
  { year: 2016, title: 'Reconhecimento', description: 'Prêmio de melhor escritório pelo TJ-SP' },
  { year: 2020, title: 'Digitalização', description: 'Implementação de atendimento 100% online' },
  { year: 2023, title: 'Transformação Digital', description: 'Lançamento da plataforma de advocacia digital' },
];

export function TimelineBlock() {
  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Nossa Trajetória</h2>
      <div className="max-w-3xl mx-auto">
        {EVENTS.map(({ year, title, description }, i) => (
          <div key={year} className={`flex gap-8 mb-8 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm inline-block w-full">
                <p className="text-blue-600 font-bold text-sm mb-1">{year}</p>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-100 z-10" />
              {i < EVENTS.length - 1 && <div className="w-0.5 bg-blue-200 flex-1" />}
            </div>
            <div className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
