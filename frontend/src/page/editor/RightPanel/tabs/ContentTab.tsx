import { useState } from 'react';
import { Images } from 'lucide-react';
import { ImageGallery } from '@/components/ImageGallery/ImageGallery';
import type { ImageAsset } from '@/services/imageApi';
import type { SelectedElement } from '@/types/editor.types';

interface ContentTabProps {
  element: SelectedElement;
  onUpdate: (data: Partial<SelectedElement>) => void;
  pageId?: string;
}

export function ContentTab({ element, onUpdate, pageId }: ContentTabProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const updateContent = (content: string) => onUpdate({ content });
  const updateStyle = (key: string, value: string) => onUpdate({ styles: { ...element.styles, [key]: value } });

  const handleImageSelect = (image: ImageAsset) => {
    onUpdate({
      styles: {
        ...element.styles,
        src: image.url,
        srcset: `${image.url1200} 1200w, ${image.url800} 800w, ${image.urlThumb} 400w`,
      },
      content: element.content || image.filename,
    });
  };

  const renderContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Nivel</label>
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
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Conteudo</label>
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
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Texto do Botao</label>
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
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Variacao</label>
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
            {/* Image preview */}
            {element.styles.src && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={element.styles.src}
                  alt={element.content || 'Preview'}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            {/* Gallery button */}
            {pageId && (
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Images size={16} />
                {element.styles.src ? 'Trocar Imagem' : 'Escolher da Galeria'}
              </button>
            )}

            {/* URL manual input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">URL da Imagem</label>
              <input
                type="text"
                placeholder="https://..."
                value={element.styles.src ?? ''}
                onChange={(e) => updateStyle('src', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Texto Alternativo</label>
              <input
                type="text"
                placeholder="Descricao da imagem"
                value={element.content ?? ''}
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
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">URL do Video</label>
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
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Conteudo</label>
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

      {/* Image Gallery Modal */}
      {pageId && (
        <ImageGallery
          pageId={pageId}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          onSelect={handleImageSelect}
        />
      )}
    </div>
  );
}
