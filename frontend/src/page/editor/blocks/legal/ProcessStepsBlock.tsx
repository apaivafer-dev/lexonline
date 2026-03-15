import React from 'react';

const STEPS = [
  { phase: 'Protocolo', description: 'Registro e distribuição da ação', duration: '1 dia', color: '#2563eb' },
  { phase: 'Contestação', description: 'Resposta da parte adversa', duration: '15 dias', color: '#7c3aed' },
  { phase: 'Instrução', description: 'Coleta e análise de provas', duration: '6 meses', color: '#f59e0b' },
  { phase: 'Julgamento', description: 'Decisão judicial', duration: 'variável', color: '#059669' },
];

export function ProcessStepsBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">Entenda o Processo Legal</h2>
      <p className="text-slate-600 text-center mb-12">Etapas claras para que você saiba o que esperar</p>
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-6">
            {STEPS.map(({ phase, description, duration, color }, i) => (
              <div key={i} className="relative pl-16">
                <div className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md" style={{ backgroundColor: color }}>
                  {i + 1}
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">{phase}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{duration}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
