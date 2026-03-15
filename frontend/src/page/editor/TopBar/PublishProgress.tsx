import React, { useEffect } from 'react';
import { X, Check, Loader2, AlertCircle, Globe, Copy, ExternalLink } from 'lucide-react';
import { usePublish, type PublishProgress as ProgressItem } from '@/hooks/usePublish';

interface Props {
  pageId: string;
  onClose: () => void;
}

const STEP_LABELS: Record<string, string> = {
  'validating': 'Validando página',
  'generating-html': 'Gerando HTML semântico',
  'generating-css': 'Gerando CSS crítico',
  'generating-js': 'Gerando JavaScript nativo',
  'schemas': 'Adicionando JSON-LD schemas',
  'minifying': 'Minificando (<50KB)',
  'deploying': 'Enviando para CDN',
  'published': 'Publicado com sucesso!',
};

const ALL_STEPS = Object.keys(STEP_LABELS).filter((s) => s !== 'published');

export function PublishProgressModal({ pageId, onClose }: Props) {
  const { publishing, completedSteps, currentStep, publishedUrl, sizeKB, error, publish } =
    usePublish(pageId);

  useEffect(() => {
    publish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = currentStep === 'published' && !!publishedUrl;

  const copyUrl = () => {
    if (publishedUrl) navigator.clipboard.writeText(publishedUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Publicando Página</h2>
          {!publishing && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition"
            >
              <X size={18} className="text-slate-500" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Erro ao publicar</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Success */}
          {isDone && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check size={18} className="text-green-600" />
                <p className="text-sm font-semibold text-green-900">Publicado com sucesso!</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  readOnly
                  value={publishedUrl}
                  className="flex-1 px-3 py-1.5 bg-white border border-green-300 rounded-lg text-xs font-mono text-green-800 focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  title="Copiar URL"
                  className="p-1.5 hover:bg-green-100 rounded-lg transition text-green-700"
                >
                  <Copy size={14} />
                </button>
              </div>
              {sizeKB !== null && (
                <p className="text-xs text-green-700 mt-1.5">{sizeKB}KB total — PageSpeed otimizado</p>
              )}
            </div>
          )}

          {/* Steps */}
          <div className="space-y-1">
            {ALL_STEPS.map((step) => {
              const done = completedSteps.includes(step as ProgressItem['step']);
              const active = currentStep === step && !done;
              return (
                <div key={step} className="flex items-center gap-3 py-1.5">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {done ? (
                      <Check size={16} className="text-green-600" />
                    ) : active ? (
                      <Loader2 size={16} className="text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      done
                        ? 'text-slate-400'
                        : active
                        ? 'text-slate-900 font-medium'
                        : 'text-slate-300'
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {(isDone || error) && (
          <div className="flex gap-3 px-6 pb-5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition"
            >
              Fechar
            </button>
            {isDone && (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
              >
                <ExternalLink size={14} />
                Abrir Página
              </a>
            )}
            {error && (
              <button
                onClick={publish}
                disabled={publishing}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
