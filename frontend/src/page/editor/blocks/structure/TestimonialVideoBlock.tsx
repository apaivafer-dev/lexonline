import React, { useState } from 'react';
import { Play } from 'lucide-react';

const VIDEOS = [
  { client: 'Maria Santos', result: 'Recuperou R$ 45.000 em indenização', duration: '2:34' },
  { client: 'João Ferreira', result: 'Ganhou causa trabalhista após 8 meses', duration: '3:12' },
  { client: 'Ana Costa', result: 'Escritório conseguiu anular contrato abusivo', duration: '1:58' },
];

export function TestimonialVideoBlock() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-3 text-slate-900">Histórias de Sucesso</h2>
      <p className="text-slate-600 text-center mb-12">Veja como ajudamos nossos clientes a conquistar seus direitos</p>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIDEOS.map(({ client, result, duration }, i) => (
          <div
            key={client}
            onClick={() => setSelected(i)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition ${selected === i ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'}`}
          >
            <div className="bg-slate-800 relative" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selected === i ? 'bg-blue-600' : 'bg-white/80'}`}>
                  <Play size={20} className={selected === i ? 'text-white' : 'text-slate-800'} />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{duration}</span>
            </div>
            <div className="p-4 bg-white">
              <p className="font-bold text-slate-900 text-sm">{client}</p>
              <p className="text-slate-500 text-xs mt-1">{result}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
