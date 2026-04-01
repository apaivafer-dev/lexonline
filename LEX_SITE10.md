# LEX_SITE10 — Fase 5: SEO + Analytics + WhatsApp + LGPD

## Objetivo
Painel completo de configurações da página com SEO, analytics, WhatsApp flutuante e conformidade LGPD.

## Dependência
- Fase 3e (Histórico + Auto-save + Preview)

## Estrutura de Arquivos

### Components
- `components/Settings/PageSettings.tsx` - Modal principal com 5 abas
- `components/Settings/tabs/SeoTab.tsx` - SEO otimização
- `components/Settings/tabs/AnalyticsTab.tsx` - Google Analytics, GTM, Meta Pixel, etc
- `components/Settings/tabs/WhatsAppTab.tsx` - Configuração WhatsApp flutuante
- `components/Settings/tabs/LgpdTab.tsx` - Conformidade LGPD
- `components/Settings/tabs/IntegrationsTab.tsx` - CRM e Webhook

### Hooks
- `hooks/usePageSettings.ts` - State gerenciamento de settings
- `hooks/useSeoValidation.ts` - Validação de SEO
- `hooks/useAnalyticsInjection.ts` - Injeção de scripts no head

## Implementação Detalhada

### PageSettings.tsx - Modal Principal

```typescript
const PageSettings = ({ isOpen, onClose, pageId }: Props) => {
  const [activeTab, setActiveTab] = useState<'seo' | 'analytics' | 'whatsapp' | 'lgpd' | 'integrations'>('seo');
  const { settings, updateSettings, saving } = usePageSettings(pageId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações da Página</DialogTitle>
          <DialogDescription>
            SEO, Analytics, WhatsApp, LGPD e Integrações
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab as any}>
          <TabsList className="w-full">
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="lgpd">LGPD</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="seo">
            <SeoTab settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppTab settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          <TabsContent value="lgpd">
            <LgpdTab settings={settings} onUpdate={updateSettings} />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab settings={settings} onUpdate={updateSettings} />
          </TabsContent>
        </Tabs>

        {/* Status saving */}
        {saving && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Spinner size={16} /> Salvando...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Botão engrenagem na TopBar
const TopBar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
      {/* ... outros conteúdos ... */}
      <Button
        onClick={() => setSettingsOpen(true)}
        title="Configurações"
        size="sm"
        variant="ghost"
      >
        <Settings size={20} />
      </Button>

      <PageSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};
```

### SeoTab.tsx

