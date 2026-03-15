import React from 'react';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Essencial',
    price: 'R$ 1.990',
    period: '/consulta',
    features: ['Consultoria inicial', 'Análise de caso', 'Recomendações estratégicas', 'Relatório por e-mail'],
    featured: false,
    cta: 'Contratar',
  },
  {
    name: 'Completo',
    price: 'R$ 4.990',
    period: '/mês',
    features: ['Tudo do Essencial', 'Acompanhamento processual', 'Audiências inclusas', 'Suporte prioritário', 'Recursos ilimitados'],
    featured: true,
    cta: 'Mais Popular',
  },
  {
    name: 'Corporativo',
    price: 'Sob consulta',
    period: '',
    features: ['Tudo do Completo', 'Advogado dedicado', 'Contratos ilimitados', 'Assessoria preventiva', 'SLA garantido'],
    featured: false,
    cta: 'Falar com especialista',
  },
];

export function PricingBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">Nossos Pacotes</h2>
      <p className="text-slate-600 text-center mb-12">Escolha o plano ideal para sua situação</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl p-6 ${plan.featured ? 'border-2 border-blue-600 shadow-xl scale-105' : 'border border-slate-200 shadow-sm'} relative`}>
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                Mais Popular
              </div>
            )}
            <h3 className="font-bold text-slate-900 text-lg mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-slate-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
