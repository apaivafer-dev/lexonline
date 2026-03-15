import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Page } from '@/types/page.types';
import { usePageSettings } from '@/hooks/usePageSettings';
import { SeoTab } from './tabs/SeoTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { WhatsAppTab } from './tabs/WhatsAppTab';
import { LgpdTab } from './tabs/LgpdTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';

type Tab = 'seo' | 'analytics' | 'whatsapp' | 'lgpd' | 'integrations';

const TABS: { id: Tab; label: string }[] = [
  { id: 'seo', label: 'SEO' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'lgpd', label: 'LGPD' },
  { id: 'integrations', label: 'Integrações' },
];

interface Props {
  page: Page;
  onClose: () => void;
}

export function PageSettingsModal({ page, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('seo');
  const { settings, updateSettings, saving, saveError } = usePageSettings(
    page.id,
    page.metadata ?? {},
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Configurações da Página</h2>
            <p className="text-xs text-slate-500 mt-0.5">SEO, Analytics, WhatsApp, LGPD e Integrações</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 flex-shrink-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {activeTab === 'seo' && (
            <SeoTab settings={settings} onUpdate={updateSettings} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab settings={settings} onUpdate={updateSettings} />
          )}
          {activeTab === 'whatsapp' && (
            <WhatsAppTab settings={settings} onUpdate={updateSettings} />
          )}
          {activeTab === 'lgpd' && (
            <LgpdTab settings={settings} onUpdate={updateSettings} />
          )}
          {activeTab === 'integrations' && (
            <IntegrationsTab settings={settings} onUpdate={updateSettings} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {saving && <><Loader2 size={12} className="animate-spin" /> Salvando...</>}
            {saveError && <span className="text-red-500">{saveError}</span>}
            {!saving && !saveError && <span>Alterações salvas automaticamente</span>}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
