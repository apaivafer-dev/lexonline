import { useState } from 'react';
import type { PageSettings, LgpdSettings } from '@/types/page.types';

interface Props {
  settings: PageSettings;
  onUpdate: (partial: Partial<PageSettings>) => void;
}

const DEFAULT_TEXT = 'Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa Política de Privacidade.';

export function LgpdTab({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<LgpdSettings>({
    enabled: true,
    position: 'bottom',
    consentType: 'opt-in',
    backgroundColor: '#1f2937',
    text: DEFAULT_TEXT,
    ...settings.lgpd,
  });

  const set = (key: keyof LgpdSettings, value: unknown) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate({ lgpd: next });
  };

  return (
    <div className="space-y-5 py-4">
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lgpd-enabled"
          checked={local.enabled !== false}
          onChange={(e) => set('enabled', e.target.checked)}
        />
        <label htmlFor="lgpd-enabled" className="text-sm font-semibold text-slate-800">
          Exibir Aviso de Privacidade (LGPD)
        </label>
      </div>

      {local.enabled !== false && (
        <>
          {/* Texto */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Texto do Aviso</label>
            <textarea
              value={local.text ?? ''}
              onChange={(e) => set('text', e.target.value)}
              placeholder={DEFAULT_TEXT}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Cor de fundo */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Cor de Fundo</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={local.backgroundColor ?? '#1f2937'}
                onChange={(e) => set('backgroundColor', e.target.value)}
                className="h-9 w-16 rounded cursor-pointer border border-slate-300"
              />
              <span className="text-sm text-slate-600 font-mono">{local.backgroundColor ?? '#1f2937'}</span>
            </div>
          </div>

          {/* Posição */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Posição</label>
            <select
              value={local.position ?? 'bottom'}
              onChange={(e) => set('position', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom">Inferior</option>
              <option value="top">Superior</option>
              <option value="modal">Modal (Centro)</option>
            </select>
          </div>

          {/* Link política */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Link Política de Privacidade</label>
            <input
              type="text"
              value={local.privacyLink ?? ''}
              onChange={(e) => set('privacyLink', e.target.value)}
              placeholder="https://seu-site.com/privacidade"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Consentimento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Tipo de Consentimento</label>
            <div className="flex gap-6">
              {(['opt-in', 'opt-out'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lgpd-consent"
                    value={type}
                    checked={local.consentType === type}
                    onChange={() => set('consentType', type)}
                  />
                  <span className="text-sm text-slate-700">
                    {type === 'opt-in' ? 'Opt-in (Aceitar ativamente)' : 'Opt-out (Rejeitar)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Visualização</label>
            <div
              style={{ backgroundColor: local.backgroundColor ?? '#1f2937' }}
              className="text-white p-4 rounded-lg text-sm"
            >
              <p>{local.text || DEFAULT_TEXT}</p>
              {local.privacyLink && (
                <a className="underline text-blue-300 text-xs mt-1 inline-block" href="#">
                  Política de Privacidade
                </a>
              )}
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-1 bg-white text-slate-900 rounded text-xs font-medium hover:bg-slate-100 transition">
                  Aceitar
                </button>
                <button className="px-4 py-1 border border-white text-white rounded text-xs hover:bg-white/10 transition">
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
