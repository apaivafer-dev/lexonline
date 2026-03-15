import React from 'react';
import { Zap, Shield, Star } from 'lucide-react';

interface Feature { title: string; description: string; icon?: string; }

interface FeaturesElementProps {
  features?: Feature[];
  columns?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

const ICONS = [Zap, Shield, Star];

export function FeaturesElement({ features = [{ title: 'Rápido', description: 'Atendimento em 24h' }, { title: 'Seguro', description: 'Confidencialidade total' }, { title: 'Eficiente', description: 'Resultados comprovados' }], columns = 3, styles, onSelect }: FeaturesElementProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16, ...styles }} onClick={onSelect}>
      {features.map(({ title, description }, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div key={i} className="text-center p-4 rounded-xl bg-slate-50">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Icon size={20} className="text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
            <p className="text-slate-500 text-xs">{description}</p>
          </div>
        );
      })}
    </div>
  );
}
