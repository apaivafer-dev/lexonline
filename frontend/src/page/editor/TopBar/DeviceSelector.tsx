import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { DeviceType } from '@/types/editor.types';

interface DeviceSelectorProps {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

const DEVICES = [
  { id: 'desktop' as const, label: 'Desktop (1440px)', icon: Monitor },
  { id: 'tablet' as const, label: 'Tablet (768px)', icon: Tablet },
  { id: 'mobile' as const, label: 'Mobile (375px)', icon: Smartphone },
];

export function DeviceSelector({ device, onDeviceChange }: DeviceSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
      {DEVICES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onDeviceChange(id)}
          title={label}
          className={`p-1.5 rounded-md transition ${
            device === id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