```typescript
const SeoTab = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState(settings.seo || {});
  const [aiGenerating, setAiGenerating] = useState(false);
  const { validateSeo } = useSeoValidation();

  const seoValidation = validateSeo(localSettings);

  const handleInputChange = (key: keyof SeoSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdate({ seo: { ...localSettings, [key]: value } });
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageContent: localSettings.content,
          keywords: localSettings.keywords,
        }),
      });

      const data = await response.json();
      setLocalSettings(prev => ({
        ...prev,
        title: data.title,
        metaDescription: data.description,
      }));

      onUpdate({ seo: { ...localSettings, ...data } });
    } catch (error) {
      console.error('AI SEO error:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Título */}
      <div className="space-y-2">
        <Label>Título (Meta Title)</Label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={60}
            value={localSettings.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Máx 60 caracteres"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <span className={`text-sm font-medium px-2 py-1 rounded
            ${seoValidation.titleLength === 'good' ? 'bg-green-100 text-green-700' : ''}
            ${seoValidation.titleLength === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${seoValidation.titleLength === 'error' ? 'bg-red-100 text-red-700' : ''}
          `}>
            {localSettings.title?.length || 0}/60
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {seoValidation.titleLength === 'good' && '✓ Comprimento ideal'}
          {seoValidation.titleLength === 'warning' && '⚠ Poderia ser ajustado'}
          {seoValidation.titleLength === 'error' && '✗ Muito longo ou muito curto'}
        </p>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label>Meta Description</Label>
        <div className="flex items-center gap-2">
          <textarea
            maxLength={160}
            value={localSettings.metaDescription || ''}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Máx 160 caracteres"
            rows={3}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <span className={`text-sm font-medium px-2 py-1 rounded
            ${seoValidation.descriptionLength === 'good' ? 'bg-green-100 text-green-700' : ''}
            ${seoValidation.descriptionLength === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${seoValidation.descriptionLength === 'error' ? 'bg-red-100 text-red-700' : ''}
          `}>
            {localSettings.metaDescription?.length || 0}/160
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {seoValidation.descriptionLength === 'good' && '✓ Comprimento ideal'}
          {seoValidation.descriptionLength === 'warning' && '⚠ Poderia ser ajustado'}
          {seoValidation.descriptionLength === 'error' && '✗ Muito longo ou muito curto'}
        </p>
      </div>

      {/* OG Image */}
      <div className="space-y-2">
        <Label>OG Image (Imagem ao compartilhar)</Label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={localSettings.ogImage || ''}
            onChange={(e) => handleInputChange('ogImage', e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <Button size="sm" variant="outline">
            Upload
          </Button>
        </div>
        {localSettings.ogImage && (
          <img
            src={localSettings.ogImage}
            alt="OG Preview"
            className="max-w-xs h-auto rounded-lg"
          />
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label>Slug (URL)</Label>
        <div className="space-y-1">
          <input
            type="text"
            value={localSettings.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="minha-pagina"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <p className="text-xs text-gray-600">
            Visualização: <strong>lexonline.com/{localSettings.slug || 'minha-pagina'}</strong>
          </p>
        </div>
      </div>

      {/* Palavras-chave */}
      <div className="space-y-2">
        <Label>Palavras-chave (Tags)</Label>
        <TagInput
          value={localSettings.keywords || []}
          onChange={(keywords) => handleInputChange('keywords', keywords as any)}
          placeholder="Digite uma palavra-chave e pressione Enter"
        />
      </div>

      {/* Indexar no Google */}
      <div className="space-y-2">
        <Label>Indexação</Label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="indexable"
            checked={localSettings.indexable !== false}
            onChange={(e) => handleInputChange('indexable', e.target.checked ? 'true' : 'false')}
          />
          <label htmlFor="indexable" className="text-sm">
            Permitir indexação no Google
            <p className="text-xs text-gray-500">Desmarque para adicionar meta robots: noindex</p>
          </label>
        </div>
      </div>

      {/* AI SEO Button */}
      <div className="pt-4 border-t">
        <Button
          onClick={handleAiGenerate}
          disabled={aiGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {aiGenerating ? (
            <>
              <Spinner size={16} className="mr-2" /> Gerando SEO com IA...
            </>
          ) : (
            <>
              <Zap size={16} className="mr-2" /> Gerar SEO com LexOnline AI
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Usa IA para gerar título, descrição e palavras-chave otimizados
        </p>
      </div>
    </div>
  );
};

// useSeoValidation Hook
const useSeoValidation = () => {
  const validateSeo = (settings: SeoSettings) => {
    const titleLength = !settings.title || settings.title.length < 30
      ? 'error'
      : settings.title.length > 60
      ? 'error'
      : 'good';

    const descriptionLength = !settings.metaDescription || settings.metaDescription.length < 120
      ? 'error'
      : settings.metaDescription.length > 160
      ? 'error'
      : 'good';

    return { titleLength, descriptionLength };
  };

  return { validateSeo };
};
```

### AnalyticsTab.tsx

```typescript
const AnalyticsTab = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState(settings.analytics || {});

  const handleUpdate = (key: string, value: string | boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdate({ analytics: { ...localSettings, [key]: value } });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Google Analytics 4 */}
      <div className="space-y-2 p-4 border rounded-lg">
        <Label>Google Analytics 4 (GA4)</Label>
        <input
          type="text"
          placeholder="G-XXXXXXXXXX"
          value={localSettings.ga4Id || ''}
          onChange={(e) => handleUpdate('ga4Id', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500">
          Measurement ID do seu projeto GA4
        </p>
      </div>

      {/* Google Tag Manager */}
      <div className="space-y-2 p-4 border rounded-lg">
        <Label>Google Tag Manager (GTM)</Label>
        <input
          type="text"
          placeholder="GTM-XXXXXXXX"
          value={localSettings.gtmId || ''}
          onChange={(e) => handleUpdate('gtmId', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500">
          Container ID do seu GTM
        </p>
      </div>

      {/* Meta Pixel */}
      <div className="space-y-3 p-4 border rounded-lg">
        <Label>Meta Pixel (Facebook Ads)</Label>
        <input
          type="text"
          placeholder="Seu Pixel ID"
          value={localSettings.metaPixelId || ''}
          onChange={(e) => handleUpdate('metaPixelId', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="metaPixelPageView"
            checked={localSettings.metaPixelPageView !== false}
            onChange={(e) => handleUpdate('metaPixelPageView', e.target.checked)}
          />
          <label htmlFor="metaPixelPageView" className="text-sm">
            Rastrear PageView automaticamente
          </label>
        </div>
      </div>

      {/* Google Ads Conversion */}
      <div className="space-y-2 p-4 border rounded-lg">
        <Label>Google Ads Conversion ID</Label>
        <input
          type="text"
          placeholder="AW-XXXXXXXXXX"
          value={localSettings.googleAdsId || ''}
          onChange={(e) => handleUpdate('googleAdsId', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Hotjar */}
      <div className="space-y-2 p-4 border rounded-lg">
        <Label>Hotjar Site ID</Label>
        <input
          type="text"
          placeholder="Seu Site ID"
          value={localSettings.hotjarId || ''}
          onChange={(e) => handleUpdate('hotjarId', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500">
          Para análise de comportamento e heatmaps
        </p>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          ℹ️ Todos esses scripts serão injetados no &lt;head&gt; ao publicar a página
        </p>
      </div>
    </div>
  );
};
```

### WhatsAppTab.tsx

```typescript
const WhatsAppTab = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState(settings.whatsapp || {});

  const handleUpdate = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdate({ whatsapp: { ...localSettings, [key]: value } });
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  };

  return (
    <div className="space-y-6 py-4">
      {/* Ativar */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="whatsappEnabled"
          checked={localSettings.enabled !== false}
          onChange={(e) => handleUpdate('enabled', e.target.checked)}
        />
        <label htmlFor="whatsappEnabled" className="text-base font-semibold">
          Ativar WhatsApp Flutuante
        </label>
      </div>

      {localSettings.enabled !== false && (
        <>
          {/* Número */}
          <div className="space-y-2">
            <Label>Número de WhatsApp</Label>
            <input
              type="tel"
              value={formatPhoneNumber(localSettings.phoneNumber || '')}
              onChange={(e) => handleUpdate('phoneNumber', e.target.value.replace(/\D/g, ''))}
              placeholder="(11) 98765-4321"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500">
              Formato: (XX) 9XXXX-XXXX ou apenas números
            </p>
          </div>

          {/* Mensagem pré-definida */}
          <div className="space-y-2">
            <Label>Mensagem Pré-definida</Label>
            <textarea
              value={localSettings.defaultMessage || ''}
              onChange={(e) => handleUpdate('defaultMessage', e.target.value)}
              placeholder="Olá! Gostaria de mais informações..."
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500">
              {localSettings.defaultMessage?.length || 0}/160 caracteres
            </p>
          </div>

          {/* Posição */}
          <div className="space-y-2">
            <Label>Posição do Botão</Label>
            <div className="flex gap-4">
              {['bottom-right', 'bottom-left'].map(position => (
                <label key={position} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="whatsappPosition"
                    value={position}
                    checked={localSettings.position === position}
                    onChange={(e) => handleUpdate('position', e.target.value)}
                  />
                  <span className="text-sm">
                    {position === 'bottom-right' ? '↙ Inferior Direito' : '↙ Inferior Esquerdo'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview ao vivo */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-sm font-medium mb-2">Visualização:</p>
            <div className="relative w-full h-64 bg-white rounded border">
              {/* Mock da página */}
              <div className="text-center text-gray-400 py-24">
                Sua página aqui
              </div>

              {/* WhatsApp flutuante */}
              <div className={`absolute bottom-4 flex items-center gap-2
                ${localSettings.position === 'bottom-right' ? 'right-4' : 'left-4'}`}
              >
                <div className="bg-green-500 text-white rounded-full p-3 shadow-lg cursor-pointer
                               hover:bg-green-600 transition-colors">
                  <MessageCircle size={24} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

### LgpdTab.tsx

```typescript
const LgpdTab = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState(settings.lgpd || {});

  const handleUpdate = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdate({ lgpd: { ...localSettings, [key]: value } });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Ativar */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lgpdEnabled"
          checked={localSettings.enabled !== false}
          onChange={(e) => handleUpdate('enabled', e.target.checked)}
        />
        <label htmlFor="lgpdEnabled" className="text-base font-semibold">
          Exibir Aviso de Privacidade (LGPD)
        </label>
      </div>

      {localSettings.enabled !== false && (
        <>
          {/* Texto */}
          <div className="space-y-2">
            <Label>Texto do Aviso</Label>
            <textarea
              value={localSettings.text || ''}
              onChange={(e) => handleUpdate('text', e.target.value)}
              placeholder="Nós utilizamos cookies para melhorar sua experiência..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Cor de fundo */}
          <div className="space-y-2">
            <Label>Cor de Fundo</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localSettings.backgroundColor || '#1f2937'}
                onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                className="h-10 w-16 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {localSettings.backgroundColor}
              </span>
            </div>
          </div>

          {/* Posição */}
          <div className="space-y-2">
            <Label>Posição</Label>
            <select
              value={localSettings.position || 'bottom'}
              onChange={(e) => handleUpdate('position', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="bottom">Inferior</option>
              <option value="top">Superior</option>
              <option value="modal">Modal (Centro)</option>
            </select>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label>Link Política de Privacidade</Label>
            <input
              type="text"
              value={localSettings.privacyLink || ''}
              onChange={(e) => handleUpdate('privacyLink', e.target.value)}
              placeholder="https://seu-site.com/privacidade"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Opt-in/Opt-out */}
          <div className="space-y-2">
            <Label>Tipo de Consentimento</Label>
            <div className="flex gap-4">
              {['opt-in', 'opt-out'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lgpdType"
                    value={type}
                    checked={localSettings.consentType === type}
                    onChange={(e) => handleUpdate('consentType', e.target.value)}
                  />
                  <span className="text-sm">
                    {type === 'opt-in' ? 'Opt-in (Aceitar ativamente)' : 'Opt-out (Rejeitar)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <p className="text-sm font-medium mb-2">Visualização:</p>
            <div
              style={{ backgroundColor: localSettings.backgroundColor || '#1f2937' }}
              className="text-white p-4 rounded text-sm"
            >
              <p>{localSettings.text || 'Nós utilizamos cookies para melhorar sua experiência.'}</p>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-1 bg-white text-gray-900 rounded text-xs font-medium hover:bg-gray-100">
                  Aceitar
                </button>
                <button className="px-4 py-1 border border-white text-white rounded text-xs hover:bg-white/10">
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

### IntegrationsTab.tsx

```typescript
const IntegrationsTab = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState(settings.integrations || {});
  const [crmType, setCrmType] = useState<'rdstation' | 'activecampaign' | 'hubspot' | 'leadlovers'>('rdstation');

  const handleUpdate = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    onUpdate({ integrations: { ...localSettings, [key]: value } });
  };

  return (
    <div className="space-y-6 py-4">
      {/* CRM Selection */}
      <div className="space-y-2">
        <Label>Selecionar CRM</Label>
        <select
          value={crmType}
          onChange={(e) => setCrmType(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="rdstation">RD Station</option>
          <option value="activecampaign">ActiveCampaign</option>
          <option value="hubspot">HubSpot</option>
          <option value="leadlovers">LeadLovers</option>
        </select>
      </div>

      {/* API Key */}
      <div className="space-y-2 p-4 border rounded-lg">
        <Label>API Key</Label>
        <input
          type="password"
          value={localSettings[crmType]?.apiKey || ''}
          onChange={(e) => handleUpdate(crmType, {
            ...localSettings[crmType],
            apiKey: e.target.value
          })}
          placeholder="Cole sua chave de API"
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          Você pode encontrar isso nas configurações de API do seu {crmType}
        </p>
      </div>

      {/* Lista/Tag destino */}
      <div className="space-y-2">
        <Label>Lista ou Tag de Destino</Label>
        <input
          type="text"
          value={localSettings[crmType]?.listId || ''}
          onChange={(e) => handleUpdate(crmType, {
            ...localSettings[crmType],
            listId: e.target.value
          })}
          placeholder="ID da lista ou tag"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Webhook */}
      <div className="space-y-3 p-4 border rounded-lg bg-blue-50">
        <Label>Webhook URL</Label>
        <input
          type="text"
          value={localSettings.webhookUrl || ''}
          onChange={(e) => handleUpdate('webhookUrl', e.target.value)}
          placeholder="https://seu-servidor.com/webhook"
          className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
        />

        <div className="mt-3 p-3 bg-white border rounded text-xs">
          <p className="font-medium mb-2">Payload de exemplo ao receber lead:</p>
          <pre className="overflow-x-auto text-gray-600">
{`{
  "formData": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321"
  },
  "pageId": "page_123",
  "timestamp": "2024-03-12T10:30:00Z"
}`}
          </pre>
        </div>
      </div>

      {/* Test Button */}
      <Button variant="outline" className="w-full">
        Testar Integração
      </Button>
    </div>
  );
};
```

## Injeção de Scripts na Publicação

```typescript
// htmlGenerator.ts
const generateHead = (settings: PageSettings): string => {
  let head = `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(settings.seo?.title || '')}</title>
    <meta name="description" content="${escapeHtml(settings.seo?.metaDescription || '')}" />
    <meta name="keywords" content="${escapeHtml(settings.seo?.keywords?.join(', ') || '')}" />
  `;

  // Meta robots noindex se não indexável
  if (settings.seo?.indexable === false) {
    head += `<meta name="robots" content="noindex, nofollow" />\n`;
  }

  // OG tags
  if (settings.seo?.ogImage) {
    head += `<meta property="og:image" content="${escapeHtml(settings.seo.ogImage)}" />\n`;
  }

  head += `<meta property="og:type" content="website" />\n`;
  head += `<meta property="og:title" content="${escapeHtml(settings.seo?.title || '')}" />\n`;
  head += `<meta property="og:description" content="${escapeHtml(settings.seo?.metaDescription || '')}" />\n`;

  // Google Analytics 4
  if (settings.analytics?.ga4Id) {
    head += `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${settings.analytics.ga4Id}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings.analytics.ga4Id}');
    </script>
    `;
  }

  // Google Tag Manager
  if (settings.analytics?.gtmId) {
    head += `
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${settings.analytics.gtmId}');</script>
    `;
  }

  // Meta Pixel
  if (settings.analytics?.metaPixelId) {
    head += `
    <script>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${settings.analytics.metaPixelId}');
      ${settings.analytics.metaPixelPageView !== false ? "fbq('track', 'PageView');" : ''}
    </script>
    `;
  }

  // Hotjar
  if (settings.analytics?.hotjarId) {
    head += `
    <script>
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${settings.analytics.hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
    `;
  }

  head += `</head>`;
  return head;
};
```

## Critérios de Aceite

- [ ] Modal Settings abre via engrenagem na TopBar
- [ ] 5 abas funcionam corretamente
- [ ] SEO: título max 60 chars com contador color-coded
- [ ] SEO: description max 160 chars com contador
- [ ] SEO: preview slug em tempo real
- [ ] SEO: botão "Gerar com IA" funciona
- [ ] Analytics: GA4, GTM, Meta Pixel, Google Ads, Hotjar salvos
- [ ] WhatsApp: toggle, número, mensagem, posição
- [ ] WhatsApp: preview ao vivo renderiza
- [ ] LGPD: toggle, texto customizável, cores, posição
- [ ] LGPD: Opt-in vs Opt-out selecionável
- [ ] Integrações: CRM seletor, API Key, List/Tag, Webhook
- [ ] Webhook URL mostra payload de exemplo
- [ ] Scripts injetados no <head> ao publicar
- [ ] Meta robots noindex quando desativado

## Stack Técnico

- React 18+ com Hooks
- TypeScript
- zustand (state management)
- fetch API para HTTP
- tailwindCSS
- Firebase (backend)
