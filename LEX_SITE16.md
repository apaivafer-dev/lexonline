# LEX_SITE16 — Fase 11: Analytics Interno

## Objetivo
Implementar sistema de analytics interno sem dependência do Google Analytics, com dashboard de métricas em tempo real, rastreamento de leads e exportação de dados.

## Dependência
- **Fase 6** (Editor Responsivo + Publicação)

## Status de Desenvolvimento
- ⏳ Planejado
- 📋 Arquivos: 7 componentes/serviços/hooks
- 🎯 Prazo estimado: 12 dias

---

## Arquitetura de Arquivos

### Backend

#### `backend/src/controllers/analyticsController.ts`
Controlador de rotas de analytics.

**Rotas:**

```
POST /api/analytics/pageview
├── Body: {pageId, sessionId, device, source, userAgent}
├── Registra visualização de página
└── Response: {recorded: true, sessionId}

POST /api/analytics/duration
├── Body: {pageId, sessionId, duration}
├── Registra tempo de permanência
└── Response: {recorded: true}

POST /api/analytics/lead
├── Body: {pageId, sessionId, name, email, phone, area, source}
├── Registra novo lead capturado
└── Response: {leadId, createdAt}

---

GET /api/analytics/dashboard/:pageId
├── Query: period (today, 7d, 30d, 90d, custom?start=...&end=...)
├── Retorna overview com todas as métricas
└── Response: {
      visits: 1250,
      leads: 42,
      conversion_rate: 3.36,
      avg_duration: 125,
      bounce_rate: 45.2,
      ...
    }

GET /api/analytics/chart/visits/:pageId
├── Query: period
├── Retorna dados para gráfico de linha (visitas por dia)
└── Response: [{date, visits}]

GET /api/analytics/chart/device/:pageId
├── Query: period
├── Retorna dados para pizza (desktop/mobile/tablet)
└── Response: {desktop: 65%, mobile: 30%, tablet: 5%}

GET /api/analytics/chart/sources/:pageId
├── Query: period
├── Retorna dados para barras (origem do tráfego)
└── Response: [{source, visits}]

GET /api/analytics/leads/:pageId
├── Query: page, limit, sort, search, filter
├── Retorna lista paginada de leads
└── Response: {
      leads: [
        {id, name, email, phone, area, createdAt, source, status},
        ...
      ],
      total: 150,
      page: 1,
      pageSize: 20
    }

PUT /api/analytics/leads/:leadId
├── Body: {status}
├── Atualiza status do lead (Novo → Contatado → Convertido → Perdido)
└── Response: {id, status, updatedAt}

POST /api/analytics/leads/export
├── Query: format (csv, xlsx), pageId, period
├── Gera arquivo exportado
└── Response: {url, filename, size}

POST /api/analytics/leads/send-crm
├── Body: {leadIds, crmType, credentials}
├── Envia leads para CRM externo
└── Response: {sent_count, failed_count, errors}
```

### Frontend

#### `frontend/src/page/analytics/PageAnalytics.tsx`
Página principal de analytics (acessível em Settings > Analytics).

**Seções:**

1. **Seletor de Período**
   ```
   [Hoje] [7 dias] [30 dias] [90 dias] [Customizado ▼]
   ```

2. **Cards de Métrica (4 colunas)**
   ```
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ 📊 Visitas  │  │ 📝 Leads    │  │ 📈 Taxa     │  │ ⏱️ Tempo    │
   │   1,250     │  │   42        │  │  3.36%      │  │  2m 05s     │
   │  ↑ 12% ▲   │  │ ↑ 5% ▲      │  │ ↑ 0.5% ▲   │  │  ↑ 8% ▲    │
   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

   ┌─────────────┐  ┌─────────────┐
   │ 🔄 Rejeição │  │ 🎯 Origem   │
   │  45.2%      │  │ Orgânico    │
   │ ↓ 3% ▼      │  │ 65% do tráf │
   └─────────────┘  └─────────────┘
   ```

3. **Gráficos**
   - Linha: Visitas ao longo do período
   - Pizza: Distribuição por device
   - Barras: Tráfego por origem

#### `frontend/src/page/analytics/LeadsTable.tsx`
Tabela de leads com filtros, busca e ações.

**Estrutura:**

```
┌─────────────────────────────────────────────────────────────────┐
│ LEADS                                                           │
├─────────────────────────────────────────────────────────────────┤
│ [Buscar...]              [Filtros ▼]  [CSV] [Integrações ▼]   │
├─────────────────────────────────────────────────────────────────┤
│ Nome | E-mail | Telefone | Área | Data | Origem | Status | Ações
├─────────────────────────────────────────────────────────────────┤
│ João Silva | j@... | 11 99... | Fam. | 12/3 | Org. | Novo | [•••]
│ Maria S. | m@... | 11 98... | Trab.| 11/3 | Ref. | Conta.| [•••]
└─────────────────────────────────────────────────────────────────┘

Ações por linha:
├─ Editar
├─ Mudar status → [Novo | Contatado | Convertido | Perdido]
├─ Ver página
└─ Deletar
```

