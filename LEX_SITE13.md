# LEX_SITE13 — Fase 8: LexOnline AI — Conteúdo Jurídico

## Objetivo
Implementar assistente IA especializado em marketing jurídico digital, com conteúdo conformado ao Código de Ética e Disciplina da OAB, gerando textos persuasivos e profissionais para páginas de advogados.

## Dependência
- **Fase 6** (Editor Responsivo + Publicação)

## Status de Desenvolvimento
- ⏳ Planejado
- 📋 Arquivos: 5 componentes/serviços
- 🎯 Prazo estimado: 12 dias

---

## Arquitetura de Arquivos

### Backend

#### `backend/src/services/lexAiService.ts`
Serviço central de IA com especialização em marketing jurídico.

**System Prompt Base:**
```
Você é especialista em marketing jurídico digital brasileiro. Sua missão é
criar conteúdo profissional, persuasivo e em conformidade com o Código de
Ética e Disciplina da OAB (Resolução 02/2015).

ESTRITAMENTE PROIBIDO:
- Mercantilização da profissão (captação agressiva)
- Promessas de resultados ("garantia de ganhar", "com 100% de êxito")
- Depoimentos de clientes reais
- Comparação direta com concorrentes
- Publicidade em meios impróprios
- Solicitar dados pessoais em formulários enganosos

SEMPRE FAZER:
- Usar linguagem técnica mas acessível
- Focar em direitos do cliente e proteção legal
- Incluir prova social ética (certificações, associações profissionais)
- Destacar credenciais e especialidade
- Educar sobre os temas jurídicos
- Respeitar privacidade e confidencialidade
- Ser honesto sobre limitações legais

Escreva em português brasileiro formal mas acessível. Use exemplos reais
mas genéricos. Crie urgência através de educação, não de medo.
```

**Métodos principais:**

1. `async generateText(type: string, context: GenerateTextRequest): Promise<AsyncGenerator<string>>`
   - Tipos suportados: `headline`, `bio`, `service-description`, `blog-post`, `testimonial-request`, `about`, `faq-answer`
   - Context contém: área jurídica, especialidade, público-alvo, tom, nicho específico
   - Retorna stream (gerador) para exibição em tempo real
   - Exemplo de prompt interno:
     ```
     Área: Direito do Trabalho
     Especialidade: Rescisão indevida
     Público: Empregados demitidos

     Gere um headline persuasivo para uma página de advogado especializado.
     Máximo 80 caracteres. Foque no direito do cliente, não no advogado.
     ```

2. `async generateSeo(pageContent: string, city: string): Promise<SeoOptimization>`
   - Input: conteúdo da página + cidade
   - Output: `{title, metaDescription, keywords[]}`
   - Title: 50-60 chars, incluir localidade e especialidade
   - Description: 150-160 chars, call-to-action sutil
   - Keywords: 5-10 terms long-tail com localidade

3. `async analyzePage(pageJSON: PageStructure): Promise<SuggestionList>`
   - Analisa estrutura da página
   - Retorna sugestões de melhoria de conteúdo, SEO, conversão
   - Exemplo: "Seção 'Áreas' está vaga. Sugiro descrever cada área em 2-3 linhas."

4. `async generateFaqList(area: string, nicho: string): Promise<FaqItem[]>`
   - Gera FAQ customizado por área jurídica
   - Retorna array de {question, answer}
   - Exemplo area="Direito Previdenciário", nicho="Aposentadoria por Tempo de Contribuição"
   - Saída: 10-15 perguntas frequentes com respostas completas

#### `backend/src/controllers/aiController.ts`
Controlador de rotas de IA.

**Rotas implementadas:**

```
POST /api/ai/generate-text
├── Body: {type, context}
├── Header: Authorization (JWT)
├── Response: streaming (SSE ou chunked)
└── Valida rate limit do plano

POST /api/ai/seo
├── Body: {pageContent, city}
├── Response: {title, description, keywords}
└── Não requer streaming

POST /api/ai/analyze
├── Body: {pageJSON}
├── Response: {suggestions: [{element, text, priority}]}
└── Análise assíncrona

POST /api/ai/faq
├── Body: {area, nicho}
├── Response: {items: [{question, answer}]}
└── Gera FAQ customizado
```

**Rate Limiting por Plano:**
```
Essencial: 10 requisições/dia
Profissional: 50 requisições/dia
Agência: Ilimitado
```

### Frontend

#### `frontend/src/components/AiPanel/AiPanel.tsx`
Painel lateral com botão de IA e integração ao editor.

