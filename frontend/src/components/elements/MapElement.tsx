import React from 'react';
import { MapPin } from 'lucide-react';

interface MapElementProps {
  address?: string;
  height?: number;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function MapElement({ address = 'Av. Paulista, 1000, Sao Paulo, SP', height = 300, styles, onSelect }: MapElementProps) {
  return (
    <div style={{ height, borderRadius: 12, overflow: 'hidden', ...styles }} onClick={onSelect}>
      <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center">
        <MapPin size={32} className="text-blue-600 mb-2" />
        <p className="text-slate-600 text-sm font-medium text-center px-4">{address}</p>
        <p className="text-slate-400 text-xs mt-2">Configure a chave do Google Maps para exibir o mapa</p>
      </div>
    </div>
  );
}
