# LEX_SITE17 — Prompts de Suporte (Refatoração, Debug, Novo Elemento)

## Objetivo
Fornecer modelos de prompts estruturados para manutenção, debug e evolução do LexOnline Builder, facilitando tarefas repetitivas de refatoração, correção de bugs e adição de novos elementos.

## Status de Desenvolvimento
- ✅ Referência para todas as fases
- 📋 3 tipos de prompts
- 🎯 Aplicável sempre

---

## PROMPT 1: REFATORAÇÃO

### Quando Usar
- Arquivo tem mais de 150 linhas (componentes React) ou 200 linhas (backend)
- 1 arquivo com múltiplas responsabilidades
- Código com lógica complexa que poderia ser reutilizável
- Antes de aceitar um arquivo como "pronto"

### Regras Obrigatórias

1. **Limites de Linhas**
   - Componentes React: máximo 150 linhas
   - Serviços Backend: máximo 200 linhas
   - Hooks: máximo 100 linhas
   - Utils: máximo 150 linhas

2. **Uma Responsabilidade por Arquivo**
   - Exemplo ❌: arquivo com renderização + lógica HTTP + validação
   - Exemplo ✅: arquivo com APENAS renderização

3. **Organização de Extrações**
   - Lógica → `hooks/` (Custom Hooks para React, Services para Backend)
   - Tipos → `types/`
   - Constantes → `constants/`
   - Funções puras → `utils/`
   - Componentes reutilizáveis → `components/shared/`

4. **Não Altere Funcionalidade**
   - Apenas reorganize código
   - Garanta testes passem
   - Não mude APIs públicas
   - Não mude importações externas

### Estrutura do Prompt

```
Refatore o arquivo abaixo respeitando:
- Máximo 150 linhas (componente React)
- Extrair lógica para hooks/
- Extrair tipos para types/
- Extrair constantes para constants/
- Extrair funções puras para utils/
- NÃO altere funcionalidade

Arquivo: [CAMINHO_ARQUIVO]

[CONTEÚDO_ARQUIVO]

Forneça:
1. Arquivo refatorado (nova versão)
2. Arquivo de hook extraído (se houver lógica)
3. Arquivo de tipos extraído (se houver tipos)
4. Arquivo de constantes extraído (se houver)
5. Arquivo de utils extraído (se houver)

Cada arquivo separadamente com comentários de estrutura.
```

### Exemplo: Refatorar AiPanel.tsx

```
Arquivo: frontend/src/components/AiPanel/AiPanel.tsx

[conteúdo do arquivo com 185 linhas, contendo:
- Renderização (92 linhas)
- Lógica de chat streaming (67 linhas)
- Validações (26 linhas)
]

Refatore para máximo 150 linhas.
```

**Resultado esperado:**
- `AiPanel.tsx` (150 linhas) - apenas renderização
- `hooks/useAiChat.ts` (80 linhas) - lógica de streaming
- `utils/aiValidation.ts` (30 linhas) - validações
- `types/ai.types.ts` (20 linhas) - tipos

---

## PROMPT 2: DEBUG

### Quando Usar
- Bug em qualquer fase
- Erro no navegador/console
- Comportamento inesperado
- Teste falhando
- Feature não funciona como esperado

### Formato Obrigatório

```
FASE: [X]
ERRO: [descrição do erro]
ARQUIVO: [caminho/arquivo.ts]
ESPERADO: [o que deveria acontecer]
ATUAL: [o que está acontecendo]

CONTEXTO:
[prints de erro / logs / stack trace / screenshots]

CÓDIGO ATUAL:
[trecho relevante do código]
```

### Regras Obrigatórias

1. **Diagnóstico Primeiro**
   - Não faça alterações sem entender a causa
   - Verifique dependências/imports
   - Verifique tipos
   - Verifique variáveis de ambiente

2. **Não Altere Arquitetura**
   - Corrija APENAS o problema
   - Não refatore junto
   - Não mude estrutura de pastas
   - Não reescreva componentes

3. **Não Crie Arquivos Extras**
   - Use APENAS os arquivos planejados para a fase
   - Se novo arquivo é necessário, mencione na resposta

4. **Escopo Mínimo**
   - Faça menos edições possível
   - Corrija raiz do problema, não sintoma
   - Teste a correção antes de finalizar

### Estrutura do Prompt

```
FASE: [número da fase]
ERRO: [descrição clara do erro]
ARQUIVO: [caminho do arquivo afetado]
ESPERADO: [resultado esperado]
ATUAL: [resultado atual]

CONTEXTO:
[stack trace ou screenshot ou descrição detalhada]

CÓDIGO ATUAL:
[trecho do código que está falhando]

SOLUÇÃO:
- Diagnóstico: [por que está acontecendo?]
- Correção: [como corrigir?]
- Teste: [como validar a correção?]

Corrija APENAS o problema. Não altere arquitetura.
```

### Exemplo: Bug em Domínios