**Filtros:**
- Por status (Novo, Contatado, Convertido, Perdido)
- Por área jurídica
- Por origem (Orgânico, Referência, Direto, Anúncio)
- Por período (Hoje, 7d, 30d, custom)

#### `frontend/src/components/Charts/VisitsChart.tsx`
Componente de gráfico de linha (visitas ao longo do tempo).

**Biblioteca:** Recharts ou Chart.js

```typescript
interface VisitsChartProps {
  data: {date: string, visits: number}[];
  period: 'today' | '7d' | '30d' | '90d' | 'custom';
}
```

#### `frontend/src/components/Charts/DevicePieChart.tsx`
Componente de gráfico de pizza (device breakdown).

```typescript
interface DevicePieChartProps {
  data: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}
```

#### `frontend/src/components/Charts/SourcesBarChart.tsx`
Componente de gráfico de barras (tráfego por origem).

```typescript
interface SourcesBarChartProps {
  data: {source: string, visits: number}[];
}
```

#### `frontend/src/hooks/useAnalytics.ts`
Hook customizado para analytics.

**State:**

```typescript
{
  metrics: {
    visits: number;
    leads: number;
    conversionRate: number;
    avgDuration: number;
    bounceRate: number;
  };
  chartData: {
    visits: {date, visits}[];
    device: {desktop, mobile, tablet};
    sources: {source, visits}[];
  };
  leads: Lead[];
  period: Period;
  loading: boolean;
  error: string | null;
  pagination: {page, total, pageSize};
}
```

**Funções:**

- `async fetchMetrics(pageId: string, period: Period): Promise<void>`
- `async fetchChartData(pageId: string, period: Period): Promise<void>`
- `async fetchLeads(pageId: string, filters: LeadFilters, page: number): Promise<void>`
- `async updateLeadStatus(leadId: string, status: LeadStatus): Promise<void>`
- `async exportLeads(pageId: string, format: 'csv' | 'xlsx'): Promise<Blob>`
- `async sendLeadsToCrm(leadIds: string[], crmType: string, credentials: any): Promise<void>`
- `setPeriod(period: Period): void`

---

## Script de Rastreamento

### Tamanho e Injeção

**Requisito:** Script < 2KB (comprimido)

**Injeção no HTML publicado:**

```html
<script>
!function(){
  // LexOnline Analytics - ~1.8KB minificado

  // 1. Gerar ou recuperar session ID
  const sessionId = window.lexAnalytics?.sessionId ||
    (sessionStorage.getItem('lex_sid') ||
      (Math.random().toString(36).substring(2, 11) +
       Math.random().toString(36).substring(2, 11)));
  sessionStorage.setItem('lex_sid', sessionId);

  // 2. Detectar device
  const ua = navigator.userAgent;
  const device = /mobile|android|iphone/i.test(ua) ? 'mobile' :
                 /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop';

  // 3. Obter source (referrer ou direct)
  const source = document.referrer || 'direct';

  // 4. Rastrear pageview
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      pageId: 'PAGE_ID_PLACEHOLDER',
      sessionId: sessionId,
      device: device,
      source: source,
      userAgent: ua
    })
  }).catch(() => {});

  // 5. Rastrear duração ao sair
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    navigator.sendBeacon('/api/analytics/duration', JSON.stringify({
      pageId: 'PAGE_ID_PLACEHOLDER',
      sessionId: sessionId,
      duration: duration
    }));
  });

  // 6. Expor globalmente para captação de leads
  window.lexAnalytics = {sessionId, device, source};
}();
</script>
```

### Captação de Leads

Quando formulário é submetido:

```html
<form id="contact-form">
  <input type="text" name="name" placeholder="Nome" required>
  <input type="email" name="email" placeholder="E-mail" required>
  <input type="tel" name="phone" placeholder="Telefone">
  <select name="area">
    <option value="familia">Direito de Família</option>
    <option value="trabalho">Direito do Trabalho</option>
  </select>
  <button type="submit">Enviar</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  fetch('/api/analytics/lead', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      pageId: 'PAGE_ID_PLACEHOLDER',
      sessionId: window.lexAnalytics.sessionId,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      area: formData.get('area'),
      source: window.lexAnalytics.source
    })
  }).then(res => {
    // Sucesso
    console.log('Lead registrado');
    this.reset();
  });
});
</script>
```

---

## Banco de Dados

