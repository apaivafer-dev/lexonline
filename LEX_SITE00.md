# LEX_SITE00 — Visão Geral do Projeto

## Título
LEX_SITE00 — Visão Geral do Projeto

## Descrição
LexOnline Builder v9.0 — Módulo Criador de Páginas para Advogados

Um editor visual drag-and-drop especializado para marketing jurídico, permitindo que advogados e escritórios criem landing pages, sites institucionais e páginas de captura sem conhecimento técnico.

---

## Objetivo
Construir um editor visual drag-and-drop estilo GreatPages/Webflow, especializado para marketing jurídico, com suporte a múltiplas páginas por projeto, publicação em domínios customizados e analytics integrado.

---

## Arquitetura: 3 Pilares

### 1. Page Schema (JSON/JSONB no PostgreSQL)
- Estrutura hierárquica: `Page > Sections > Columns > Elements`
- Cada elemento contém: `id, type, styles (Tailwind classes), content (texto/HTML), metadata`
- Versionamento completo de cada página
- Suporte a templates reutilizáveis

### 2. State Engine (React State + useReducer)
- Gerenciamento de estado único e previsível
- Actions: `ADD_BLOCK, REMOVE_BLOCK, UPDATE_ELEMENT, UNDO, REDO, SET_DEVICE, AUTO_SAVE`
- Histórico de edições com undo/redo (até 50 passos)
- Debounce de 2 segundos para auto-save

### 3. Renderer (Node.js Cloud Function)
- Converte JSON em HTML/CSS/JS estático
- Gera 3 arquivos: `index.html`, `styles.css`, `scripts.js`
- Minificação automática
- Deploy para Firebase Hosting + CDN Google

---

## Fluxo Principal

```
Editor React SPA
  ↓
auto-save debounce 2s
  ↓
PostgreSQL JSONB (atualiza página_schema)
  ↓
Publicar (trigger)
  ↓
htmlGenerator + cssGenerator + jsGenerator
  ↓
minify + brotli compress
  ↓
Firebase Hosting CDN
  ↓
URL pública do cliente: https://cliente.lex-online.com
```

---

## Hierarquia de Dados

```
Page
├── id (UUID)
├── user_id (FK)
├── title
├── slug
├── status (draft|published|archived)
├── schema (JSONB) ← Array de Sections
│   └── Sections[]
│       ├── id
│       ├── type ("section")
│       ├── styles {backgroundColor, padding, ...}
│       └── columns[]
│           └── Columns[]
│               ├── id
│               ├── width (12-col grid: 1-12)
│               └── elements[]
│                   └── Elements[]
│                       ├── id
│                       ├── type (heroText|heroImage|benefits3|etc)
│                       ├── content
│                       └── styles
├── published_url
├── domain_id (FK)
├── created_at
├── updated_at
└── published_at
```

---

## Stack Tecnológico

### Frontend
- **Framework**: React 19 + TypeScript 5.x
- **Build**: Vite 6.x (otimizado para SPAs)
- **Styling**: Tailwind CSS 3.x + CSS Custom Properties
- **UI Icons**: Lucide React (Figma icons)
- **State Management**: useReducer + Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios com interceptadores JWT
- **Code Editor**: Monaco Editor (para código customizado)
- **Rich Text**: Tiptap (editor de texto avançado)
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/utilities

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15 via Neon.tech (serverless)
- **ORM**: Prisma 5.x (type-safe queries)
- **Authentication**: JWT com refresh tokens
- **File Storage**: Firebase Storage (images, assets)
- **Cloud Functions**: Firebase Cloud Functions (Node.js)
- **HTML Generation**: cheerio + @react-email/render
- **CSS Processing**: cssnano + postcss
- **HTML Minification**: html-minifier-terser
- **Image Optimization**: sharp (WebP, AVIF)
- **Compression**: brotli-compress
- **API Docs**: Swagger/OpenAPI 3.0

