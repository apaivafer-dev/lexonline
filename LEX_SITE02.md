# LEX_SITE02 — Fase 1: Menu + Banco de Dados (PostgreSQL)

## Título
LEX_SITE02 — Fase 1: Menu + Banco de Dados (PostgreSQL)

## Objetivo
Criar o ponto de entrada do módulo "Páginas" na navegação principal e implementar o banco de dados completo (8 tabelas, índices, constraints) com 15 templates pré-carregados. Setup inicial de API routes.

## Dependência
- Requer: **Fase 0** (validação de stack e regras)
- Bloqueia: Fase 2

---

## Arquivos a Criar/Editar

### Frontend
- [ ] `frontend/src/services/pageApi.ts` (novo)
- [ ] `frontend/src/page/gallery/PagesGallery.tsx` (novo, placeholder)
- [ ] `frontend/src/components/Sidebar.tsx` (editar: adicionar item "Páginas")

### Backend
- [ ] `backend/sql/create_page_tables.sql` (novo)
- [ ] `backend/src/controllers/pageController.ts` (novo)
- [ ] `backend/src/routes/page.routes.ts` (novo)

### Database
- [ ] Script de seed com 15 templates

---

## Tarefa 1: Menu — Adicionar Item "Páginas"

### Arquivo: `frontend/src/components/Sidebar.tsx` (EDITAR)

**Localizar** o componente Sidebar principal (menu de navegação) e adicionar item "Páginas":

```typescript
// frontend/src/components/Sidebar.tsx

import { Layout, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { label: 'Páginas', icon: Layout, href: '/page' },  // ← NOVO
    // ... outros itens
  ];

  return (
    <nav className="w-64 bg-slate-900 text-white p-4">
      {menuItems.map((item) => {
        const isActive = location.pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition',
              isActive ? 'bg-blue-600' : 'hover:bg-slate-800'
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

**Ícone**: Use `Layout` do Lucide React (representa páginas/layout)

---

## Tarefa 2: SQL — 8 Tabelas + Índices

### Arquivo: `backend/sql/create_page_tables.sql` (NOVO)

```sql
-- ============================================================================
-- TABELAS DO MÓDULO LEXONLINE BUILDER v9.0
-- ============================================================================

-- 1. pages — Página principal
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,

  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),

  schema JSONB NOT NULL DEFAULT '[]',  -- Array de Sections
  metadata JSONB DEFAULT '{}',  -- favicon, ogImage, etc

  published_url VARCHAR(500),
  published_at TIMESTAMP,

  domain_id UUID REFERENCES page_domains(id) ON DELETE SET NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, slug),
  CONSTRAINT fk_team CHECK (team_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_team_id ON pages(team_id);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_domain_id ON pages(domain_id);
CREATE INDEX idx_pages_slug ON pages(slug);

-- 2. page_templates — Templates reutilizáveis
CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) NOT NULL
    CHECK (category IN (
      'landing_page', 'institutional', 'capture', 'sales', 'legal',
      'services', 'portfolio', 'event', 'blog', 'contact'
    )),

  thumbnail_url VARCHAR(500),
  schema JSONB NOT NULL,  -- Page schema template

  is_premium BOOLEAN DEFAULT FALSE,
  preview_url VARCHAR(500),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON page_templates(category);
CREATE INDEX idx_templates_is_premium ON page_templates(is_premium);

-- 3. page_versions — Histórico de versões
CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  version_number INT NOT NULL,
  schema JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  UNIQUE(page_id, version_number)
);

CREATE INDEX idx_versions_page_id ON page_versions(page_id);
CREATE INDEX idx_versions_created_at ON page_versions(created_at);

-- 4. page_leads — Captura de leads da página
CREATE TABLE IF NOT EXISTS page_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,

  form_id VARCHAR(100),  -- Qual formulário capturou
  metadata JSONB DEFAULT '{}',  -- UTM params, device, etc

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  source_url VARCHAR(500)
);

CREATE INDEX idx_leads_page_id ON page_leads(page_id);
CREATE INDEX idx_leads_email ON page_leads(email);
CREATE INDEX idx_leads_created_at ON page_leads(created_at);

-- 5. page_assets — Arquivos da página (imagens, vídeos)
CREATE TABLE IF NOT EXISTS page_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),  -- image/jpeg, video/mp4, etc
  file_size INT,  -- bytes

  firebase_url VARCHAR(500) NOT NULL,  -- Firebase Storage URL
  firebase_path VARCHAR(500) NOT NULL,

  width INT,  -- para imagens
  height INT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_page_id ON page_assets(page_id);
