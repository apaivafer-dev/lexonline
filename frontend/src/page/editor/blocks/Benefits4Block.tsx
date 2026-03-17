import { Phone, CreditCard, Shield, Users } from 'lucide-react';

const ITEMS = [
  { title: 'Atendimento 24/7', description: 'Sempre disponíveis quando você precisar', Icon: Phone },
  { title: 'Sem Taxa Inicial', description: 'Consulta gratuita sem compromisso', Icon: CreditCard },
  { title: 'Garantia de Resultado', description: 'Compromisso total com seu caso', Icon: Shield },
  { title: 'Equipe Dedicada', description: 'Profissionais exclusivos para você', Icon: Users },
];

export function Benefits4Block() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Vantagens Exclusivas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {ITEMS.map(({ title, description, Icon }) => (
          <div key={title} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 text-sm">{title}</h3>
            <p className="text-slate-500 text-xs">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
