import { Shield, Home, Briefcase, Calendar, Heart, Calculator } from 'lucide-react';

const ICONS = { shield: Shield, home: Home, briefcase: Briefcase, calendar: Calendar, heart: Heart, calculator: Calculator };
type IconKey = keyof typeof ICONS;

const AREAS = [
  { name: 'Direito do Consumidor', icon: 'shield' as IconKey, color: '#2563eb' },
  { name: 'Direito Imobiliário', icon: 'home' as IconKey, color: '#7c3aed' },
  { name: 'Direito Trabalhista', icon: 'briefcase' as IconKey, color: '#dc2626' },
  { name: 'Direito Previdenciário', icon: 'calendar' as IconKey, color: '#059669' },
  { name: 'Direito de Família', icon: 'heart' as IconKey, color: '#f59e0b' },
  { name: 'Direito Tributário', icon: 'calculator' as IconKey, color: '#6366f1' },
];

export function AreasBlock() {
  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">Nossas Áreas de Especialização</h2>
      <p className="text-slate-600 text-center mb-12">Atendemos todas as principais áreas do direito</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {AREAS.map((area) => {
          const Icon = ICONS[area.icon];
          return (
            <div key={area.name} className="p-6 rounded-xl border-2 text-center hover:shadow-lg transition cursor-pointer" style={{ borderColor: area.color }}>
              <Icon size={36} className="mx-auto mb-3" style={{ color: area.color }} />
              <h3 className="font-semibold text-slate-900 text-sm">{area.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
