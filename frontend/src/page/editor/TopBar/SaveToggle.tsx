import { Save } from 'lucide-react';

interface SaveToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onManualSave?: () => void;
}

export function SaveToggle({ enabled, onToggle, onManualSave }: SaveToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {!enabled && (
        <button
          onClick={onManualSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
        >
          <Save size={14} />
          Salvar
        </button>
      )}
      <label className="flex items-center gap-1.5 cursor-pointer select-none">
        <div
          onClick={() => onToggle(!enabled)}
          className={`relative w-8 h-4 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${enabled ? 'left-4' : 'left-0.5'}`} />
        </div>
        <span className="text-xs text-slate-600">Auto-save</span>
      </label>
    </div>
  );
}