**Estrutura:**
```
┌─────────────────────────┐
│ ✦ LexOnline AI          │
├─────────────────────────┤
│ [Fechar]                │
├─────────────────────────┤
│ Chat area (scrollable)  │
│ (mensagens streaming)   │
├─────────────────────────┤
│ Input bar:              │
│ [_______________] [>]   │
├─────────────────────────┤
│ Botões rápidos:         │
│ [Headline] [Bio]        │
│ [FAQ] [SEO]             │
│ [Inserir na página]     │
└─────────────────────────┘
```

**Props:**
```typescript
interface AiPanelProps {
  pageData: PageStructure;
  selectedElementId?: string;
  onElementUpdate: (elementId: string, content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}
```

**Comportamentos:**
- Painel abre como sidebar do lado direito
- Chat exibe mensagens em tempo real (streaming)
- Botões rápidos pré-preenchem prompts comuns
- "Inserir na página" substitui conteúdo do elemento selecionado

#### `frontend/src/components/AiPanel/AiChat.tsx`
Componente de chat com streaming de mensagens.

**Features:**
- Exibe mensagens IA com efeito de digitação (char por char)
- Suporta markdown básico (bold, italic, links)
- Avatar da IA e timestamp de mensagens
- Scroll automático para última mensagem
- Indicador "IA está digitando..."

**Props:**
```typescript
interface AiChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onInsertContent: (content: string) => void;
}
```

#### `frontend/src/hooks/useAi.ts`
Hook customizado para lógica de IA.

**State:**
```typescript
{
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  rateLimitRemaining: number;
  rateLimitReset: Date | null;
}
```

**Funções:**

- `async generateText(type: string, context: any): Promise<void>`
  - Envia POST /api/ai/generate-text
  - Consome stream e adiciona caracteres um a um
  - Atualiza rate limit do estado

- `async generateSeo(pageContent: string, city: string): Promise<SeoOptimization>`
  - Chama POST /api/ai/seo
  - Retorna dados estruturados

- `async generateFaq(area: string, nicho: string): Promise<FaqItem[]>`
  - Chama POST /api/ai/faq
  - Retorna array de perguntas/respostas

- `async analyzePage(pageJSON: PageStructure): Promise<Suggestion[]>`
  - Chama POST /api/ai/analyze
  - Retorna lista de sugestões ordenadas por prioridade

- `insertContentIntoElement(elementId: string, content: string): void`
  - Substitui texto do elemento selecionado
  - Trigger atualização na página

---

## Fluxo de Usuário

### 1. Abrir Painel IA
```
Usuário clica botão "✦ LexOnline AI" (topo direito do editor)
    ↓
Painel abre à direita
    ↓
Exibe prompt de boas-vindas
```

### 2. Gerar Headline
```
Usuário clica "Headline"
    ↓
useAi.generateText('headline', {area: 'Família', nicho: 'Divórcio', city: 'São Paulo'})
    ↓
POST /api/ai/generate-text é enviado
    ↓
Backend executa LexAiService.generateText()
    ↓
Stream SSE retorna texto char a char
    ↓
Chat exibe: "Proteger seus direitos na separação conjugal"
    ↓
Botão "Inserir na página" aparece sob a resposta
```

### 3. Inserir Conteúdo
```
Usuário seleciona elemento "Título" no editor
    ↓
Clica "Inserir na página"
    ↓
Frontend substitui conteúdo do elemento selecionado
    ↓
Editor marca elemento como modificado
    ↓
Painel fecha ou mostra confirmação
```

### 4. Gerar SEO
```
Usuário clica "SEO"
    ↓
useAi.generateSeo(pageJSON, 'Rio de Janeiro')
    ↓
POST /api/ai/seo
    ↓
Resposta: {
  title: "Advogado Especialista em Direito de Família - RJ",
  description: "Proteja seus direitos familiares com nossa experiência. Consultoria jurídica completa.",
  keywords: ["direito de família rio de janeiro", "divórcio rj", ...]
}
    ↓
Campos de SEO (Settings > SEO) são auto-preenchidos
```

### 5. Gerar FAQ
```
Usuário clica "FAQ"
    ↓
Seleciona área: "Direito do Trabalho" e nicho: "Rescisão indevida"
    ↓
useAi.generateFaq('Direito do Trabalho', 'Rescisão indevida')
    ↓
POST /api/ai/faq retorna 15 perguntas + respostas
    ↓
Modal mostra FAQ preview
    ↓
Opção: "Adicionar seção FAQ à página"
    ↓
Nova seção adicionada ao final da página
```

