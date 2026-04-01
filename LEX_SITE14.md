# LEX_SITE14 — Fase 9: Collections — Páginas Dinâmicas

## Objetivo
Implementar sistema de Collections (similar ao Webflow), permitindo criar páginas dinâmicas a partir de dados estruturados, como lista de áreas de atuação, equipe de advogados, jurisprudência, etc.

## Dependência
- **Fase 6** (Editor Responsivo + Publicação)

## Status de Desenvolvimento
- ⏳ Planejado
- 📋 Arquivos: 7 componentes/serviços/SQL
- 🎯 Prazo estimado: 14 dias

---

## Arquitetura de Arquivos

### Backend - SQL

#### `backend/sql/create_collections.sql`
Scripts de criação de tabelas do sistema de Collections.

```sql
-- Tabela de Collections (grupos de dados)
CREATE TABLE collections (
  id VARCHAR(36) PRIMARY KEY,
  site_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSON NOT NULL,  -- [{name, type, required, default}]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
  UNIQUE KEY unique_slug (site_id, slug)
);

-- Tabela de campos da Collection
CREATE TABLE collection_fields (
  id VARCHAR(36) PRIMARY KEY,
  collection_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  type ENUM('text', 'textarea', 'number', 'email', 'url', 'date', 'image', 'select') DEFAULT 'text',
  required BOOLEAN DEFAULT FALSE,
  default_value VARCHAR(500),
  options JSON,  -- Para tipo select: [{ label, value }]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

-- Tabela de itens da Collection
CREATE TABLE collection_items (
  id VARCHAR(36) PRIMARY KEY,
  collection_id VARCHAR(36) NOT NULL,
  data JSON NOT NULL,  -- {titulo: "...", descricao: "...", imagem: "..."}
  order_index INT DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

-- Tabela de template bindings (vinculação entre template e collection)
CREATE TABLE template_bindings (
  id VARCHAR(36) PRIMARY KEY,
  page_id VARCHAR(36) NOT NULL,
  collection_id VARCHAR(36) NOT NULL,
  template_element_id VARCHAR(36) NOT NULL,  -- qual elemento é o template
  url_pattern VARCHAR(500),  -- ex: "/{{ slug }}" ou "/{{ area.slug }}"
  output_folder VARCHAR(500),  -- onde gerar as páginas dinâmicas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_collection_site ON collections(site_id);
CREATE INDEX idx_items_collection ON collection_items(collection_id);
CREATE INDEX idx_bindings_page ON template_bindings(page_id);
CREATE INDEX idx_bindings_collection ON template_bindings(collection_id);
```

### Backend - Controllers

#### `backend/src/controllers/collectionsController.ts`
Controlador CRUD de Collections e Items.

**Rotas:**

```
GET /api/collections
├── Retorna todas as collections do site
└── Response: [{id, name, slug, fieldCount, itemCount}]

POST /api/collections
├── Body: {name, slug, fields: [{name, type, required}]}
├── Cria nova collection
└── Response: {id, name, slug, fields}

GET /api/collections/:id
├── Retorna detalhes de uma collection
└── Response: {id, name, fields, items: [{id, data, order}]}

PUT /api/collections/:id
├── Body: {name, fields}
├── Atualiza metadados da collection
└── Response: {id, name, fields}

DELETE /api/collections/:id
├── Remove collection e todos os itens
└── Response: {success: true}

---

POST /api/collections/:id/items
├── Body: {data: {titulo: "...", descricao: "..."}
├── Cria novo item
└── Response: {id, data, order_index}

GET /api/collections/:id/items
├── Query params: page, limit, sort
├── Retorna itens paginados
└── Response: {items: [...], total, page, pageSize}

PUT /api/collections/:id/items/:itemId
├── Body: {data: {...}}
├── Atualiza item
└── Response: {id, data}

DELETE /api/collections/:id/items/:itemId
├── Remove item
└── Response: {success: true}

---

POST /api/collections/:id/publish-all
├── Gera página estática para cada item
├── Usa bindingRenderer.resolveTemplate()
└── Response: {pages_generated: 42, duration_ms: 2500}

POST /api/collections/:id/reorder
├── Body: {items: [{id, order_index}]}
├── Reordena itens
└── Response: {success: true}
```

### Backend - Services

#### `backend/src/services/bindingRenderer.ts`
Serviço de resolução de variáveis e templates dinâmicos.

**Métodos principais:**

```typescript
// Resolve {{variável}} em string
function resolveBindings(
  template: string,
  data: Record<string, any>
): string {
  // "Bem-vindo {{nome}}" + {nome: "João"} => "Bem-vindo João"
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return data[key] ?? match;
  });
}

// Resolve {{#if condição}}...{{/if}} (condicionais simples)
function resolveConditionals(template: string, data: Record<string, any>): string {
  const conditionalRegex = /{{\s*#if\s+(\w+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g;
  return template.replace(conditionalRegex, (match, condition, content) => {
    return data[condition] ? content : '';
  });
}

// Renderiza página completa com um item de collection
async function renderPageWithCollectionItem(
  pageJSON: PageStructure,
  collectionData: Record<string, any>
): Promise<string> {
  // 1. Substitui variáveis no JSON
  const substitutedJSON = JSON.stringify(pageJSON).replaceAll(
    /{{\s*(\w+)\s*}}/g,
    match => collectionData[match] ?? match
  );

  // 2. Resolve condicionais
  const resolvedJSON = resolveConditionals(substitutedJSON, collectionData);

  // 3. Converte HTML e retorna
  return htmlGenerator.generateHtml(JSON.parse(resolvedJSON));
}
```