```
FASE: 7
ERRO: Domínio customizado não passa em verificação DNS
ARQUIVO: backend/src/services/domainVerifier.ts
ESPERADO: Deve verificar CNAME e marcar como ativo
ATUAL: Sempre falha, marca como erro

CONTEXTO:
Log de erro:
  Error: dns.promises.resolveCname is not a function

CÓDIGO ATUAL:
```javascript
async verifyDNS(domain, expected) {
  const result = await dns.promises.resolveCname(domain);
  return result === expected;
}
```

Corrija o erro de importação/método do módulo DNS.
```

**Resposta esperada:**
```javascript
// Arquivo: backend/src/services/domainVerifier.ts
import * as dns from 'dns';
import {promisify} from 'util';

async verifyDNS(domain, expected) {
  const resolveCname = promisify(dns.resolveCname);
  const result = await resolveCname(domain);
  return result[0] === expected;  // resolveCname retorna array
}
```

---

## PROMPT 3: ADICIONAR NOVO ELEMENTO

### Quando Usar
- Adicionar novo tipo de elemento ao builder (ex: Card, Gallery, Testimonial)
- Expansão da biblioteca de componentes
- Solicitar após "ELEMENTO: [Nome]"

### Arquivos a Criar/Editar

```
Criando elemento: CARD

Arquivos a criar:
1. frontend/src/components/Elements/CardElement.tsx (componente renderizável)
2. frontend/src/constants/elements.constants.ts (entrada no registro)

Arquivos a editar:
1. frontend/src/types/element.types.ts (novo type de elemento)
2. backend/src/services/htmlGenerator.ts (caso HTML para publicação)
3. backend/src/services/cssGenerator.ts (geração de CSS)
4. backend/src/services/jsGenerator.ts (se interatividade necessária)
5. frontend/src/components/Editor/RightPanel.tsx (props do elemento)
```

### Estrutura do Prompt

```
Adicione novo elemento ao builder: [NOME]

TIPO DE ELEMENTO: [qual a função]
SCHEMA JSON:
{
  type: "card",
  id: "...",
  props: {
    title: "Título",
    description: "Descrição",
    image: "url",
    cta_text: "CTA",
    cta_link: "link"
  },
  style: {...}
}

HTML ESPERADO NA PUBLICAÇÃO:
[HTML esperado quando publicado]

FUNCIONALIDADES:
- Lista de features

Forneça:
1. CardElement.tsx (renderização no editor)
2. Atualização em element.types.ts
3. Atualização em elements.constants.ts
4. Atualização em htmlGenerator.ts (HTML para publicação)
5. Atualização em cssGenerator.ts (estilos)

Cada arquivo separadamente.
```

### Exemplo: Adicionar Elemento Card

```
Adicione novo elemento ao builder: CARD

TIPO: Componente reutilizável com imagem, título, descrição e CTA

SCHEMA:
{
  type: "card",
  props: {
    title: "Serviço de Família",
    description: "Proteção de direitos familiares",
    image: "url_imagem",
    cta_text: "Agendar",
    cta_link: "/contato"
  },
  style: {
    bgColor: "#ffffff",
    borderRadius: 8,
    padding: 20
  }
}

HTML ESPERADO:
<div class="lex-card">
  <img src="url" alt="card-image" />
  <h3>Serviço de Família</h3>
  <p>Proteção de direitos familiares</p>
  <a href="/contato" class="btn">Agendar</a>
</div>

FUNCIONALIDADES:
- Imagem responsiva
- Título e descrição customizáveis
- Botão CTA com link customizável
- Estilos customizáveis (cor, border, padding, shadow)

Forneça os 5 arquivos necessários.
```

**Resposta esperada incluirá:**

1. **CardElement.tsx**
```typescript
// Renderização no editor
// Props editáveis no RightPanel
// Preview em tempo real
// ~80 linhas
```

2. **element.types.ts** - nova entrada
```typescript
type CardElement = {
  type: 'card';
  props: {
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  style: CardStyle;
};
```

3. **elements.constants.ts** - novo registro
```typescript
{
  type: 'card',
  name: 'Card',
  icon: 'card-icon',
  category: 'Components',
  defaultProps: {...}
}
```

4. **htmlGenerator.ts** - novo case
```typescript
case 'card':
  return `<div class="lex-card">...</div>`;
```

5. **cssGenerator.ts** - novo case
```typescript
case 'card':
  return `.lex-card { background: ${props.bgColor}; ... }`;
```

---

## CHECKLIST DE SUPORTE

### Antes de Refatorar
- [ ] Arquivo > 150 linhas (React) ou > 200 (Backend)?
- [ ] 1 responsabilidade por arquivo?
- [ ] Testes passam antes?

### Antes de Debugar
- [ ] Erro está claramente descrito?
- [ ] Stack trace ou logs fornecidos?
- [ ] Comportamento esperado vs atual explicado?
- [ ] Código relevante mostrado?

