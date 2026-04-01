# LEX_SITE01 — Fase 0: Contexto Inicial + Regras de Interface

## Título
LEX_SITE01 — Fase 0: Contexto Inicial + Regras de Interface

## Objetivo
Definir o projeto completo, validar stack tecnológico, e estabelecer as 7 regras de interface imutáveis que guiarão toda a experiência do usuário no editor visual.

## Dependência
Nenhuma — Esta é a fase inicial do projeto.

---

## Contexto do Projeto

### Escopo
- **Módulo**: LexOnline Builder v9.0 (Criador de Páginas)
- **Público-alvo**: Advogados, escritórios jurídicos, agências de marketing jurídico
- **Objetivo**: Permitir criação visual drag-and-drop de landing pages, sites institucionais e páginas de captura
- **Diferencial**: Templates e blocos especializados para jurídico (Áreas de Atuação, Perfil de Advogado, FAQ Jurídico, Agendamento de Consulta)

### Público-Alvo
1. **Advogados solo**: Criam landing page de apresentação + captura de leads
2. **Escritórios pequenos**: 3-10 pessoas, múltiplas páginas de serviços
3. **Agências**: Criam sites para múltiplos clientes advogados

### Limites por Plano
- **Essencial**: 5 páginas, 0 domínios customizados
- **Profissional**: 20 páginas, 3 domínios customizados
- **Agência**: Ilimitado

---

## 7 Regras de Interface Imutáveis

### REGRA 1: SIDEBAR — Hover-Only (0 → 280px)
**Comportamento**:
- Sidebar está **colapsado por padrão** (width = 0px)
- Ao **mouseenter na borda esquerda ou hover em ícone**: expande para 280px suavemente em 200ms
- Ao **mouseleave**: fecha **IMEDIATAMENTE** (sem delay, sem transição)
- Quando **RightPanel está aberto**: sidebar width = 0 permanentemente (não aceita hover)

**Conteúdo**:
- Título: "Elementos"
- **Search bar** no topo (busca por categoria ou nome)
- Categorias de blocos (apenas títulos, sem expansão automática):
  - Texto
  - Mídia
  - Interação
  - Formulário
  - Layout
  - Marketing
  - Social
  - Avançado
- **Primeira categoria aberta** por padrão, restantes fechadas
- Clique em categoria: toggle open/close
- **IMPORTANTE**: Sidebar NÃO contém elementos individuais — eles aparecem EXCLUSIVAMENTE no canvas pelo botão "+"

**Visual**:
```
┌─────────────────────┐
│ Elementos     [🔍]  │  ← Search
├─────────────────────┤
│ ▼ Texto             │  ← Aberta
│ ▶ Mídia             │  ← Fechada
│ ▶ Interação         │
│ ▶ Formulário        │
│ ▶ Layout            │
│ ▶ Marketing         │
│ ▶ Social            │
│ ▶ Avançado          │
└─────────────────────┘
```

### REGRA 2: ADIÇÃO DE BLOCOS — Exclusivamente pelo "+" no Canvas
**Comportamento**:
- Botão "+" aparece em **dois lugares**:
  1. **Entre blocos** (ao hover sobre espaço entre 2 blocos)
  2. **Fixo no final** do canvas (abaixo do último bloco)
- Clique em "+": abre **AddBlockPanel** (overlay no lado esquerdo ou centro)
- AddBlockPanel mostra:
  - Tabs por categoria (Texto, Mídia, etc)
  - Grid de blocos pré-montados
  - Botão "✦ Criar do Zero" (abre seletor de 6 layouts de coluna)

**IMPORTANTE**: Sidebar NÃO tem blocos individuais — APENAS categorias de tipos de blocos.

**Visual**:
```
Bloco 1
  [+] ← Hover entre blocos
Bloco 2
  [+]
Bloco 3
  [+] ← Fixo no final
```

