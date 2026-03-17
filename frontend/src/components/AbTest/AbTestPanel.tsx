import { useState } from 'react';
import { FlaskConical, Loader2 } from 'lucide-react';
import { useAbTest } from '@/hooks/useAbTest';
import type { AbTest } from '@/hooks/useAbTest';

interface Element {
  id: string;
  type: string;
  content?: string;
  styles?: Record<string, string>;
}

interface AbTestPanelProps {
  element: Element;
  pageId: string;
  onTestCreated: (test: AbTest) => void;
  onClose: () => void;
}

export function AbTestPanel({ element, pageId, onTestCreated, onClose }: AbTestPanelProps) {
  const { createTest } = useAbTest();

  const [variantBContent, setVariantBContent] = useState(element.content ?? '');
  const [variantBColor, setVariantBColor] = useState(element.styles?.['color'] ?? '#2563eb');
  const [splitA, setSplitA] = useState(50);
  const [durationDays, setDurationDays] = useState(7);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const splitB = 100 - splitA;

  const variantA = {
    content: element.content,
    styles: element.styles,
  };

  const variantB = {
    content: variantBContent,
    styles: { ...(element.styles ?? {}), color: variantBColor },
  };

  async function handleCreate() {
    setCreating(true);
    setError('');
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);

      const test = await createTest(pageId, element.id, variantA, variantB, {
        name: `Teste — ${element.type} ${element.id.slice(0, 6)}`,
        splitA,
        endDate: endDate.toISOString(),
      });
      onTestCreated(test);
      onClose();
    } catch {
      setError('Falha ao criar o teste. Tente novamente.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <FlaskConical size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-800">Criar Teste A/B</h3>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Elemento: <span className="font-medium text-slate-700">{element.type}</span>
        </p>

        {/* Variante A (read-only) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">A</span>
            <span className="text-sm font-medium text-slate-700">Variante A — Original</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 space-y-1">
            {element.content && <p>Texto: <span className="font-medium">{element.content}</span></p>}
            {element.styles?.['color'] && (
              <p className="flex items-center gap-2">
                Cor:
                <span
                  className="inline-block w-4 h-4 rounded border border-slate-300"
                  style={{ backgroundColor: element.styles['color'] }}
                />
                {element.styles['color']}
              </p>
            )}
            {!element.content && !element.styles?.['color'] && (
              <p className="text-slate-400 italic">Configuração atual do elemento</p>
            )}
          </div>
        </div>

        {/* Variante B (editável) */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">B</span>
            <span className="text-sm font-medium text-slate-700">Variante B — Para Testar</span>
          </div>
          <div className="p-3 border border-blue-200 rounded-lg space-y-3">
            {element.content !== undefined && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Texto</label>
                <input
                  value={variantBContent}
                  onChange={(e) => setVariantBContent(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {element.styles?.['color'] !== undefined && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Cor</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={variantBColor}
                    onChange={(e) => setVariantBColor(e.target.value)}
                    className="w-10 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 font-mono">{variantBColor}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Split */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Divisão de tráfego</label>
            <span className="text-xs text-slate-500">A: {splitA}% / B: {splitB}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={splitA}
            onChange={(e) => setSplitA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10% A</span>
            <span>50/50</span>
            <span>90% A</span>
          </div>
        </div>

        {/* Duração */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Duração (dias)
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {creating && <Loader2 size={14} className="animate-spin" />}
            {creating ? 'Criando...' : 'Criar Teste'}
          </button>
        </div>
      </div>
    </div>
  );
}