CREATE INDEX idx_assets_user_id ON page_assets(user_id);

-- 6. page_domains — Domínios customizados
CREATE TABLE IF NOT EXISTS page_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  domain VARCHAR(255) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,

  dns_records JSONB,  -- CNAME, TXT para verificação

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domains_user_id ON page_domains(user_id);
CREATE INDEX idx_domains_domain ON page_domains(domain);

-- 7. ab_tests — A/B Testing
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed')),

  variant_a_schema JSONB NOT NULL,
  variant_b_schema JSONB NOT NULL,

  traffic_split INT DEFAULT 50,  -- % para variant_a

  metric_type VARCHAR(50),  -- conversions, click, scroll

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX idx_abtests_page_id ON ab_tests(page_id);
CREATE INDEX idx_abtests_status ON ab_tests(status);

-- 8. page_views — Analytics de visualizações
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  session_id VARCHAR(100),
  user_agent TEXT,
  ip_address INET,

  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  scroll_depth INT,  -- %
  time_on_page INT,  -- segundos

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_views_page_id ON page_views(page_id);
CREATE INDEX idx_views_session_id ON page_views(session_id);
CREATE INDEX idx_views_created_at ON page_views(created_at);

-- ============================================================================
-- TRIGGERS PARA AUTO-UPDATE updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pages_update_timestamp
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER templates_update_timestamp
  BEFORE UPDATE ON page_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER domains_update_timestamp
  BEFORE UPDATE ON page_domains
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE pages IS 'Páginas criadas pelos usuários';
COMMENT ON TABLE page_templates IS 'Templates pré-montados reutilizáveis';
COMMENT ON TABLE page_versions IS 'Histórico de versões de cada página';
COMMENT ON TABLE page_leads IS 'Leads capturados via formulários da página';
COMMENT ON TABLE page_assets IS 'Arquivos (imagens, vídeos) usado nas páginas';
COMMENT ON TABLE page_domains IS 'Domínios customizados do usuário';
COMMENT ON TABLE ab_tests IS 'Testes A/B em variantes de páginas';
COMMENT ON TABLE page_views IS 'Analytics: visualizações e comportamento';

COMMENT ON COLUMN pages.schema IS 'JSON array contendo [Section, Section, ...], onde cada Section tem []Columns, []Elements';
COMMENT ON COLUMN page_templates.schema IS 'Template de schema para nova página';
COMMENT ON COLUMN ab_tests.metric_type IS 'Qual métrica acompanhar: conversões, clicks no CTA, scroll depth, etc';
```

---

## Tarefa 3: Popular `page_templates` com 15 Templates

### Arquivo: `backend/sql/seed_templates.sql` (NOVO)

```sql
-- ============================================================================
-- SEED: 15 TEMPLATES PADRÃO PARA LEXONLINE BUILDER
-- ============================================================================

INSERT INTO page_templates (title, slug, description, category, schema, is_premium) VALUES

-- LANDING PAGES (5)
('Landing Page Simples', 'landing-simple', 'Hero + CTA + Rodapé minimalista', 'landing_page',
  '[]'::jsonb, FALSE),

('Landing Page Conversão Alta', 'landing-hcv', 'Hero + Problemas + Solução + Depoimentos + CTA', 'landing_page',
  '[]'::jsonb, FALSE),

('Landing Page com Vídeo', 'landing-video', 'Hero com vídeo de fundo + Formulário captura', 'landing_page',
  '[]'::jsonb, TRUE),

('Landing Page Urgência', 'landing-urgency', 'Countdown timer + Oferta limitada + FOMO', 'landing_page',
  '[]'::jsonb, TRUE),

('Landing Page VSL', 'landing-vsl', 'Video Sales Letter + Formulário + Garantia', 'landing_page',
  '[]'::jsonb, TRUE),

-- SITE INSTITUCIONAL (3)
('Site Institucional Advocacia', 'site-legal-institutional', 'Header + Sobre + Áreas + Equipe + Contato', 'institutional',
  '[]'::jsonb, FALSE),

('Site Estúdio Jurídico Premium', 'site-legal-premium', 'Design luxury + Portfolio + Prêmios + Equipe expandida', 'institutional',
  '[]'::jsonb, TRUE),

('Site Escritório Pequeno', 'site-legal-small', 'Simples e direto: quem somos + serviços + contato', 'institutional',
  '[]'::jsonb, FALSE),