**Schema de resolução:**

```
Input Template Element:
{
  type: "text",
  content: "Especialista em {{area}}",
  bindings: ["area"]
}

Input Collection Item:
{
  area: "Direito Trabalhista",
  descricao: "Especialista em rescisão indevida"
}

Output Rendered:
{
  type: "text",
  content: "Especialista em Direito Trabalhista"
}
```

#### `backend/src/services/massPublisher.ts`
Serviço de geração em massa de páginas estáticas a partir de Collections.

**Métodos:**

```typescript
async publishCollectionPages(
  pageId: string,
  collectionId: string,
  templateBindingId: string
): Promise<PublishResult> {
  // 1. Buscar binding para saber URL pattern
  const binding = await templateBindings.findById(templateBindingId);

  // 2. Buscar collection items
  const items = await collectionItems.findByCollectionId(collectionId);

  // 3. Para cada item, renderizar e publicar
  const results = [];
  for (const item of items) {
    const url = this.generateUrlFromPattern(binding.url_pattern, item.data);
    const htmlContent = await bindingRenderer.renderPageWithCollectionItem(
      pageJSON,
      item.data
    );

    // Publicar em Firebase Hosting
    await firebaseHosting.publishPage(url, htmlContent);
    results.push({itemId: item.id, url, status: 'success'});
  }

  return {
    pages_generated: items.length,
    pages: results,
    duration_ms: Date.now() - startTime
  };
}

// Exemplo: "/areas/{{slug}}" + {slug: "trabalhista"} => "/areas/trabalhista"
private generateUrlFromPattern(pattern: string, data: Record<string, any>): string {
  return pattern.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return data[key] ?? match;
  });
}
```

### Frontend

#### `frontend/src/page/collections/CollectionsPage.tsx`
Página principal de gerenciamento de Collections.

**Seções:**

1. **Cabeçalho com botão "Nova Collection"**
   ```
   [+ Nova Collection]
   ```

2. **Tabela de Collections**
   ```
   Nome | Slug | Campos | Itens | Ações
   ─────────────────────────────────────
   Áreas de Atuação | areas | 3 | 12 | [Editar] [Publicar] [×]
   Equipe | equipe | 4 | 5 | [Editar] [Publicar] [×]
   ```

3. **Ações por Collection:**
   - Editar: Abre CollectionEditor
   - Publicar: Abre diálogo de configuração (URL pattern, folder)
   - Excluir: Confirmação

#### `frontend/src/page/collections/CollectionEditor.tsx`
Editor de campos e template binding de uma Collection.

**Fluxo:**

```
1. Criar Collection "Áreas de Atuação"
   └─ Adicionar campo: "titulo" (text, required)
   └─ Adicionar campo: "descricao" (textarea)
   └─ Adicionar campo: "imagem" (image)
   └─ Salvar Collection

2. Adicionar itens (em ItemsTable)
   └─ Trabalhista | Especialista em rescisão... | [img] | [Edit] [×]
   └─ Cível | Causas de natureza cível... | [img] | [Edit] [×]
   └─ Criminal | Defesa em crimes... | [img] | [Edit] [×]

3. Vincular template (Template Binding)
   └─ Selecionar página de destino: "Página Modelo"
   └─ Selecionar elemento template: "Card de Área"
   └─ URL pattern: "/areas/{{ slug }}"
   └─ [Publicar todas]
```

#### `frontend/src/page/collections/ItemsTable.tsx`
Tabela de itens da Collection com CRUD inline.

**Funcionalidades:**

- Tabela com colunas dinâmicas (baseado em fields da collection)
- Botões de editar/deletar cada item
- Modal de edição de item
- Reordenação via drag-drop

**Estrutura:**

```
┌─────────────────────────────────────────────────────┐
│ Áreas de Atuação > Itens                            │
├─────────────────────────────────────────────────────┤
│ [+ Novo item]                                       │
├─────────────────────────────────────────────────────┤
│ Titulo | Descricao | Imagem | Ações                │
├─────────────────────────────────────────────────────┤
│ Trabalhista | Rescisão indevida | [img] | [✎] [×] │
│ Cível | Ações ordinárias | [img] | [✎] [×] │
└─────────────────────────────────────────────────────┘
```

#### `frontend/src/hooks/useCollections.ts`
Hook customizado para gerenciamento de Collections.

**State:**

```typescript
{
  collections: Collection[];
  currentCollection: Collection | null;
  items: CollectionItem[];
  loading: boolean;
  error: string | null;
  publishingProgress: {
    total: number;
    completed: number;
    status: 'idle' | 'publishing' | 'done';
  };
}
```

**Funções:**