---

## Exemplos de Prompts por Tipo

### type: `headline`
```
Área: Direito Previdenciário
Especialidade: Aposentadoria
Público: Trabalhadores com dúvidas sobre aposentadoria

Contexto: Criar headline para página de advogado especialista em direito
previdenciário, foco em aposentadoria. Deve ser persuasivo, ético,
sem promessas falsas. Máximo 80 caracteres.

Resposta sugerida:
"Garanta seus direitos previdenciários com especialista"
```

### type: `bio`
```
Área: Direito Criminal
Especialidade: Defesa Criminal
Experiência: 15 anos

Contexto: Escrever bio profissional de advogado especialista em defesa
criminal. Destacar credenciais, formação, filosofia de trabalho.
200-300 palavras, tom formal acessível.

Resposta sugerida:
"Advogado especialista em defesa criminal com 15 anos de experiência.
Formado pela USP. Membro da OAB-SP desde [ano]. Atuação focada em
proteger direitos constitucionais do acusado..."
```

### type: `service-description`
```
Área: Direito Imobiliário
Serviço: Compra e venda de imóvel

Contexto: Descrever serviço jurídico de compra/venda de imóvel em
linguagem clara. Educar cliente sobre riscos e proteções.
150-200 palavras.

Resposta sugerida:
"Assessoria jurídica completa em compra e venda de imóvel.
Verificamos documentação, título de propriedade, débitos,
registro imobiliário. Proteção contra fraudes..."
```

---

## Banco de Dados (opcional - apenas para logs)

### Tabela: `ai_usage_logs`
```sql
CREATE TABLE ai_usage_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  page_id VARCHAR(36),
  request_type VARCHAR(50),
  tokens_used INT,
  response_length INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Rate Limiting

**Implementação:**
```typescript
// No controller
async handleAiRequest(req, res) {
  const user = req.user;
  const planLimits = {
    essencial: 10,
    profissional: 50,
    agencia: Infinity
  };

  const todayUsage = await aiUsageLog.countToday(user.id);
  const limit = planLimits[user.plan];

  if (todayUsage >= limit) {
    return res.status(429).json({
      error: 'Rate limit atingido',
      remaining: 0,
      reset_at: '2026-03-13T00:00:00Z'
    });
  }

  // Continuar com requisição
}
```

**Resposta de Rate Limit:**
```json
{
  "remaining_today": 5,
  "limit": 50,
  "reset_at": "2026-03-13T00:00:00Z"
}
```

---

## Conformidade OAB

**Verificações implementadas:**

1. **Sem Mercantilização**
   - IA rejeita "Ganhe sua causa com 100% de certeza"
   - Rejeita "Somos os melhores advogados do Brasil"

2. **Sem Promessas de Resultado**
   - IA usa "pode ajudar", "busca por", "procura proteger"
   - Não usa "vai ganhar", "garantimos", "certeza"

3. **Foco em Direitos do Cliente**
   - "Proteja seus direitos trabalhistas"
   - "Entenda suas opções legais"

4. **Prova Social Ética**
   - Certificações profissionais
   - Associações (OAB, IBDP, etc)
   - Anos de experiência

5. **Educação, não Pressão**
   - FAQ educativa
   - Explicação de conceitos
   - Clareza sobre processo legal

---

## Critérios de Aceitação

- [ ] Painel IA acessível via botão no topo do editor
- [ ] Streaming de texto funciona (chars um a um)
- [ ] Botões rápidos (Headline, Bio, FAQ, SEO) funcionam
- [ ] "Inserir na página" substitui conteúdo do elemento selecionado
- [ ] SEO preenche automaticamente campos de title/description/keywords
- [ ] Rate limit respeitado por plano (10/50/∞ por dia)
- [ ] Resposta segue Código de Ética da OAB
- [ ] FAQ gera 10-15 perguntas contextualizadas
- [ ] Análise de página retorna sugestões relevantes
- [ ] Tratamento de erro se API de IA falhar

---

## Notas Técnicas

- **API de IA:** Usar OpenAI GPT-4 com custom instructions
- **Streaming:** Implementar SSE (Server-Sent Events) ou WebSocket
- **Cache:** Cachear respostas por 24h para perguntas idênticas
- **Token cost:** Monitorar tokens gastos por plano para financeiro
- **Fallback:** Se IA falhar, mostrar erro amigável e sugerir geração manual
