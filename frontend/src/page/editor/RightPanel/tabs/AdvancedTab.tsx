import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { SliderInput } from '../controls/SliderInput';
import type { SelectedElement } from '@/types/editor.types';

interface AdvancedTabProps {
  element: SelectedElement;
  onUpdate: (data: Partial<SelectedElement>) => void;
}

const ANIMATIONS_IN = [
  { id: 'none', label: 'Nenhuma' },
  { id: 'fadeIn', label: 'Fade In' },
  { id: 'slideInUp', label: 'Slide ↑' },
  { id: 'slideInLeft', label: 'Slide ←' },
  { id: 'slideInRight', label: 'Slide →' },
  { id: 'zoomIn', label: 'Zoom In' },
  { id: 'bounceIn', label: 'Bounce In' },
  { id: 'rotateIn', label: 'Rotate In' },
];

export function AdvancedTab({ element, onUpdate }: AdvancedTabProps) {
  const updateStyle = (key: string, value: string) =>
    onUpdate({ styles: { ...element.styles, [key]: value } });

  const visibilityDesktop = element.styles.hideDesktop !== 'true';
  const visibilityTablet = element.styles.hideTablet !== 'true';
  const visibilityMobile = element.styles.hideMobile !== 'true';

  return (
    <div className="p-4 space-y-6">
      {/* Visibility */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Visibilidade por Dispositivo</label>
        <div className="flex gap-2">
          {[
            { Icon: Monitor, label: 'Desktop', key: 'hideDesktop', visible: visibilityDesktop },
            { Icon: Tablet, label: 'Tablet', key: 'hideTablet', visible: visibilityTablet },
            { Icon: Smartphone, label: 'Mobile', key: 'hideMobile', visible: visibilityMobile },
          ].map(({ Icon, label, key, visible }) => (
            <button
              key={key}
              onClick={() => updateStyle(key, visible ? 'true' : 'false')}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition ${
                visible
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation In */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Animação de Entrada</label>
        <select
          value={element.styles.animationIn ?? 'none'}
          onChange={(e) => updateStyle('animationIn', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-3"
        >
          {ANIMATIONS_IN.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>

        {element.styles.animationIn && element.styles.animationIn !== 'none' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Velocidade</label>
              <select
                value={element.styles.animationSpeed ?? '0.6s'}
                onChange={(e) => updateStyle('animationSpeed', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none bg-white"
              >
                <option value="0.3s">Rápido (0.3s)</option>
                <option value="0.6s">Normal (0.6s)</option>
                <option value="1s">Lento (1s)</option>
                <option value="1.5s">Muito lento (1.5s)</option>
              </select>
            </div>
            <SliderInput
              label="Atraso (s)"
              value={parseFloat(element.styles.animationDelay ?? '0')}
              onChange={(v) => updateStyle('animationDelay', `${v}s`)}
              min={0}
              max={5}
              step={0.1}
              unit="s"
            />
          </div>
        )}
      </div>

      {/* Custom ID and Classes */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">ID CSS</label>
          <input
            type="text"
            defaultValue={element.styles.customId ?? ''}
            placeholder="meu-elemento-unico"
            onChange={(e) => updateStyle('customId', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Classes CSS Adicionais</label>
          <textarea
            defaultValue={element.styles.customClasses ?? ''}
            placeholder="classe-1 classe-2"
            rows={2}
            onChange={(e) => updateStyle('customClasses', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
        </div>
      </div>

      {/* Element ID (read-only) */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">ID do Elemento (interno)</label>
        <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1.5 rounded">{element.id}</p>
      </div>
    </div>
  );
}
