import React from 'react';
import type { SelectedElement } from '@/types/editor.types';

interface ContentTabProps {
  element: SelectedElement;
  onUpdate: (data: Partial<SelectedElement>) => void;
}

export function ContentTab({ element, onUpdate }: ContentTabProps) {
  const updateContent = (content: string) => onUpdate({ content });
  const updateStyle = (key: string, value: string) => onUpdate({ styles: { ...element.styles, [key]: value } });

  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Nível</label>
              <select
                defaultValue="1"
                onChange={(e) => updateStyle('tag', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((h) => (
                  <option key={h} value={h.toLowerCase()}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Texto</label>
              <input
                type="text"
                defaultValue={element.content ?? ''}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Conteúdo</label>
            <textarea
              defaultValue={element.content ?? ''}
              rows={5}
              onChange={(e) => updateContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Texto do Botão</label>
              <input
                type="text"
                defaultValue={element.content ?? 'Clique Aqui'}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Link</label>
              <input
                type="text"
                placeholder="https://..."
                defaultValue={element.styles.href ?? ''}
                onChange={(e) => updateStyle('href', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Variação</label>
              <select
                onChange={(e) => updateStyle('variant', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="filled">Preenchido</option>
                <option value="outline">Contorno</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">URL da Imagem</label>
              <input
                type="text"
                placeholder="https://..."
                defaultValue={element.styles.src ?? ''}
                onChange={(e) => updateStyle('src', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Texto Alternativo</label>
              <input
                type="text"
                placeholder="Descrição da imagem"
                defaultValue={element.content ?? ''}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">URL do Vídeo</label>
              <input
                type="text"
                placeholder="YouTube, Vimeo..."
                defaultValue={element.styles.videoUrl ?? ''}
                onChange={(e) => updateStyle('videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Suporta YouTube e Vimeo</p>
            </div>
          </div>
        );

      case 'input':
      case 'textarea':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Label</label>
              <input
                type="text"
                defaultValue={element.content ?? ''}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Placeholder</label>
              <input
                type="text"
                defaultValue={element.styles.placeholder ?? ''}
                onChange={(e) => updateStyle('placeholder', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Conteúdo</label>
              <textarea
                defaultValue={element.content ?? ''}
                rows={4}
                onChange={(e) => updateContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Tipo de Elemento</label>
        <p className="text-sm font-semibold text-blue-600">{element.type}</p>
      </div>
      {renderContent()}
    </div>
  );
}