-- PÁGINAS DE CAPTURA (3)
('Captura E-book', 'capture-ebook', 'Foto e-book + Descrição + Formulário', 'capture',
  '[]'::jsonb, FALSE),

('Captura Webinar', 'capture-webinar', 'Data/hora + Descrição + Palestrantes + Formulário', 'capture',
  '[]'::jsonb, FALSE),

('Captura Consultoria Grátis', 'capture-consultation', 'Proposta valor + Depoimentos + Calendário', 'capture',
  '[]'::jsonb, TRUE),

-- VENDAS (2)
('Sales Page Produto Digital', 'sales-digital-product', 'Problema + Solução + Benefícios + Preço + Garantia', 'sales',
  '[]'::jsonb, FALSE),

('Sales Page Curso', 'sales-course', 'Hero + Currículo + Resultados alunos + Preço + FAQ', 'sales',
  '[]'::jsonb, FALSE),

-- JURÍDICO ESPECIALIZADO (2)
('Página Serviço Jurídico', 'legal-service-page', 'Explicação do serviço + Processo + Depoimentos clientes + CTA agendamento', 'legal',
  '[]'::jsonb, FALSE),

('Página Perfil Advogado', 'legal-lawyer-profile', 'Foto + Bio + Áreas especialidade + Depoimentos + Agendamento', 'legal',
  '[]'::jsonb, FALSE);

-- Verificar inserção
SELECT COUNT(*) as total_templates FROM page_templates;
```

**Nota**: Os campos `schema` estão vazios (`'[]'::jsonb`) porque o schema completo será definido em Fase 3b ao implementar os 30 blocos. Agora criamos apenas a estrutura.

---

## Tarefa 4: API Routes (Auth Middleware em Todas)

### Arquivo: `backend/src/routes/page.routes.ts` (NOVO)

```typescript
// backend/src/routes/page.routes.ts

import express from 'express';
import { Router } from 'express';
import * as pageController from '../controllers/pageController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Middleware de autenticação em todas as rotas
router.use(authenticateToken);

// ============================================================================
// PÁGINAS
// ============================================================================

// GET /api/page — listar todas as páginas do usuário
router.get('/', pageController.getPages);

// POST /api/page — criar nova página
router.post('/', pageController.createPage);

// GET /api/page/:id — obter página específica
router.get('/:id', pageController.getPageById);

// PUT /api/page/:id — atualizar página (schema, título, etc)
router.put('/:id', pageController.updatePage);

// DELETE /api/page/:id — arquivar/deletar página
router.delete('/:id', pageController.deletePage);

// ============================================================================
// PUBLICAÇÃO
// ============================================================================

// POST /api/page/:id/publish — publicar página
router.post('/:id/publish', pageController.publishPage);

// POST /api/page/:id/unpublish — despublicar página
router.post('/:id/unpublish', pageController.unpublishPage);

// ============================================================================
// DUPLICAÇÃO
// ============================================================================

// POST /api/page/:id/duplicate — duplicar página
router.post('/:id/duplicate', pageController.duplicatePage);

// ============================================================================
// TEMPLATES
// ============================================================================

// GET /api/page/templates — listar todos os templates
router.get('/templates/list', pageController.getTemplates);

// GET /api/page/templates/:id — obter template específico
router.get('/templates/:id', pageController.getTemplateById);

// POST /api/page/from-template/:templateId — criar página a partir de template
router.post('/from-template/:templateId', pageController.createFromTemplate);

// ============================================================================
// LEADS
// ============================================================================

// GET /api/page/:id/leads — listar leads da página
router.get('/:id/leads', pageController.getPageLeads);

// POST /api/page/:id/leads — capture lead (pode sem auth para formulários públicos)
// (este será tratado separadamente sem auth)

// ============================================================================
// ANALYTICS
// ============================================================================

// GET /api/page/:id/analytics — dados de analytics
router.get('/:id/analytics', pageController.getPageAnalytics);

// GET /api/page/:id/views — listar visualizações
router.get('/:id/views', pageController.getPageViews);

// ============================================================================
// DOMÍNIOS
// ============================================================================

// GET /api/page/domains — listar domínios do usuário
router.get('/domains/list', pageController.getUserDomains);

// POST /api/page/domains — adicionar domínio
router.post('/domains', pageController.addDomain);

// DELETE /api/page/domains/:id — remover domínio
router.delete('/domains/:id', pageController.removeDomain);

