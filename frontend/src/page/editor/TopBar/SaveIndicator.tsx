import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  isSaving: boolean;
  hasError: boolean;
}

export function SaveIndicator({ isSaving, hasError }: SaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-slate-500">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-xs">Salvando...</span>
      </div>
    );
  }
  if (hasError) {
    return (
      <div className="flex items-center gap-1.5 text-red-600">
        <AlertCircle size={14} />
        <span className="text-xs">Erro ao salvar</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-green-600">
      <Check size={14} />
      <span className="text-xs">Salvo</span>
    </div>
  );
}
