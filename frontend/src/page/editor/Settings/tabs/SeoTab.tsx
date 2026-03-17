import { useState, KeyboardEvent } from 'react';
import { Zap, X, Loader2 } from 'lucide-react';
import type { PageSettings, SeoSettings } from '@/types/page.types';
import { useSeoValidation } from '@/hooks/useSeoValidation';

interface Props {
  settings: PageSettings;
  onUpdate: (partial: Partial<PageSettings>) => void;
}

function statusColor(status: 'good' | 'warning' | 'error') {
  if (status === 'good') return 'bg-green-100 text-green-700';
  if (status === 'warning') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function statusMsg(status: 'good' | 'warning' | 'error', field: 'title' | 'desc') {
  if (status === 'good') return '✓ Comprimento ideal';
  if (field === 'title') return status === 'warning' ? '⚠ Ideal: 30–60 caracteres' : '✗ Preencha o título';
  return status === 'warning' ? '⚠ Ideal: 120–160 caracteres' : '✗ Preencha a descrição';
}

export function SeoTab({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<SeoSettings>(settings.seo ?? {});
  const [tagInput, setTagInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { validateSeo } = useSeoValidation();

  const validation = validateSeo(local);

  const set = (key: keyof SeoSettings, value: unknown) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate({ seo: next });
  };

  const addKeyword = () => {
    const kw = tagInput.trim();
    if (!kw) return;
    const next = [...(local.keywords ?? []), kw];
    set('keywords', next);
    setTagInput('');
  };

  const removeKeyword = (i: number) => {
    const next = (local.keywords ?? []).filter((_, idx) => idx !== i);
    set('keywords', next);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: local.keywords }),
      });
      const data = await res.json();
      const next = { ...local, title: data.title ?? local.title, metaDescription: data.description ?? local.metaDescription };
      setLocal(next);
      onUpdate({ seo: next });
    } catch {
      // silently ignore — AI endpoint not available yet
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5 py-4">
      {/* Meta Title */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Título (Meta Title)</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={60}
            value={local.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Máx 60 caracteres"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor(validation.titleLength)}`}>
            {local.title?.length ?? 0}/60
          </span>
        </div>
        <p className="text-xs text-slate-500">{statusMsg(validation.titleLength, 'title')}</p>
      </div>

      {/* Meta Description */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Meta Description</label>
        <div className="flex items-start gap-2">
          <textarea
            maxLength={160}
            rows={3}
            value={local.metaDescription ?? ''}
            onChange={(e) => set('metaDescription', e.target.value)}
            placeholder="Máx 160 caracteres"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <span className={`text-xs font-medium px-2 py-1 rounded mt-1 ${statusColor(validation.descriptionLength)}`}>
            {local.metaDescription?.length ?? 0}/160
          </span>
        </div>
        <p className="text-xs text-slate-500">{statusMsg(validation.descriptionLength, 'desc')}</p>
      </div>

      {/* OG Image */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">OG Image (ao compartilhar)</label>
        <input
          type="text"
          value={local.ogImage ?? ''}
          onChange={(e) => set('ogImage', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {local.ogImage && (
          <img src={local.ogImage} alt="OG Preview" className="max-w-xs h-auto rounded-lg mt-1 border" />
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Slug (URL)</label>
        <input
          type="text"
          value={local.slug ?? ''}
          onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="minha-pagina"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-500">
          URL: <strong>lexonline.com/{local.slug || 'minha-pagina'}</strong>
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Palavras-chave</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Digite e pressione Enter"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addKeyword}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-sm transition"
          >
            Adicionar
          </button>
        </div>
        {(local.keywords ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(local.keywords ?? []).map((kw, i) => (
              <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs">
                {kw}
                <button onClick={() => removeKeyword(i)} className="hover:text-blue-900">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Indexação */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="seo-indexable"
          checked={local.indexable !== false}
          onChange={(e) => set('indexable', e.target.checked)}
          className="mt-0.5"
        />
        <label htmlFor="seo-indexable" className="text-sm text-slate-700">
          Permitir indexação no Google
          <p className="text-xs text-slate-500 font-normal">Desmarque para adicionar meta robots: noindex</p>
        </label>
      </div>

      {/* AI Button */}
      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={handleAiGenerate}
          disabled={aiLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-60 transition"
        >
          {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          {aiLoading ? 'Gerando SEO com IA...' : 'Gerar SEO com LexOnline AI'}
        </button>
        <p className="text-xs text-slate-500 mt-1.5 text-center">
          Gera título, descrição e palavras-chave otimizados
        </p>
      </div>
    </div>
  );
}