export default router;
```

### Arquivo: `backend/src/controllers/pageController.ts` (NOVO)

```typescript
// backend/src/controllers/pageController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Page, PageTemplate } from '@/types/page.types';

const prisma = new PrismaClient();

// ============================================================================
// PÁGINAS
// ============================================================================

export async function getPages(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const pages = await prisma.pages.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        published_url: true,
        published_at: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
}

export async function createPage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { title, slug, template_id } = req.body;

    if (!userId || !title || !slug) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verificar limite de páginas do plano
    const pageCount = await prisma.pages.count({ where: { user_id: userId } });
    const plan = req.user?.plan || 'essential';
    const limits = { essential: 5, professional: 20, agency: Infinity };

    if (pageCount >= limits[plan as keyof typeof limits]) {
      res.status(403).json({ error: 'Page limit reached' });
      return;
    }

    const templateSchema = template_id
      ? await prisma.page_templates.findUnique({
          where: { id: template_id },
          select: { schema: true },
        })
      : null;

    const page = await prisma.pages.create({
      data: {
        user_id: userId,
        title,
        slug,
        schema: templateSchema?.schema || [],
      },
    });

    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create page' });
  }
}

export async function getPageById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({
      where: { id },
    });

    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
}

export async function updatePage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, schema, metadata } = req.body;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const updated = await prisma.pages.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(schema && { schema }),
        ...(metadata && { metadata }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
}

export async function deletePage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    await prisma.pages.update({
      where: { id },
      data: { status: 'archived' },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
}

// ============================================================================
// PUBLICAÇÃO
// ============================================================================

export async function publishPage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // TODO: Chamar Cloud Function para gerar HTML/CSS
    const published = await prisma.pages.update({
      where: { id },
      data: {
        status: 'published',
        published_at: new Date(),
        published_url: `${page.slug}.lex-online.com`, // Placeholder
      },
    });

    res.json(published);
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish page' });
  }
}

export async function unpublishPage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const updated = await prisma.pages.update({
      where: { id },
      data: {
        status: 'draft',
        published_at: null,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unpublish page' });
  }
}

// ============================================================================
// DUPLICAÇÃO
// ============================================================================

export async function duplicatePage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const duplicate = await prisma.pages.create({
      data: {
        user_id: userId,
        title: `${page.title} (Cópia)`,
        slug: `${page.slug}-copy`,
        schema: page.schema,
      },
    });

    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate page' });
  }
}

// ============================================================================
// TEMPLATES
// ============================================================================

