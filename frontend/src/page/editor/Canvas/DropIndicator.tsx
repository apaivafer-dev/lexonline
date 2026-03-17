import { Plus } from 'lucide-react';

interface DropIndicatorProps {
  isActive: boolean;
  position?: 'top' | 'bottom' | 'inside';
  label?: string;
}

export function DropIndicator({ isActive, position = 'bottom', label = 'Solte aqui' }: DropIndicatorProps) {
  if (!isActive) return null;

  if (position === 'inside') {
    return (
      <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-50/30 rounded-lg z-20 pointer-events-none flex items-center justify-center">
        <div className="flex items-center gap-2 bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow">
          <Plus size={12} />
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute left-0 right-0 z-20 pointer-events-none flex items-center gap-2 ${
        position === 'top' ? 'top-0 -translate-y-1/2' : 'bottom-0 translate-y-1/2'
      }`}
    >
      <div className="flex-1 h-0.5 bg-blue-500 rounded-full" />
      <div className="flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
        <Plus size={10} />
        <span>{label}</span>
      </div>
      <div className="flex-1 h-0.5 bg-blue-500 rounded-full" />
    </div>
  );
}
