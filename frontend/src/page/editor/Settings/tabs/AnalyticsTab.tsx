import React, { useState } from 'react';
import { Info } from 'lucide-react';
import type { PageSettings, AnalyticsSettings } from '@/types/page.types';

interface Props {
  settings: PageSettings;
  onUpdate: (partial: Partial<PageSettings>) => void;
}

interface FieldConfig {
  key: keyof AnalyticsSettings;
  label: string;
  placeholder: string;
  hint?: string;
}

const FIELDS: FieldConfig[] = [
  { key: 'ga4Id', label: 'Google Analytics 4 (GA4)', placeholder: 'G-XXXXXXXXXX', hint: 'Measurement ID do seu projeto GA4' },
  { key: 'gtmId', label: 'Google Tag Manager (GTM)', placeholder: 'GTM-XXXXXXXX', hint: 'Container ID do seu GTM' },
  { key: 'metaPixelId', label: 'Meta Pixel (Facebook Ads)', placeholder: 'Seu Pixel ID' },
  { key: 'googleAdsId', label: 'Google Ads Conversion ID', placeholder: 'AW-XXXXXXXXXX' },
  { key: 'hotjarId', label: 'Hotjar Site ID', placeholder: 'Seu Site ID', hint: 'Para análise de comportamento e heatmaps' },
];

export function AnalyticsTab({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<AnalyticsSettings>(settings.analytics ?? {});

  const set = (key: keyof AnalyticsSettings, value: string | boolean) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate({ analytics: next });
  };

  return (
    <div className="space-y-4 py-4">
      {FIELDS.map(({ key, label, placeholder, hint }) => (
        <div key={key} className="space-y-1.5 p-4 border border-slate-200 rounded-lg">
          <label className="block text-sm font-medium text-slate-700">{label}</label>
          <input
            type="text"
            placeholder={placeholder}
            value={(local[key] as string) ?? ''}
            onChange={(e) => set(key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hint && <p className="text-xs text-slate-500">{hint}</p>}

          {/* Meta Pixel: rastrear PageView */}
          {key === 'metaPixelId' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="meta-pixel-pageview"
                checked={local.metaPixelPageView !== false}
                onChange={(e) => set('metaPixelPageView', e.target.checked)}
              />
              <label htmlFor="meta-pixel-pageview" className="text-xs text-slate-600">
                Rastrear PageView automaticamente
              </label>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">
          Todos os scripts serão injetados no &lt;head&gt; ao publicar a página.
        </p>
      </div>
    </div>
  );
}