### REGRA 3: CLIQUE EM BLOCO — Controles Flutuantes Apenas
**Comportamento**:
- Clique em área **vazia do bloco** (não em elemento interno):
  - ✅ Exibe barra flutuante com controles: **↑ ↓ Duplicar Excluir ⚙**
  - ❌ NÃO abre painel direito
  - ❌ Sidebar NÃO fecha (se estava aberta por hover)
- Clicar **fora do bloco**: controles desaparecem
- ⚙ (engrenagem): Abre **BlockSettings** (mini painel com opções do bloco)

**Controles Flutuantes**:
```
┌─────────────────────────────────────┐
│ ↑ ↓ [Dup] [Del]  ⚙                 │  ← Barra flutuante no topo
├─────────────────────────────────────┤
│                                     │
│   Conteúdo do bloco...              │
│                                     │
└─────────────────────────────────────┘
```

### REGRA 4: PAINEL DIREITO — Abre SOMENTE ao Clicar em Elemento Interno
**Comportamento**:
- **Clique em texto, imagem, botão, etc dentro de um bloco**:
  - ✅ Abre RightPanel (320px, lado direito)
  - ✅ Sidebar some (width = 0)
  - ✅ Controles flutuantes do bloco desaparecem
  - Painel mostra: Tipo de elemento + Style Editor (cor, fonte, tamanho) + Content Editor
- **Clique fora do RightPanel** (no canvas): painel fecha, sidebar volta ao estado anterior
- **Navegação entre elementos**: Clique em outro elemento → RightPanel atualiza dinamicamente

**Visual**:
```
┌────────────┬──────────────────────┬──────────────┐
│            │                      │              │
│            │    CANVAS            │ RightPanel   │
│ Sidebar=0  │                      │ (320px)      │
│ (oculto)   │                      │              │
│            │                      │              │
└────────────┴──────────────────────┴──────────────┘
```

### REGRA 5: EDIÇÃO DE TEXTO — Duplo Clique + Campo Sincronizado
**Comportamento**:
- **Duplo clique em texto**: ativa modo **contenteditable inline**
  - Fundo levemente destacado
  - Cursor piscando
  - Pressionar **Esc** ou clicar fora: sai do modo edit
- **Campo de texto no RightPanel**: mostra o mesmo conteúdo
  - Editar no campo: atualiza o texto no canvas automaticamente via `dispatch(UPDATE_ELEMENT)`
  - Editar inline: atualiza o campo no painel automaticamente
  - Sincronização bidirecional em tempo real (sem debounce para UX fluida)

**Visual**:
```
Canvas (inline edit)        RightPanel
┌──────────────────┐       ┌──────────────┐
│ Título aqui│     │       │ Conteúdo:    │
│                  │       │ [Título aqui]│
└──────────────────┘       └──────────────┘
```

### REGRA 6: SALVAMENTO — Toggle Auto-save + Modal de Confirmação
**Comportamento**:
- **Toggle Auto-save na TopBar** (ligado por padrão):
  - ✅ Ligado: salva automaticamente a cada 2 segundos (debounce)
    - Indicador visual: "✓ Salvo" em verde após cada save
    - Se houver erros: "✗ Erro ao salvar" em vermelho
  - ❌ Desligado: desabilita auto-save, botão "Salvar" manual aparece na TopBar
- **Publicar com alterações não salvas**:
  - Modal confirmação: "Você tem alterações não salvas. Salvar e publicar?"
  - Botões: [Salvar e Publicar] [Cancelar]

**Visual TopBar**:
```
┌──────────────────────────────────────────────────┐
│ ← Páginas │ Título │ [Device] [AutoSave Toggle] │
│                                  ✓ Salvo        │  ← Indicador
└──────────────────────────────────────────────────┘
```

