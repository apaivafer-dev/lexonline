import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value = '#ffffff', onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value.replace('#', ''));
  const [alpha, setAlpha] = useState(100);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleHexChange = (v: string) => {
    setHex(v);
    if (v.length === 6) {
      onChange(`#${v}`);
    }
  };

  const PRESETS = [
    '#0f172a', '#1e293b', '#475569', '#94a3b8', '#e2e8f0', '#ffffff',
    '#2563eb', '#7c3aed', '#dc2626', '#059669', '#f59e0b', '#ec4899',
  ];

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</label>}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:border-slate-400 transition w-full"
      >
        <div
          className="w-5 h-5 rounded border border-slate-300 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm text-slate-700 font-mono">#{hex.toUpperCase()}</span>
        <span className="text-xs text-slate-400 ml-auto">{alpha}%</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 w-64">
          {/* Color input */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="color"
              value={`#${hex}`}
              onChange={(e) => handleHexChange(e.target.value.replace('#', ''))}
              className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1 border border-slate-300 rounded-lg px-2 py-1">
                <span className="text-slate-400 text-sm">#</span>
                <input
                  type="text"
                  value={hex.toUpperCase()}
                  onChange={(e) => handleHexChange(e.target.value)}
                  maxLength={6}
                  className="text-sm font-mono w-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* Alpha slider */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Opacidade</span>
              <span className="text-xs text-slate-700 font-medium">{alpha}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Presets */}
          <div className="grid grid-cols-6 gap-1.5">
            {PRESETS.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className={`w-7 h-7 rounded-lg border hover:scale-110 transition ${value === color ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200'}`}
                onClick={() => { handleHexChange(color.replace('#', '')); onChange(color); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