### Banco de Dados
- **Sistema**: PostgreSQL 15
- **Provider**: Neon.tech (serverless PostgreSQL)
- **ORM**: Prisma 5.x
- **Migrations**: Prisma Migrate
- **Backup**: Automático diário
- **Índices**: B-tree em colunas de query frequent

### Autenticação
- **Método**: JWT com HttpOnly cookies
- **Token TTL**: 15 minutos (access) + 7 dias (refresh)
- **Segurança**: CSRF protection, rate limiting
- **OAuth**: Google, Microsoft (opcional)

### Storage & Hosting
- **File Storage**: Firebase Storage (CDN integrado)
- **Hosting Estático**: Firebase Hosting
- **CDN Global**: Google Cloud CDN (233+ edge locations)
- **Cache**: 30 dias para arquivos estáticos, 1 hora para index.html

### Inteligência Artificial
- **Modelo**: Anthropic Claude API (claude-3-5-sonnet)
- **Use Cases**:
  - Geração de conteúdo jurídico (rascunho de textos)
  - Análise de SEO (sugestões de títulos, meta descriptions)
  - Correção de português (ortografia, gramática)
  - Geração de headlines e CTAs

### Image Processing
- **Library**: sharp (libvips)
- **Formatos**: WebP, AVIF, PNG, JPEG
- **Otimização**: Redimensionamento automático (mobile, tablet, desktop)
- **Compression**: LQIP (Low Quality Image Placeholder)

### Minificação & Compressão
- **HTML**: html-minifier-terser (remove comentários, whitespace)
- **CSS**: cssnano (remove duplicatas, otimiza cores)
- **JS**: esbuild (tree-shaking, minification)
- **Compressão**: Brotli (compression level 11)

---

## Regras de Código

### Arquivos React/Frontend

- **Máximo 150 linhas por componente** (sem tipos/imports)
- **1 arquivo = 1 responsabilidade**: 1 componente, 1 hook, 1 serviço, 1 tipo
- **Estrutura de pastas**:
  ```
  frontend/src/
  ├── components/       (UI reutilizáveis)
  ├── page/            (páginas/rotas completas)
  ├── hooks/           (custom hooks com lógica)
  ├── services/        (chamadas de API)
  ├── types/           (interfaces TypeScript)
  ├── constants/       (valores fixos)
  ├── utils/           (funções auxiliares)
  ├── stores/          (context + reducer)
  └── assets/          (imagens, fonts)
  ```

- **TypeScript**:
  - ✅ Tipos explícitos em funções
  - ✅ Interfaces para objetos complexos
  - ✅ Enums para strings constantes
  - ❌ Nunca use `any` ou `unknown` sem cast
  - ❌ Nunca use `as any`

- **Nomes**:
  - Componentes: `PascalCase` (ex: `PageEditor.tsx`)
  - Hooks: prefixo `use` (ex: `usePages.ts`)
  - Tipos: sufixo `.types.ts` (ex: `page.types.ts`)
  - Constantes: `UPPER_SNAKE_CASE` (ex: `blocks.constants.ts`)
  - Serviços: sufixo `Api` ou `Service` (ex: `pageApi.ts`)

- **Imports**:
  - Agrupe: React → bibliotecas → tipos → componentes → utils
  - Use `import type { }` para tipos
  - Path aliases: `@/components`, `@/types`, etc

### Backend/Node.js

- **Máximo 200 linhas por arquivo**
- **Controllers**: Máximo 150 linhas (lógica em services)
- **Separação clara**: routes → controllers → services → database
- **Erro Handling**: Try-catch com custom ErrorHandler
- **Validação**: Use Zod ou Joi em middleware
- **Logging**: Winston com níveis (error, warn, info, debug)
- **Estrutura**:
  ```
  backend/src/
  ├── routes/          (Express routes)
  ├── controllers/     (request handlers)
  ├── services/        (business logic)
  ├── models/          (Prisma schema interactions)
  ├── middleware/      (auth, validation, error)
  ├── types/           (interfaces)
  ├── constants/       (valores fixos)
  ├── utils/           (helpers)
  └── config/          (env, database)
  ```

