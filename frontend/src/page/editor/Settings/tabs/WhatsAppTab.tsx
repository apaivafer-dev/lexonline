import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { PageSettings, WhatsAppSettings } from '@/types/page.types';

interface Props {
  settings: PageSettings;
  onUpdate: (partial: Partial<PageSettings>) => void;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

export function WhatsAppTab({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<WhatsAppSettings>({ enabled: true, position: 'bottom-right', ...settings.whatsapp });

  const set = (key: keyof WhatsAppSettings, value: unknown) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate({ whatsapp: next });
  };

  return (
    <div className="space-y-5 py-4">
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="wa-enabled"
          checked={local.enabled !== false}
          onChange={(e) => set('enabled', e.target.checked)}
        />
        <label htmlFor="wa-enabled" className="text-sm font-semibold text-slate-800">
          Ativar WhatsApp Flutuante
        </label>
      </div>

      {local.enabled !== false && (
        <>
          {/* Número */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Número de WhatsApp</label>
            <input
              type="tel"
              value={formatPhone(local.phoneNumber ?? '')}
              onChange={(e) => set('phoneNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500">Formato: (XX) 9XXXX-XXXX</p>
          </div>

          {/* Mensagem */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Mensagem Pré-definida</label>
            <textarea
              value={local.defaultMessage ?? ''}
              onChange={(e) => set('defaultMessage', e.target.value)}
              placeholder="Olá! Gostaria de mais informações..."
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-slate-500">{local.defaultMessage?.length ?? 0}/160 caracteres</p>
          </div>

          {/* Posição */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Posição do Botão</label>
            <div className="flex gap-6">
              {(['bottom-right', 'bottom-left'] as const).map((pos) => (
                <label key={pos} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wa-position"
                    value={pos}
                    checked={local.position === pos}
                    onChange={() => set('position', pos)}
                  />
                  <span className="text-sm text-slate-700">
                    {pos === 'bottom-right' ? 'Inferior Direito' : 'Inferior Esquerdo'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Visualização</label>
            <div className="relative w-full h-40 bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
                Sua página aqui
              </div>
              <div className={`absolute bottom-3 ${local.position === 'bottom-left' ? 'left-3' : 'right-3'}`}>
                <div className="bg-green-500 text-white rounded-full p-2.5 shadow-lg">
                  <MessageCircle size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
