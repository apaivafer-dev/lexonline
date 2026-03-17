import { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import type { PageTemplate } from '@/types/page.types';

interface TemplatePreviewProps {
  template: PageTemplate;
  onClose: () => void;
  onUse: (template: PageTemplate) => void;
}

export function TemplatePreview({ template, onClose, onUse }: TemplatePreviewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white z-10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
          Voltar aos templates
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{template.title}</span>
          <button
            onClick={() => onUse(template)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Usar este template
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition"
        >
          <X size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-100 flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-5xl min-h-full rounded-lg shadow-lg">
          {template.preview_url ? (
            <iframe
              src={template.preview_url}
              className="w-full h-full min-h-screen rounded-lg"
              title={template.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500">
              <p className="text-lg font-medium">Preview não disponível</p>
              <p className="text-sm mt-1">Este template não tem preview configurado.</p>
              <button
                onClick={() => onUse(template)}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Usar mesmo assim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