```sql
CREATE TABLE analytics_pageviews (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  device VARCHAR(20),
  source VARCHAR(500),
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  INDEX idx_page_date (page_id, created_at),
  INDEX idx_session (session_id)
);

CREATE TABLE analytics_sessions (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  device VARCHAR(20),
  source VARCHAR(500),
  duration_seconds INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  INDEX idx_page_date (page_id, started_at)
);

CREATE TABLE analytics_leads (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  session_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  area VARCHAR(100),
  source VARCHAR(100),
  status ENUM('novo', 'contatado', 'convertido', 'perdido') DEFAULT 'novo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  INDEX idx_page_date (page_id, created_at),
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

---

## Cálculos de Métricas

### 1. Visitas
```
SELECT COUNT(DISTINCT session_id)
FROM analytics_pageviews
WHERE page_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
```

### 2. Leads
```
SELECT COUNT(*)
FROM analytics_leads
WHERE page_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
```

### 3. Taxa de Conversão
```
leads / visitas * 100
Ex: 42 leads / 1250 visitas = 3.36%
```

### 4. Tempo Médio na Página
```
SELECT AVG(duration_seconds) as avg_duration
FROM analytics_sessions
WHERE page_id = ? AND started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
Result: 125 segundos = 2 minutos 5 segundos
```

### 5. Taxa de Rejeição
```
Sessões que duraram < 10 segundos / Total de sessões * 100
```

### 6. Origem do Tráfego
```
SELECT source, COUNT(DISTINCT session_id) as visits
FROM analytics_pageviews
WHERE page_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
GROUP BY source
ORDER BY visits DESC

Ex:
- google.com: 812 (65%)
- direct: 312 (25%)
- facebook.com: 126 (10%)
```

---

## Exportação CSV

**Formato:**

```csv
Nome,Email,Telefone,Área,Data de Criação,Origem,Status
João Silva,joao@example.com,11999999999,Direito de Família,2026-03-12,Orgânico,Novo
Maria Santos,maria@example.com,11988888888,Direito do Trabalho,2026-03-11,Referência,Contatado
...
```

**Implementação:**

```typescript
async exportLeads(pageId: string, format: 'csv'): Promise<Blob> {
  const leads = await analyticsLeads.findByPageId(pageId);

  const csv = [
    ['Nome', 'Email', 'Telefone', 'Área', 'Data de Criação', 'Origem', 'Status'],
    ...leads.map(l => [
      l.name,
      l.email,
      l.phone,
      l.area,
      l.created_at.toLocaleDateString('pt-BR'),
      l.source,
      l.status
    ])
  ]
  .map(row => row.map(cell => `"${cell}"`).join(','))
  .join('\n');

  return new Blob([csv], {type: 'text/csv'});
}
```

---

## Integrações com CRM

**Suportados:**

- Salesforce
- Pipedrive
- HubSpot
- RD Station
- Komodo

**Fluxo:**

```
Usuário clica [Integrações]
    ↓
Modal: "Selecionar CRM" + credenciais
    ↓
Teste de conexão
    ↓
Selecionar leads para enviar
    ↓
POST /api/analytics/leads/send-crm
    ↓
Backend mapeia campos (name → firstName, etc)
    ↓
Envia para API do CRM
    ↓
Feedback: "15 leads enviados com sucesso"
```

---

## Critérios de Aceitação

- [ ] Dashboard exibe métricas em tempo real
- [ ] Seletor de período funciona (Hoje, 7d, 30d, 90d, custom)
- [ ] Cards mostram variação (↑/↓) e porcentagem
- [ ] Gráfico de visitas renderiza linha corretamente
- [ ] Pizza de device mostra desktop/mobile/tablet
- [ ] Barras de origem exibem tráfego por source
- [ ] Tabela de leads lista com paginação
- [ ] Busca por nome/email funciona
- [ ] Filtros por status/área/período funcionam
- [ ] Status editável com dropdown (Novo → Contatado → Convertido → Perdido)
- [ ] Exportação CSV gera arquivo correto
- [ ] Integração com CRM envia dados corretamente
- [ ] Script de rastreamento < 2KB
- [ ] Script injetado na página publicada
- [ ] Captação de leads funciona (form submit)
- [ ] Duração registrada corretamente (beforeunload)

---

## Notas Técnicas

- **Session ID:** Usar UUID v4 ou similar, válido por 30 minutos de inatividade
- **Device Detection:** Baseado em User-Agent (mobile, tablet, desktop)
- **Source:** Extrair do referrer ou marcar como "direct" se vazio
- **Rate Limiting:** Permitir máximo 100 pageviews por segundo por página
- **Privacy:** Não armazenar IP completo (truncar último octeto para IPv4)
- **Cache:** Cachear métricas por 1 minuto no servidor
- **Retenção:** Manter dados por 12 meses, depois arquivar
- **GDPR:** Avisar sobre rastreamento, permitir opt-out via localStorage
