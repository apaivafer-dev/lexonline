import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CreatePageInput } from '@/types/page.types';

interface CreatePageModalProps {
  onClose: () => void;
  onCreatePage: (data: CreatePageInput) => Promise<{ id: string }>;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function CreatePageModal({ onClose, onCreatePage }: CreatePageModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (!slug || slug === titleToSlug(title)) {
      setSlug(titleToSlug(value));
      setSlugError('');
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(value);
    setSlugError(SLUG_PATTERN.test(value) ? '' : 'Use apenas letras, números e hífens');
  };

  const handleNext = () => {
    if (!title.trim()) { setSlugError('Título é obrigatório'); return; }
    if (!SLUG_PATTERN.test(slug)) { setSlugError('Slug inválido — use apenas letras, números e hífens'); return; }
    setStep(2);
  };

  const handleCreate = async (templateId?: string) => {
    console.log('[CreatePageModal] handleCreate chamado, title:', title, 'slug:', slug);
    setIsLoading(true);
    try {
      const result = await onCreatePage({ title, slug, template_id: templateId });
      console.log('[CreatePageModal] onCreatePage retornou:', result);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Erro ao criar página. Tente novamente.';
      setSlugError(msg);
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[420px] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Nova Página</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Título da Página
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Ex: Homepage Consultoria"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  URL (Slug)
                </label>
                <input
                  type="text"
                  placeholder="homepage-consultoria"
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  URL pública:{' '}
                  <span className="text-slate-700">
                    https://seusite.com/<strong>{slug || 'slug'}</strong>
                  </span>
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Próximo <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-4 font-medium">Como deseja começar?</p>

              <button
                onClick={() => handleCreate()}
                disabled={isLoading}
                className="w-full border-2 border-slate-200 p-4 rounded-lg text-left hover:border-slate-300 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <div className="font-semibold text-slate-900">Página em Branco</div>
                <div className="text-xs text-slate-500 mt-0.5">Crie do zero, total liberdade</div>
              </button>

              <button
                onClick={() => { onClose(); navigate('/page/templates', { state: { title, slug } }); }}
                className="w-full border-2 border-blue-200 bg-blue-50 p-4 rounded-lg text-left hover:border-blue-300 transition"
              >
                <div className="font-semibold text-blue-900">Escolher Template</div>
                <div className="text-xs text-blue-600 mt-0.5">15 modelos prontos para advogados</div>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 py-2 justify-center transition"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
