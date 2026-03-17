import { useState } from 'react';

const FONTS = [
  'System Default', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Poppins', 'Source Sans Pro', 'Raleway', 'Nunito', 'Ubuntu',
  'Playfair Display', 'Merriweather', 'Lora', 'Georgia', 'Times New Roman',
  'Courier New', 'JetBrains Mono',
];

interface FontSelectorProps {
  value?: string;
  onChange: (font: string) => void;
  label?: string;
}

export function FontSelector({ value = 'System Default', onChange, label }: FontSelectorProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = FONTS.filter((f) => f.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      {label && <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</label>}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg hover:border-slate-400 transition text-sm text-left"
      >
        <span style={{ fontFamily: value !== 'System Default' ? value : undefined }}>{value}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-full">
          <div className="p-2 border-b border-slate-100">
            <input
              type="text"
              placeholder="Buscar fonte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((font) => (
              <button
                key={font}
                onClick={() => { onChange(font); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition ${value === font ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                style={{ fontFamily: font !== 'System Default' ? font : undefined }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
