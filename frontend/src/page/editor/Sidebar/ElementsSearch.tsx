import { Search, X } from 'lucide-react';

interface ElementsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ElementsSearch({ value, onChange }: ElementsSearchProps) {
  return (
    <div className="relative mb-3">
      <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar elementos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-8 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-2 p-0.5 hover:bg-slate-200 rounded transition"
        >
          <X size={14} className="text-slate-500" />
        </button>
      )}
    </div>
  );
}
