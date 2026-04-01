# LEX_SITE15 — Fase 10: Teste A/B Nativo

## Objetivo
Implementar sistema de Teste A/B integrado ao editor visual, permitindo testar variações de elementos e medir impacto em conversões com análise estatística.

## Dependência
- **Fase 8** (LexOnline AI — Conteúdo Jurídico)

## Status de Desenvolvimento
- ⏳ Planejado
- 📋 Arquivos: 5 componentes/serviços
- 🎯 Prazo estimado: 10 dias

---

## Arquitetura de Arquivos

### Backend

#### `backend/src/controllers/abController.ts`
Controlador de rotas de Teste A/B.

**Rotas:**

```
POST /api/ab/tests
├── Body: {pageId, elementId, variantB: {...}}
├── Cria novo teste A/B
└── Response: {testId, variantA, variantB, split, createdAt}

GET /api/ab/tests/:testId
├── Retorna detalhes do teste
└── Response: {testId, status, variantA, variantB, split, endsAt, ...}

PUT /api/ab/tests/:testId
├── Body: {split, endDate}
├── Atualiza configurações do teste
└── Response: {testId, ...}

POST /api/ab/tests/:testId/declare-winner
├── Body: {winner: 'A' | 'B'}
├── Encerra teste e substitui elemento A por B (ou reverte)
└── Response: {testId, winner, appliedAt}

DELETE /api/ab/tests/:testId
├── Cancela teste (sem aplicar vencedor)
└── Response: {success: true}

---

POST /api/ab/:testId/impression
├── Body: {variant, sessionId, device, source}
├── Registra visualização (pageview)
└── Response: {recorded: true}

POST /api/ab/:testId/conversion
├── Body: {variant, sessionId, elementId, value}
├── Registra conversão (lead, compra)
└── Response: {recorded: true}

---

GET /api/ab/tests/:testId/results
├── Query: startDate, endDate
├── Retorna análise estatística
└── Response: {impressions, conversions, confidence, winner, ...}
```

### Backend - Services

#### `backend/src/services/abAnalytics.ts`
Serviço de análise estatística de Testes A/B.

**Métodos principais:**

```typescript
interface TestMetrics {
  impressions: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
}

interface TestResult {
  variantA: TestMetrics;
  variantB: TestMetrics;
  winner: 'A' | 'B' | null;
  confidence: number;  // 0-100%
  zScore: number;
  pValue: number;
  recommendation: string;
}

// Z-test de proporções
async function analyzeTest(testId: string): Promise<TestResult> {
  const data = await getTestData(testId);

  const pA = data.conversionsA / data.impressionsA;
  const pB = data.conversionsB / data.impressionsB;

  // Proporção agrupada
  const p = (data.conversionsA + data.conversionsB) /
            (data.impressionsA + data.impressionsB);

  // Z-score
  const zScore = (pB - pA) / Math.sqrt(
    p * (1 - p) * (1 / data.impressionsA + 1 / data.impressionsB)
  );

  // Confiança (duas caudas)
  const confidence = (1 - 2 * normalDist(-Math.abs(zScore))) * 100;

  // Determinar vencedor
  let winner = null;
  if (confidence > 95) {
    winner = pB > pA ? 'B' : 'A';
  }

  return {
    variantA: {
      impressions: data.impressionsA,
      conversions: data.conversionsA,
      conversionRate: pA * 100,
      confidence: confidence
    },
    variantB: {
      impressions: data.impressionsB,
      conversions: data.conversionsB,
      conversionRate: pB * 100,
      confidence: confidence
    },
    winner,
    confidence,
    zScore,
    pValue: 2 * normalDist(-Math.abs(zScore)),
    recommendation: this.getRecommendation(pB - pA, confidence)
  };
}

// Função auxiliar: distribuição normal acumulada
function normalDist(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + p * x);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;

  const y = 1 - (((((a5 * t5 + a4 * t4) + a3 * t3) + a2 * t2) + a1 * t) * t *
            Math.exp(-x * x));

  return 0.5 * (1 + sign * y);
}

private getRecommendation(delta: number, confidence: number): string {
  if (confidence < 80) {
    return 'Continue o teste. Dados insuficientes para conclusão.';
  }
  if (confidence >= 95 && delta > 0) {
    return 'B está vencendo com alta confiança. Considere declarar vencedor.';
  }
  if (confidence >= 95 && delta < 0) {
    return 'A está vencendo com alta confiança. Considere encerrar.';
  }
  return 'Teste em andamento. Revise em alguns dias.';
}
```

### Frontend

#### `frontend/src/components/AbTest/AbTestPanel.tsx`
Painel de criação e configuração de Teste A/B no RightPanel.

**Fluxo:**

```
1. Editor mostra elemento selecionado
2. RightPanel → Aba "A/B Test"
3. [Criar Teste A/B]
4. Modal aparece:
   ├─ Variante A: configuração atual (read-only)
   ├─ Variante B: clone para editar
   ├─ Split: slider 50/50 (ou custom)
   ├─ Duração: input em dias
   └─ [Criar Teste]
```