### REGRA 7: TEMPLATES — Página Separada /page/templates (Nunca Modal)
**Comportamento**:
- **Não há modal de templates**
- Templates em página dedicada: **`/page/templates`**
- **Header**: Botão "← Voltar" (volta para /page/gallery) + "Escolha um Template"
- **Filtros**: Todos | Landing Page | Site Institucional | Captura | Vendas | Jurídico
- **Hover em card de template**:
  - Thumbnail expande 110% de tamanho
  - Overlay com botões: [Preview] [Usar este template]
- **Clique em [Preview]**: full-screen preview
  - Barra no topo: "← Voltar aos templates" + "Usar este template"
  - Pressionar **Esc** ou clicar seta: volta à galeria de templates
- **Clique em [Usar este template]**: cria nova página com este template, redireciona `/editor/:id`

**Visual Fluxo**:
```
PagesGallery                TemplatesPage              TemplatePreview
  ├─ Card 1               ├─ Header: Voltar + Title   ├─ Full-screen
  ├─ Card 2               ├─ Filtros                  ├─ Toolbar: Voltar + Usar
  └─ "+ Nova Página"      ├─ Grid 3 colunas          └─ Esc fecha
      │                   │   ├─ Card hover expand
      └──────────────────→│   ├─ [Preview] [Usar]      │
                          │   └─ Card                  ↑
                          │                           (clica Preview)
                          └────────────────────────────┘
```

---

## Regras de Código (7 Regras + Padrões)

### 1. Máximo de Linhas por Arquivo
- **Componentes React**: 150 linhas (sem imports/types)
- **Hooks**: 150 linhas
- **Services/APIs**: 150 linhas
- **Controllers Backend**: 150 linhas
- **Arquivos de constantes/tipos**: sem limite

### 2. Um Arquivo = Uma Responsabilidade
- 1 arquivo = 1 componente React OU 1 hook OU 1 service OU 1 tipo
- Não misturar lógica: componente + hook no mesmo arquivo = ❌

### 3. Estrutura de Pastas Padronizada
```
frontend/src/
├── components/          (UI reutilizáveis, máx 150 linhas)
├── page/                (páginas/rotas, componentes grandes)
├── hooks/               (custom hooks, máx 150 linhas)
├── services/            (API calls, máx 150 linhas)
├── types/               (interfaces TypeScript)
├── constants/           (valores fixos: BLOCK_TYPES, DEVICE_SIZES, etc)
├── utils/               (funções auxiliares)
├── stores/              (Context + Reducer)
└── assets/              (imagens, fonts)

backend/src/
├── routes/              (Express routes)
├── controllers/         (request handlers, máx 150 linhas)
├── services/            (business logic, máx 150 linhas)
├── models/              (Prisma interactions)
├── middleware/          (auth, validation, error)
├── types/               (interfaces)
├── constants/           (valores fixos)
├── utils/               (helpers)
└── config/              (env, database)
```

### 4. TypeScript Obrigatório — Sem "any"
```typescript
// ✅ CORRETO
interface PageProps {
  id: string;
  title: string;
  schema: PageSchema;
}

function PageEditor({ id, title, schema }: PageProps) {
  return <div>{title}</div>;
}

// ❌ ERRADO
function PageEditor(props: any) {
  return <div>{props.title}</div>;
}

// ❌ ERRADO
const updateElement = (data: any) => { ... }
```

### 5. Nomes Consistentes
- **Componentes React**: `PascalCase` (ex: `PageEditor.tsx`, `BlockWrapper.tsx`)
- **Hooks**: `use` prefixo (ex: `usePages.ts`, `useEditorState.ts`)
- **Tipos**: sufixo `.types.ts` (ex: `page.types.ts`, `block.types.ts`)
  ```typescript
  // Em page.types.ts
  export interface Page { ... }
  export interface PageSchema { ... }
  export type PageStatus = 'draft' | 'published' | 'archived';
  ```
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_PAGES_ESSENTIAL = 5`)
- **Serviços/APIs**: sufixo `Api` ou `Service` (ex: `pageApi.ts`, `blockService.ts`)
- **Arquivos de constantes**: sufixo `.constants.ts` (ex: `blocks.constants.ts`)

### 6. Imports Organizados
```typescript
// 1. React + bibliotecas
import React, { useState, useReducer } from 'react';
import axios from 'axios';