### Antes de Adicionar Elemento
- [ ] Schema JSON completo?
- [ ] HTML esperado definido?
- [ ] Todos os 5 arquivos serão tocados?
- [ ] Funcionalidades listadas?

---

## DICAS GERAIS

### 1. Sempre Mostre Código de Cada Arquivo Separadamente
```
❌ NÃO:
{refactor summary}
// componente refatorado aqui...

✅ SIM:
---
ARQUIVO 1: AiPanel.tsx
[código completo]

---
ARQUIVO 2: hooks/useAiChat.ts
[código completo]

---
ARQUIVO 3: types/ai.types.ts
[código completo]
```

### 2. Diferencie Seções Claramente
- Use `---` ou `# ARQUIVO X` entre arquivos
- Indique linhas de código (ex: "linhas 45-67")
- Use ```typescript para blocos de código

### 3. Para Refatoração
- Liste extrações que fez
- Mostre imports necessários no arquivo principal
- Explique ganho de clareza/reutilização

### 4. Para Debug
- Sempre tente reproduzir primeiro
- Forneça correção MÍNIMA
- Explique por que o bug ocorria
- Sugira testes para validar

### 5. Para Novo Elemento
- Mantenha consistência com elementos existentes
- Siga padrão de nomes (camelCase props, CONSTANT_CASE tipos)
- Documente props com comentários
- Forneça exemplo de uso

---

## TEMPLATE RÁPIDO

### Template de Refatoração
```
Refatore [ARQUIVO] (atualmente [N] linhas)

Limites: [máximo de linhas]
Responsabilidades: [listar)
Extrair para:
- hooks/ → [qual lógica]
- types/ → [quais tipos]
- constants/ → [quais constantes]
- utils/ → [quais funções]

Arquivo atual:
[CONTEÚDO]
```

### Template de Debug
```
FASE: [X]
ERRO: [descrição]
ARQUIVO: [caminho]
ESPERADO: [comportamento correto]
ATUAL: [comportamento errado]

EVIDÊNCIA:
[log/screenshot]

CÓDIGO:
[trecho afetado]
```

### Template de Novo Elemento
```
Elemento: [NOME]
Função: [para que serve]

Schema:
{tipo, props, style}

HTML:
[código HTML esperado]

Features:
- [feature 1]
- [feature 2]

Arquivos a tocar: 5 (listar quais)
```

---

## INTEGRAÇÃO COM AS 11 FASES

| Fase | Possíveis Refatorações | Elementos Novos | Pontos de Debug Comum |
|------|------------------------|-----------------|----------------------|
| 1-5 | ComponenteBase, ElementFactory | Todos iniciais | Renderização, eventos |
| 6 | PublisherService, HtmlGenerator | - | Publicação, URLs |
| 7 | DomainVerifier, Controllers | - | DNS, Firebase |
| 8 | LexAiService | AiPanel | Streaming, rate limit |
| 9 | BindingRenderer, MassPublisher | - | Template resolution |
| 10 | AbAnalytics, abController | AbResultsDashboard | Z-test, cookie routing |
| 11 | AnalyticsController, Dashboard | LeadsTable, Charts | Métrica cálculos |

---

## EXEMPLO COMPLETO: Refatorando useAi.ts

**Prompt:**
```
Refatore frontend/src/hooks/useAi.ts (195 linhas)

Máximo 100 linhas. Extrair:
- useAiStream para lógica de streaming
- useAiRateLimit para gerenciamento de rate limit
- constants/aiPrompts.ts para prompts

Não altere funcionalidade.
```

**Resposta estruturada:**

```
---
ARQUIVO 1: hooks/useAi.ts (refatorado, 92 linhas)
import {useAiStream} from './useAiStream';
import {useAiRateLimit} from './useAiRateLimit';

export function useAi() {
  const stream = useAiStream();
  const rateLimit = useAiRateLimit();

  return {
    generateText: async (type, context) => {
      await rateLimit.checkLimit();
      return stream.generateStream(type, context);
    },
    // ...
  };
}

---
ARQUIVO 2: hooks/useAiStream.ts (novo, 76 linhas)
// Lógica de streaming
export function useAiStream() {
  // ...
}

---
ARQUIVO 3: hooks/useAiRateLimit.ts (novo, 58 linhas)
// Gerenciamento de rate limit
export function useAiRateLimit() {
  // ...
}

---
ARQUIVO 4: constants/aiPrompts.ts (novo, 43 linhas)
// Prompts
export const AI_PROMPTS = {
  headline: "...",
  bio: "..."
};

---
SUMMARY:
✅ useAi.ts reduzido de 195 para 92 linhas (47%)
✅ 3 responsabilidades separadas
✅ Imports ajustados
✅ Funcionalidade preservada
```

---

## NOTAS FINAIS

- **Paciência:** Debug às vezes requer múltiplas tentativas
- **Incremental:** Refatore e teste pequenos trechos
- **Documentação:** Atualize comentários após mudanças
- **Testes:** Sempre rode testes antes/depois
- **Escalabilidade:** Pense em padrões reutilizáveis