**Estrutura do Modal:**

```
┌──────────────────────────────────────┐
│ Criar Teste A/B                      │
├──────────────────────────────────────┤
│ Elemento: Botão CTA                  │
│                                      │
│ VARIANTE A (Original)                │
│ ┌──────────────────────────────────┐ │
│ │ Texto: "Agende Consulta"         │ │
│ │ Cor: #2563eb                     │ │
│ │ Tamanho: 16px                    │ │
│ │ (Read-only)                      │ │
│ └──────────────────────────────────┘ │
│                                      │
│ VARIANTE B (Para Testar)             │
│ ┌──────────────────────────────────┐ │
│ │ Texto: [Agende agora - Gratuito]│ │
│ │ Cor: [cor picker]                │ │
│ │ Tamanho: 16px [slider]           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Divisão de tráfego:                  │
│ A: 50% ←→ B: 50%                     │
│                                      │
│ Duração: [7] dias                    │
│                                      │
│ [Cancelar] [Criar Teste]             │
└──────────────────────────────────────┘
```

**Props:**

```typescript
interface AbTestPanelProps {
  element: Element;
  elementId: string;
  pageId: string;
  onTestCreated: (test: AbTest) => void;
  onClose: () => void;
}
```

#### `frontend/src/components/AbTest/AbResultsDashboard.tsx`
Dashboard de resultados do Teste A/B.

**Seções:**

1. **Informações do Teste**
   - Nome/Elemento testado
   - Data de início e fim
   - Status: Em andamento | Encerrado

2. **Comparação de Métricas (lado a lado)**

```
┌────────────────────────────────────────────┐
│ VARIANTE A             │      VARIANTE B    │
├────────────────────────────────────────────┤
│ Impressões: 1,250      │ Impressões: 1,248 │
│ Conversões: 45         │ Conversões: 62    │
│ Taxa: 3.6%             │ Taxa: 4.96%        │
│                        │                    │
│ Diferença: +38% →      │                    │
│ Confiança: 89%         │                    │
└────────────────────────────────────────────┘
```

3. **Gráfico de Conversão ao Longo do Tempo**
   - Eixo X: Dias
   - Eixo Y: Taxa de conversão
   - Duas linhas: A (azul) vs B (verde)

4. **Badge de Status**
   - 🟡 "Teste em andamento"
   - 🟢 "B está vencendo (97% confiança)"
   - 🔴 "A está vencendo (94% confiança)"

5. **Botão de Ação**
   - Se vencedor detectado (>95%): "Declarar Vencedor"
   - Se teste ativo: "Encerrar Teste"

```typescript
interface AbResultsDashboardProps {
  testId: string;
  onDeclareWinner: (winner: 'A' | 'B') => void;
  onEndTest: () => void;
}
```

#### `frontend/src/hooks/useAbTest.ts`
Hook customizado para gerenciamento de Testes A/B.

**State:**

```typescript
{
  tests: AbTest[];
  currentTest: AbTest | null;
  results: TestResult | null;
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
}
```

**Funções:**

- `async createTest(pageId: string, elementId: string, variantB: any): Promise<AbTest>`
- `async fetchTestResults(testId: string): Promise<TestResult>`
- `async declareWinner(testId: string, winner: 'A' | 'B'): Promise<void>`
- `async endTest(testId: string): Promise<void>`
- `async deleteTest(testId: string): Promise<void>`
- `enableAutoRefresh(testId: string, intervalMs: number): () => void`

---

## Fluxo de Teste A/B Completo

### 1. Criação do Teste
```
Usuário seleciona elemento: "Botão CTA"
    ↓
RightPanel → "A/B Test" → [Criar Teste A/B]
    ↓
Modal exibe:
  - Variante A: "Agende Consulta" (#2563eb)
  - Variante B: [clonar para editar]
    ↓
Usuário edita Variante B:
  - Texto: "Agende agora - Gratuito"
  - Cor: #dc2626 (vermelha)
    ↓
Ajusta split: 60/40 (mais tráfego para A)
Duração: 14 dias
    ↓
[Criar Teste]
    ↓
POST /api/ab/tests
{
  pageId: "page_123",
  elementId: "btn_456",
  variantA: {texto: "Agende Consulta", cor: "#2563eb"},
  variantB: {texto: "Agende agora - Gratuito", cor: "#dc2626"},
  split: {A: 60, B: 40},
  endDate: "2026-03-26T00:00:00Z"
}
    ↓
Teste criado: testId = "ab_789"
```

### 2. Publicação e Roteamento
```
Página publicada em Firebase
    ↓
Script injetado na página:
  1. Ao carregar, verifica cookie "lx_ab_ab_789"
  2. Se não existe, sorteia A ou B com split 60/40
  3. Define cookie por 30 dias
  4. Renderiza elemento com configuração sorteada

Exemplo (JavaScript):
```javascript
function resolveAbVariant(testId, split) {
  const cookieName = `lx_ab_${testId}`;
  let variant = getCookie(cookieName);

  if (!variant) {
    const rand = Math.random() * 100;
    variant = rand < split.A ? 'A' : 'B';
    setCookie(cookieName, variant, 30);
  }

  return variant;
}