// 2. Tipos (use import type para otimizar bundle)
import type { Page, PageSchema } from '@/types/page.types';

// 3. Componentes
import { PageEditor } from '@/page/PageEditor';
import { BlockWrapper } from '@/components/BlockWrapper';

// 4. Hooks e utils
import { usePages } from '@/hooks/usePages';
import { cn } from '@/utils/cn';

// 5. Assets
import logoUrl from '@/assets/logo.png';
```

### 7. Path Aliases
- Usar `@/` para imports do `src/` root
- Configurar em `vite.config.ts` e `tsconfig.json`
```typescript
// Em vite.config.ts
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
  },
}
```

---

## Validação de Projeto

Antes de prosseguir para Fase 1, validar:

### ✅ Stack Tecnológico
- [ ] Frontend: React 19, TypeScript 5, Vite 6, Tailwind CSS 3
- [ ] Backend: Node.js 20, Express.js 4, TypeScript 5, Prisma 5
- [ ] Database: PostgreSQL 15 via Neon.tech
- [ ] Storage: Firebase Storage + Hosting
- [ ] IA: Anthropic Claude API
- [ ] Auth: JWT com HttpOnly cookies

### ✅ 7 Regras de Interface
- [ ] REGRA 1: Sidebar hover-only (0→280px), fecha imediatamente
- [ ] REGRA 2: Blocos APENAS via botão "+" no canvas
- [ ] REGRA 3: Clique em bloco = controles flutuantes (sem painel)
- [ ] REGRA 4: Painel direito SOMENTE ao clicar elemento interno
- [ ] REGRA 5: Edição de texto duplo-clique + sincronização
- [ ] REGRA 6: Auto-save toggle + modal confirmação
- [ ] REGRA 7: Templates em /page/templates (página separada, não modal)

### ✅ Regras de Código
- [ ] Máximo 150 linhas por componente/hook/service
- [ ] 1 arquivo = 1 responsabilidade
- [ ] Estrutura de pastas padronizada
- [ ] TypeScript sem "any"
- [ ] Nomes consistentes (PascalCase, useHook, CONSTANT)
- [ ] Imports organizados
- [ ] Path aliases `@/`

---

## Arquivos a Validar/Criar na Fase 0

Nenhum arquivo é criado na Fase 0. Esta é uma fase de planejamento e validação.

### Checklist de Validação
- [ ] Revisar LEX_SITE00.md (visão geral + stack)
- [ ] Confirmar as 7 regras de interface com stakeholders
- [ ] Validar limites por plano (Essencial 5 páginas, etc)
- [ ] Confirmar estrutura de pastas
- [ ] Preparar templates PostgreSQL SQL para Fase 1

---

## Critérios de Aceite

### ✅ Fase 0 Completa Quando:
1. **Stack validado**: Todas as tecnologias confirmadas e documentadas
2. **7 regras de interface aprovadas**: Nenhuma alteração até Fase 3
3. **Regras de código estabelecidas**: Equipe alinhada
4. **Limites de plano definidos**: Essencial (5), Profissional (20), Agência (ilimitado)
5. **Estrutura de pastas criada**: Pastas vazias, pronta para Fase 1

### ✅ Output Esperado:
- LEX_SITE00.md validado
- LEX_SITE01.md (este documento) validado
- Pasta `frontend/src/` com subpastas vazias
- Pasta `backend/src/` com subpastas vazias
- `tsconfig.json` e `vite.config.ts` configurados com path aliases

---

## Próxima Fase

**Fase 1**: Menu + Banco de Dados
- Criar item "Páginas" no sidebar principal
- Implementar 8 tabelas PostgreSQL
- Popular 15 templates padrão
- Setup API routes básicas