- `async fetchCollections(): Promise<void>`
- `async createCollection(name: string, fields: Field[]): Promise<Collection>`
- `async updateCollection(id: string, data: Partial<Collection>): Promise<void>`
- `async deleteCollection(id: string): Promise<void>`
- `async addItem(collectionId: string, data: Record<string, any>): Promise<CollectionItem>`
- `async updateItem(collectionId: string, itemId: string, data: Record<string, any>): Promise<void>`
- `async deleteItem(collectionId: string, itemId: string): Promise<void>`
- `async publishAllPages(collectionId: string, templateBindingId: string): Promise<PublishResult>`
- `async reorderItems(collectionId: string, newOrder: {id, order}[]): Promise<void>`

---

## Fluxo Completo: Criando Áreas de Atuação

### Passo 1: Criar Collection
```
CollectionsPage → [+ Nova Collection]
    ↓
Modal: Nome = "Áreas de Atuação", Slug = "areas"
    ↓
Adicionar Campos:
  1. titulo (text, required)
  2. descricao (textarea)
  3. imagem (image)
    ↓
POST /api/collections {name, slug, fields}
    ↓
Collection criada com ID = "col_123"
```

### Passo 2: Adicionar Itens
```
CollectionsPage → Áreas de Atuação → Itens
    ↓
ItemsTable com campos dinâmicos
    ↓
[+ Novo item]
    ↓
Modal com 3 inputs: titulo, descricao, imagem
    ↓
POST /api/collections/col_123/items {data}
    ↓
Item criado com ID = "item_1"
Repetir para Cível, Criminal, etc.
```

### Passo 3: Configurar Template
```
Editar página de template: "Página Modelo - Áreas"
    ↓
Existem elementos:
  - Section "Área"
  - Text "{{titulo}}"
  - Text "{{descricao}}"
  - Image "{{imagem}}"
    ↓
RightPanel → [Vincular Collection]
    ↓
Selecionar: Collection = "Áreas", Seção template = "Área"
    ↓
URL pattern: "/areas/{{ slug }}"
    ↓
POST /api/collections/col_123/publish-all
```

### Passo 4: Publicação em Massa
```
massPublisher.publishCollectionPages()
    ↓
Para cada item em Áreas:
  {titulo: "Trabalhista", slug: "trabalhista", imagem: "..."}
    ↓
bindingRenderer.renderPageWithCollectionItem(pageJSON, itemData)
    ↓
Substitui {{titulo}} → "Trabalhista"
Substitui {{imagem}} → URL da imagem
    ↓
Gera HTML estático
    ↓
Firebase publica em "/areas/trabalhista"
    ↓
POST /api/collections/col_123/publish-all retorna:
{
  pages_generated: 5,
  pages: [
    {itemId: "item_1", url: "/areas/trabalhista", status: "success"},
    {itemId: "item_2", url: "/areas/civil", status: "success"},
    ...
  ],
  duration_ms: 3200
}
```

### Resultado
```
Usuário acessa: meustudio.lexonline.com.br/areas/trabalhista
    ↓
Carrega página estática com:
  - Título: "Trabalhista"
  - Descrição: "Especialista em rescisão indevida"
  - Imagem: foto do serviço
    ↓
Página SEO-otimizada, com URL estruturada
```

---

## Tipos e Interfaces

```typescript
// Collection
interface Collection {
  id: string;
  name: string;
  slug: string;
  fields: Field[];
  created_at: Date;
}

// Field
interface Field {
  name: string;
  slug: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'url' | 'date' | 'image' | 'select';
  required: boolean;
  default?: string;
  options?: {label: string, value: string}[];
}

// CollectionItem
interface CollectionItem {
  id: string;
  collection_id: string;
  data: Record<string, any>;
  order_index: number;
  published: boolean;
  created_at: Date;
}

// TemplateBinding
interface TemplateBinding {
  id: string;
  page_id: string;
  collection_id: string;
  template_element_id: string;
  url_pattern: string;
  output_folder: string;
}
```

---

## Critérios de Aceitação

- [ ] Collection criada com campos customizados (text, textarea, image, etc)
- [ ] Adição de itens funciona com validação de campos required
- [ ] Template resolve {{variável}} corretamente ao renderizar
- [ ] Condicionais {{#if campo}}...{{/if}} funcionam
- [ ] publish-all gera uma página estática por item
- [ ] URLs dinâmicas seguem padrão /{{ slug }} ou /{{ area.slug }}
- [ ] Páginas publicadas são acessíveis via URL gerada
- [ ] Reordenação de itens altera a ordem de publicação
- [ ] Deletar item não gera a página correspondente
- [ ] Dashboard mostra progresso de publicação em massa

---

## Notas Técnicas

- **Renderização:** bindingRenderer resolve variáveis ANTES de gerar HTML
- **URL Patterns:** Suportar {{fieldName}} para substituição dinâmica
- **Limite de itens:** Sem limite técnico, mas avisar em UI após 1000
- **Performance:** publish-all com 100+ itens roda assincronamente em background
- **Backup:** Manter histórico de publicações para rollback
- **Cache:** Cachear páginas dinâmicas por 1 hora no CDN
