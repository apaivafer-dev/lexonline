import React from 'react';
import { Check } from 'lucide-react';

interface PricingElementProps {
  name?: string;
  price?: string;
  period?: string;
  features?: string[];
  featured?: boolean;
  ctaText?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function PricingElement({ name = 'Plano Essencial', price = 'R$ 1.990', period = '/consulta', features = ['Consultoria inicial', 'Análise de caso', 'Recomendações'], featured = false, ctaText = 'Contratar', styles, onSelect }: PricingElementProps) {
  return (
    <div style={{ border: featured ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: 16, padding: 24, ...styles }} onClick={onSelect}>
      <h3 className="font-bold text-slate-900 mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold text-slate-900">{price}</span>
        <span className="text-slate-500 text-sm">{period}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
            <Check size={14} className="text-green-500" /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-2.5 rounded-lg font-semibold text-sm ${featured ? 'bg-blue-600 text-white' : 'border-2 border-blue-600 text-blue-600'}`}>
        {ctaText}
      </button>
    </div>
  );
}
