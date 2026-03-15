import React, { useState } from 'react';

const ANIMATIONS = [
  { id: 'none', label: 'Nenhuma' },
  { id: 'fadeIn', label: 'Fade In' },
  { id: 'fadeInUp', label: 'Fade In ↑' },
  { id: 'fadeInDown', label: 'Fade In ↓' },
  { id: 'fadeInLeft', label: 'Fade In ←' },
  { id: 'fadeInRight', label: 'Fade In →' },
  { id: 'slideInUp', label: 'Slide ↑' },
  { id: 'slideInLeft', label: 'Slide ←' },
  { id: 'slideInRight', label: 'Slide →' },
  { id: 'zoomIn', label: 'Zoom In' },
  { id: 'zoomOut', label: 'Zoom Out' },
  { id: 'bounceIn', label: 'Bounce In' },
  { id: 'rotateIn', label: 'Rotate In' },
  { id: 'flipInX', label: 'Flip X' },
  { id: 'flipInY', label: 'Flip Y' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'shake', label: 'Shake' },
];

interface AnimSelectorProps {
  value?: string;
  onChange: (anim: string) => void;
  label?: string;
}

export function AnimSelector({ value = 'none', onChange, label }: AnimSelectorProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const selected = ANIMATIONS.find((a) => a.id === value) ?? ANIMATIONS[0];

  return (
    <div>
      {label && <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {ANIMATIONS.map((anim) => (
          <option key={anim.id} value={anim.id}>{anim.label}</option>
        ))}
      </select>

      {value !== 'none' && (
        <div className="mt-2 flex items-center gap-2">
          <div className="text-xs text-slate-500">Preview:</div>
          <div
            key={preview}
            className="w-8 h-8 bg-blue-600 rounded-lg"
            style={{
              animation: preview ? `${preview} 0.6s ease both` : undefined,
            }}
          />
          <button
            onClick={() => setPreview(value + '-' + Date.now())}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
          >
            ▶ Ver
          </button>
        </div>
      )}
    </div>
  );
}
