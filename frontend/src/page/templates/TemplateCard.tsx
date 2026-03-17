import { useState } from 'react';
import type { PageTemplate } from '@/types/page.types';

interface TemplateCardProps {
  template: PageTemplate;
  onPreview: (template: PageTemplate) => void;
  onUse: (template: PageTemplate) => void;
}

export function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovering ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div
            className={`w-full h-full transition-transform duration-300 ${
              isHovering ? 'scale-110' : 'scale-100'
            } bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center`}
          >
            <span className="text-slate-400 text-xs">{template.category}</span>
          </div>
        )}

        {template.is_premium && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Premium
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm">{template.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>

        {isHovering && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onPreview(template)}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              👁 Preview
            </button>
            <button
              onClick={() => onUse(template)}
              className="flex-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              ✓ Usar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
