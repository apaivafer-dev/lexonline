import { useState, useEffect, useCallback } from 'react';
import { X, Images } from 'lucide-react';
import imageApi, { type ImageAsset, type UploadResponse } from '@/services/imageApi';
import { ImageCard } from './ImageCard';
import { ImageUploader } from '@/components/ImageUploader/ImageUploader';

interface ImageGalleryProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: ImageAsset) => void;
}

type Scope = 'current' | 'all';

export function ImageGallery({ pageId, isOpen, onClose, onSelect }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [scope, setScope] = useState<Scope>('current');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await imageApi.list(pageId, scope, page);
      setImages(res.images);
      setTotal(res.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [pageId, scope, page]);

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen, fetchImages]);

  const handleDelete = async (id: string) => {
    try {
      await imageApi.delete(pageId, id);
      setImages((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
    } catch {
      // silent
    }
  };

  const handleUploaded = (uploaded: UploadResponse[]) => {
    // Convert UploadResponse to ImageAsset shape
    const newImages: ImageAsset[] = uploaded.map((u) => ({
      id: u.id,
      filename: u.filename,
      url: u.url,
      url1200: u.url1200,
      url800: u.url800,
      urlThumb: u.urlThumb,
      width: u.width,
      height: u.height,
      sizeKB: u.sizeKB,
      createdAt: new Date().toISOString(),
    }));
    setImages((prev) => [...newImages, ...prev]);
    setTotal((t) => t + newImages.length);
    setTab('gallery');
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(total / 20);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Images size={18} className="text-slate-600" />
            <h2 className="font-semibold text-slate-900">Galeria de Imagens</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 flex-shrink-0">
          <button
            onClick={() => setTab('gallery')}
            className={`px-4 py-2 text-sm rounded-lg transition ${tab === 'gallery' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Galeria {total > 0 && <span className="ml-1 text-xs text-slate-400">({total})</span>}
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-2 text-sm rounded-lg transition ${tab === 'upload' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Upload
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {tab === 'upload' ? (
            <ImageUploader pageId={pageId} onUploaded={handleUploaded} />
          ) : (
            <>
              {/* Scope filter */}
              <div className="flex items-center gap-2 mb-4">
                {(['current', 'all'] as Scope[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setScope(s); setPage(1); }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                      scope === s
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s === 'current' ? 'Página atual' : 'Todas as páginas'}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                  Carregando...
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Images size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">Nenhuma imagem encontrada</p>
                  <button
                    onClick={() => setTab('upload')}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Fazer upload
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((img) => (
                      <ImageCard
                        key={img.id}
                        image={img}
                        onSelect={(i) => { onSelect(i); onClose(); }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
                      >
                        Anterior
                      </button>
                      <span className="text-sm text-slate-500">{page} / {totalPages}</span>
                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