### Gerenciamento de Estado

- **React useReducer** para state central
- **Context API** para propagação
- **Hooks** para lógica reutilizável
- **Sem Zustand/Redux/Pinia** no escopo inicial

### Testes

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **Coverage**: Mínimo 60% para funções críticas
- **E2E**: Playwright para fluxos críticos

---

## Mapa das 12 Fases com Dependências

```
FASE 0: Contexto Inicial + Regras de Interface
  ↓
FASE 1: Menu + Banco de Dados
  ↓
FASE 2: Galeria de Páginas + Templates
  ↓
FASE 3a: Layout Full-Screen do Editor
  ├→ FASE 3b: Blocos Inteligentes (30 Blocos)
  ├→ FASE 3c: Painel Direito de Edição
  ├→ FASE 3d: Undo/Redo + Histório
  └→ FASE 3e: Auto-save + Indicadores de Status
  ↓
FASE 4: Publicação em Domínios Customizados
  ↓
FASE 5: Sistema de Templates Jurídicos
  ↓
FASE 6: IA + Geração de Conteúdo
  ├→ FASE 8: Blocos Dinâmicos (Feeds, Agendamento)
  ├→ FASE 9: A/B Testing
  ├→ FASE 10: Analytics Integrado
  └→ FASE 11: Integração com CRM/Email
```

### Dependências Detalhadas
- `0` (Contexto): Nenhuma (inicial)
- `1` (Menu+DB): Requer `0`
- `2` (Galeria): Requer `1`
- `3a` (Layout): Requer `2`
- `3b` (Blocos): Requer `3a`
- `3c` (Painel): Requer `3b`
- `3d` (Undo): Requer `3c`
- `3e` (Auto-save): Requer `3d`
- `4` (Publicação): Requer `3e`
- `5` (Templates): Requer `4`
- `6` (IA): Requer `5`
- `8` (Dinâmicos): Requer `6`
- `9` (A/B): Requer `6`
- `10` (Analytics): Requer `6`
- `11` (Integrações): Requer `6`

---

## Limites por Plano de Preço

| Feature | Essencial | Profissional | Agência |
|---------|-----------|--------------|---------|
| Páginas | 5 | 20 | Ilimitado |
| Domínios customizados | 0 | 3 | Ilimitado |
| Templates | Todos (15) | Todos (15) | Todos (15) |
| Blocos dinâmicos | ❌ | ✅ | ✅ |
| A/B Testing | ❌ | ❌ | ✅ |
| Analytics avançado | ❌ | Básico | Completo |
| Integração CRM | ❌ | ❌ | ✅ |
| Suporte | Email | Chat | Dedicated |

---

## Segurança

- ✅ JWT com HttpOnly cookies (CSRF protection)
- ✅ Rate limiting: 100 requests/min por usuário
- ✅ SQL injection prevention: Prisma ORM + parameterized queries
- ✅ XSS prevention: React escapes automaticamente + sanitize HTML
- ✅ CORS: Whitelist de domínios confiáveis
- ✅ File upload validation: tipos permitidos, size limit 25MB
- ✅ Backup diário: PostgreSQL snapshots

---

## Performance

- **First Paint**: < 1s (Vite + code splitting)
- **Editor Load**: < 2s (React lazy loading)
- **Auto-save**: Debounce 2s, requisição < 500ms
- **Publicação**: < 5s (geração + upload + invalidação CDN)
- **Lighthouse Score**: Mínimo 90 (Performance, Accessibility, Best Practices)

---

## Próximos Passos

1. **Fase 0**: Validar stack, 7 regras de interface, estrutura de código
2. **Fase 1**: Criar menu de entrada + tabelas PostgreSQL + 15 templates
3. **Fase 2**: Interface de galeria + seleção de templates
4. **Fase 3**: Editor completo (layout + blocos + painel)
5. **Fase 4-11**: Publicação, templates, IA, dinâmicos, A/B, analytics, integrações