export async function getTemplates(req: Request, res: Response): Promise<void> {
  try {
    const templates = await prisma.page_templates.findMany({
      orderBy: { created_at: 'desc' },
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const template = await prisma.page_templates.findUnique({
      where: { id },
    });

    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
}

export async function createFromTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { templateId } = req.params;
    const { title, slug } = req.body;
    const userId = req.user?.id;

    if (!userId || !title || !slug) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const template = await prisma.page_templates.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    const page = await prisma.pages.create({
      data: {
        user_id: userId,
        title,
        slug,
        schema: template.schema,
      },
    });

    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create from template' });
  }
}

// ============================================================================
// LEADS
// ============================================================================

export async function getPageLeads(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const leads = await prisma.page_leads.findMany({
      where: { page_id: id },
      orderBy: { created_at: 'desc' },
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getPageAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // TODO: Agregar dados de views, leads, conversões
    const viewCount = await prisma.page_views.count({ where: { page_id: id } });
    const leadCount = await prisma.page_leads.count({ where: { page_id: id } });

    res.json({
      page_id: id,
      views: viewCount,
      leads: leadCount,
      conversion_rate: leadCount > 0 ? (leadCount / viewCount) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

export async function getPageViews(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const views = await prisma.page_views.findMany({
      where: { page_id: id },
      orderBy: { created_at: 'desc' },
      take: 1000, // Últimas 1000 views
    });

    res.json(views);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch views' });
  }
}

// ============================================================================
// DOMÍNIOS
// ============================================================================

export async function getUserDomains(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;

    const domains = await prisma.page_domains.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
}

export async function addDomain(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { domain } = req.body;

    if (!userId || !domain) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const domainRecord = await prisma.page_domains.create({
      data: {
        user_id: userId,
        domain,
      },
    });

    res.status(201).json(domainRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add domain' });
  }
}

export async function removeDomain(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const domain = await prisma.page_domains.findUnique({ where: { id } });
    if (!domain || domain.user_id !== userId) {
      res.status(404).json({ error: 'Domain not found' });
      return;
    }

    await prisma.page_domains.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove domain' });
  }
}
```

### Arquivo: `frontend/src/services/pageApi.ts` (NOVO)

```typescript
// frontend/src/services/pageApi.ts

import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Envia JWT cookie
});

export const pageApi = {
  // PÁGINAS
  getPages: () => api.get('/api/page'),
  createPage: (data: { title: string; slug: string; template_id?: string }) =>
    api.post('/api/page', data),
  getPageById: (id: string) => api.get(`/api/page/${id}`),
  updatePage: (id: string, data: any) => api.put(`/api/page/${id}`, data),
  deletePage: (id: string) => api.delete(`/api/page/${id}`),

  // PUBLICAÇÃO
  publishPage: (id: string) => api.post(`/api/page/${id}/publish`),
  unpublishPage: (id: string) => api.post(`/api/page/${id}/unpublish`),

  // DUPLICAÇÃO
  duplicatePage: (id: string) => api.post(`/api/page/${id}/duplicate`),

  // TEMPLATES
  getTemplates: () => api.get('/api/page/templates/list'),
  getTemplateById: (id: string) => api.get(`/api/page/templates/${id}`),
  createFromTemplate: (templateId: string, data: any) =>
    api.post(`/api/page/from-template/${templateId}`, data),

  // LEADS
  getPageLeads: (id: string) => api.get(`/api/page/${id}/leads`),

  // ANALYTICS
  getPageAnalytics: (id: string) => api.get(`/api/page/${id}/analytics`),
  getPageViews: (id: string) => api.get(`/api/page/${id}/views`),

  // DOMÍNIOS
  getUserDomains: () => api.get('/api/page/domains/list'),
  addDomain: (data: { domain: string }) => api.post('/api/page/domains', data),
  removeDomain: (id: string) => api.delete(`/api/page/domains/${id}`),
};

export default pageApi;
```

### Arquivo: `frontend/src/page/gallery/PagesGallery.tsx` (NOVO, PLACEHOLDER)

```typescript
// frontend/src/page/gallery/PagesGallery.tsx

import React from 'react';
import { Plus } from 'lucide-react';

export function PagesGallery() {
  return (
    <div className="w-full h-full p-8 bg-slate-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Minhas Páginas</h1>
        <button className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Nova Página
        </button>
      </header>

      {/* Placeholder para grid de páginas */}
      <div className="grid grid-cols-3 gap-6">
        {/* PageCard components aqui em Fase 2 */}
      </div>

      {/* Empty state */}
      <div className="text-center py-16">
        <p className="text-slate-500">Nenhuma página criada. Clique em "+ Nova Página" para começar.</p>
      </div>
    </div>
  );
}
```

---

## Critérios de Aceite

### ✅ Fase 1 Completa Quando:

1. **Menu atualizado**:
   - [ ] Item "Páginas" aparece no sidebar principal com ícone Layout
   - [ ] Clique navega para `/page`

2. **Banco de dados criado**:
   - [ ] Script SQL executa sem erros
   - [ ] 8 tabelas criadas: pages, page_templates, page_versions, page_leads, page_assets, page_domains, ab_tests, page_views
   - [ ] Todos os índices criados
   - [ ] Triggers de auto-update funcionando

3. **Templates inseridos**:
   - [ ] 15 templates inseridos em page_templates
   - [ ] Cada template tem title, slug, category, schema
   - [ ] Query `SELECT COUNT(*) FROM page_templates;` retorna 15

4. **API routes funcional**:
   - [ ] GET `/api/page` retorna `[]` (lista vazia de páginas)
   - [ ] Todas as rotas têm autenticação (middleware JWT)
   - [ ] Status codes corretos: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error

5. **Frontend conectado**:
   - [ ] `pageApi.ts` importa sem erros
   - [ ] `PagesGallery.tsx` renderiza (placeholder)
   - [ ] Console não tem erros de tipo ou imports

### ✅ Output Esperado:
- Estrutura SQL executada
- 15 templates em banco
- 3 APIs funcionando: GET /api/page, GET /api/page/templates, GET /api/page/domains
- Menu "Páginas" clicável
- Placeholder PagesGallery renderiza

---

## Próxima Fase

**Fase 2**: Galeria de Páginas + Página de Templates
- Implementar `PagesGallery.tsx` com filtros, cards e status
- Implementar `TemplatesPage.tsx` em `/page/templates`
- Hooks `usePages.ts` e `usePageLimits.ts`
- Modais e componentes de card

