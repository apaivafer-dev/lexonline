import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { PageSettings, IntegrationsSettings, CrmSettings } from '@/types/page.types';

interface Props {
  settings: PageSettings;
  onUpdate: (partial: Partial<PageSettings>) => void;
}

type CrmKey = 'rdstation' | 'activecampaign' | 'hubspot' | 'leadlovers';

const CRM_OPTIONS: { value: CrmKey; label: string }[] = [
  { value: 'rdstation', label: 'RD Station' },
  { value: 'activecampaign', label: 'ActiveCampaign' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'leadlovers', label: 'LeadLovers' },
];

const WEBHOOK_PAYLOAD = `{
  "formData": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321"
  },
  "pageId": "page_123",
  "timestamp": "2024-03-12T10:30:00Z"
}`;

export function IntegrationsTab({ settings, onUpdate }: Props) {
  const [local, setLocal] = useState<IntegrationsSettings>(settings.integrations ?? {});
  const [crmType, setCrmType] = useState<CrmKey>('rdstation');
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState(false);

  const setCrm = (crm: CrmKey, data: Partial<CrmSettings>) => {
    const next: IntegrationsSettings = { ...local, [crm]: { ...(local[crm] ?? {}), ...data } };
    setLocal(next);
    onUpdate({ integrations: next });
  };

  const setWebhook = (url: string) => {
    const next: IntegrationsSettings = { ...local, webhookUrl: url };
    setLocal(next);
    onUpdate({ integrations: next });
  };

  const handleTest = async () => {
    setTesting(true);
    setTestOk(false);
    try {
      await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crm: crmType, apiKey: local[crmType]?.apiKey }),
      });
      setTestOk(true);
    } catch {
      // silently ignore
    } finally {
      setTesting(false);
    }
  };

  const currentCrm = local[crmType] ?? {};

  return (
    <div className="space-y-5 py-4">
      {/* CRM selector */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Selecionar CRM</label>
        <select
          value={crmType}
          onChange={(e) => setCrmType(e.target.value as CrmKey)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CRM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* API Key */}
      <div className="space-y-1.5 p-4 border border-slate-200 rounded-lg">
        <label className="block text-sm font-medium text-slate-700">API Key</label>
        <input
          type="password"
          value={currentCrm.apiKey ?? ''}
          onChange={(e) => setCrm(crmType, { apiKey: e.target.value })}
          placeholder="Cole sua chave de API"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-500">
          Encontre nas configurações de API do {CRM_OPTIONS.find((o) => o.value === crmType)?.label}
        </p>
      </div>

      {/* Lista/Tag */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Lista ou Tag de Destino</label>
        <input
          type="text"
          value={currentCrm.listId ?? ''}
          onChange={(e) => setCrm(crmType, { listId: e.target.value })}
          placeholder="ID da lista ou tag"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Webhook */}
      <div className="space-y-2 p-4 border border-slate-200 rounded-lg bg-blue-50">
        <label className="block text-sm font-medium text-slate-700">Webhook URL</label>
        <input
          type="text"
          value={local.webhookUrl ?? ''}
          onChange={(e) => setWebhook(e.target.value)}
          placeholder="https://seu-servidor.com/webhook"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="p-3 bg-white border border-slate-200 rounded-lg mt-2">
          <p className="text-xs font-medium text-slate-600 mb-1.5">Payload enviado ao receber lead:</p>
          <pre className="text-xs text-slate-500 overflow-x-auto">{WEBHOOK_PAYLOAD}</pre>
        </div>
      </div>

      {/* Testar */}
      <button
        onClick={handleTest}
        disabled={testing}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
      >
        {testing ? <Loader2 size={14} className="animate-spin" /> : testOk ? <CheckCircle size={14} className="text-green-600" /> : null}
        {testing ? 'Testando...' : testOk ? 'Integração OK!' : 'Testar Integração'}
      </button>
    </div>
  );
}
