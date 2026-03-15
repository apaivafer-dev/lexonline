import React from 'react';
import { CheckCircle, Star, Award, Trophy } from 'lucide-react';

const STATS = [
  { label: 'Cases Resolvidos', value: '500+', Icon: CheckCircle, color: '#2563eb' },
  { label: 'Clientes Satisfeitos', value: '98%', Icon: Star, color: '#f59e0b' },
  { label: 'Anos de Experiência', value: '15+', Icon: Award, color: '#7c3aed' },
  { label: 'Vitórias em Tribunal', value: '200+', Icon: Trophy, color: '#059669' },
];

export function SocialProofBlock() {
  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Números que Falam por Si Só</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {STATS.map(({ label, value, Icon, color }) => (
          <div key={label} className="text-center p-6 rounded-xl bg-slate-50 hover:shadow-md transition">
            <Icon size={32} className="mx-auto mb-3" style={{ color }} />
            <div className="text-4xl font-bold text-slate-900 mb-1" style={{ color }}>{value}</div>
            <div className="text-slate-600 text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
