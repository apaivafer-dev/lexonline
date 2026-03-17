import { useState } from 'react';
import { Globe } from 'lucide-react';
import type { Page } from '@/types/page.types';

interface PublishButtonProps {
  page: Page | null;
  isDirty: boolean;
  onPublish: () => Promise<void>;
}

export function PublishButton({ page, isDirty, onPublish }: PublishButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!page) return null;

  const isPublished = page.status === 'published';

  const handleClick = () => {
    if (isDirty) { setShowModal(true); return; }
    handlePublish();
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPublishing}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-50 ${
          isPublished
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Globe size={16} />
        {isPublished ? 'Publicada' : 'Publicar'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-bold mb-2">Alterações não salvas</h2>
            <p className="text-slate-600 text-sm mb-6">
              Você tem alterações não salvas. Deseja salvar e publicar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isPublishing ? 'Publicando...' : 'Salvar e Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
