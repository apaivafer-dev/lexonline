import React from 'react';
import { Award, Shield, Star } from 'lucide-react';

const CREDENTIALS = [
  { label: 'OAB SP 123456', description: 'Ordem dos Advogados do Brasil', Icon: Shield, color: '#2563eb' },
  { label: 'Especialista — AADC', description: 'Associação dos Advogados do Direito do Consumidor', Icon: Award, color: '#7c3aed' },
  { label: 'Prêmio Melhor Advogado 2023', description: 'Reconhecimento do Tribunal de Justiça de SP', Icon: Star, color: '#f59e0b' },
];

export function OabBadgeBlock() {
  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">Credenciais e Certificações</h2>
      <p className="text-slate-600 text-center mb-12">Profissionais reconhecidos e certificados</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {CREDENTIALS.map(({ label, description, Icon, color }) => (
          <div key={label} className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-slate-100 hover:shadow-lg transition">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15`, border: `2px solid ${color}` }}>
              <Icon size={36} style={{ color }} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{label}</h3>
            <p className="text-slate-500 text-sm">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