// Ao carregar a página
const testId = 'ab_789';
const variant = resolveAbVariant(testId, {A: 60, B: 40});

// POST /api/ab/ab_789/impression
fetch('/api/ab/ab_789/impression', {
  method: 'POST',
  body: JSON.stringify({
    variant: variant,
    sessionId: sessionStorage.getItem('sid'),
    device: 'desktop',
    source: document.referrer
  })
});
```
```

### 3. Monitoramento de Conversões
```
Usuário clica em elemento "form-submit"
    ↓
Frontend captura clique:
  POST /api/ab/ab_789/conversion
  {
    variant: 'A',  // ou 'B'
    sessionId: 'session_123',
    elementId: 'form_submit',
    value: 1  // ou valor da conversão
  }
    ↓
Backend registra conversão no banco
```

### 4. Análise e Resultados
```
Usuário abre AbResultsDashboard
    ↓
GET /api/ab/ab_789/results?startDate=...&endDate=...
    ↓
abAnalytics.analyzeTest() calcula:
  - pA = conversionsA / impressionsA = 62 / 1250 = 4.96%
  - pB = conversionsB / impressionsB = 45 / 1248 = 3.6%
  - z-score = -1.23 (A vencendo)
  - confidence = 78% (não significativa)
    ↓
Retorna:
{
  variantA: {
    impressions: 1250,
    conversions: 62,
    conversionRate: 4.96,
    confidence: 78
  },
  variantB: {
    impressions: 1248,
    conversions: 45,
    conversionRate: 3.6,
    confidence: 78
  },
  winner: null,  // Não significativo ainda
  confidence: 78,
  recommendation: "Continue o teste. Dados insuficientes."
}
    ↓
Dashboard mostra:
  - Gráfico de conversão ao longo dos dias
  - Badge: 🟡 "Teste em andamento"
  - Botão: "Encerrar Teste" (se desejar parar antes)
```

### 5. Declarar Vencedor
```
Após 14 dias (ou quando confidence > 95%)
    ↓
Usuário clica "Declarar Vencedor"
    ↓
POST /api/ab/ab_789/declare-winner {winner: 'A'}
    ↓
Backend:
  1. Marca teste como "concluded"
  2. Se winner='A': mantém elemento original
  3. Se winner='B': substitui variante A por B
  4. Publica página novamente
  5. Remove script A/B da página
    ↓
Página agora mostra apenas a variante vencedora
    ↓
Dashboard mostra: "🏆 Teste Concluído - A venceu com 96% confiança"
```

---

## Banco de Dados

### Tabelas

```sql
CREATE TABLE ab_tests (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  element_id VARCHAR(36) NOT NULL,
  status ENUM('active', 'paused', 'concluded') DEFAULT 'active',
  split_a INT DEFAULT 50,
  split_b INT DEFAULT 50,
  starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMP,
  concluded_at TIMESTAMP,
  winner ENUM('A', 'B'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE ab_variants (
  id VARCHAR(36) PRIMARY KEY,
  test_id VARCHAR(36) NOT NULL,
  variant ENUM('A', 'B') NOT NULL,
  element_config JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE
);

CREATE TABLE ab_events (
  id VARCHAR(36) PRIMARY KEY,
  test_id VARCHAR(36) NOT NULL,
  event_type ENUM('impression', 'conversion') NOT NULL,
  variant ENUM('A', 'B') NOT NULL,
  session_id VARCHAR(255),
  device VARCHAR(50),
  source VARCHAR(500),
  value DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE
);

CREATE INDEX idx_ab_events_test ON ab_events(test_id, created_at);
```

---

## Critérios de Aceitação

- [ ] Teste A/B criado a partir do elemento selecionado
- [ ] Variante B clonada de A e editável
- [ ] Split configurável (A/B %)
- [ ] Teste publicado com script de roteamento via cookie
- [ ] Tráfego roteado respeitando split configurado
- [ ] Impressões e conversões registradas corretamente
- [ ] Z-test calcula confiança estatística
- [ ] Badge mostra "B está vencendo (97% confiança)" quando significativo
- [ ] Declarar vencedor substitui elemento original
- [ ] Dashboard mostra gráfico de conversão ao longo do tempo
- [ ] Teste pode ser encerrado antes do prazo

---

## Notas Técnicas

- **Amostra mínima:** Avisar se < 100 impressões (resultado pode não ser significativo)
- **Confiança:** Usar 95% como padrão para "vencedor detectado"
- **Cookie:** Armazenar variante por 30 dias ou duração do teste (maior deles)
- **Sessão:** Usar sessionStorage + GUID para rastrear usuário no teste
- **Performance:** Script A/B < 1KB para não impactar carregamento
- **Rollback:** Se declarar vencedor errado, usuário pode "Reverter Teste"
- **Variáveis:** Suportar testes de A/B em: texto, cor, tamanho, posição, imagem
