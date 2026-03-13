import type { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { PAGE_LIMITS } from '@/types/page.types';
import type { UserPlan, PageSettings } from '@/types/page.types';
import htmlGenerator from '@/services/htmlGenerator';
import schemaGenerator from '@/services/schemaGenerator';
import minifier from '@/services/minifier';
import fileDeployer from '@/services/fileDeployer';

const prisma = new PrismaClient();

// ============================================================================
// PÁGINAS
// ============================================================================

export async function getPages(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const pages = await prisma.pages.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true, title: true, slug: true, status: true,
        published_url: true, published_at: true, created_at: true, updated_at: true,
      },
    });

    res.json(pages);
  } catch {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
}

export async function createPage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { title, slug, template_id } = req.body as { title: string; slug: string; template_id?: string };

    if (!userId || !title || !slug) {
      res.status(400).json({ error: 'Missing required fields: title, slug' });
      return;
    }

    const [pageCount, dbUser] = await Promise.all([
      prisma.pages.count({ where: { user_id: userId, status: { not: 'archived' } } }),
      prisma.users.findUnique({ where: { id: userId }, select: { plan: true } }),
    ]);
    const rawPlan = (dbUser?.plan ?? req.user?.plan ?? '').toLowerCase();
    const plan: UserPlan =
      rawPlan === 'pro' || rawPlan === 'professional' ? 'professional' :
      rawPlan === 'premium' || rawPlan === 'agency' ? 'agency' :
      rawPlan === 'trial' || rawPlan === 'cortesia' || rawPlan === 'essential' ? 'essential' :
      'professional'; // plano desconhecido → permissivo
    if (pageCount >= PAGE_LIMITS[plan]) {
      res.status(403).json({ error: 'Page limit reached for your plan' });
      return;
    }

    const templateSchema = template_id
      ? (await prisma.page_templates.findUnique({ where: { id: template_id }, select: { schema: true } }))?.schema
      : null;

    const page = await prisma.pages.create({
      data: { user_id: userId, title, slug, schema: (templateSchema as Prisma.InputJsonValue) ?? [] },
    });

    res.status(201).json(page);
  } catch (err) {
    console.error('[createPage] error:', err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'Já existe uma página com esse slug. Escolha uma URL diferente.' });
      return;
    }
    const detail = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: detail });
  }
}

export async function getPageById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const page = await prisma.pages.findUnique({ where: { id } });

    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' }); return;
    }
    res.json(page);
  } catch {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
}

export async function updatePage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, schema, metadata } = req.body as { title?: string; schema?: unknown; metadata?: unknown };

    const page = await prisma.pages.findUnique({ where: { id } });
    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const updated = await prisma.pages.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(schema !== undefined && { schema: (schema as Prisma.InputJsonValue) ?? [] }),
        ...(metadata !== undefined && { metadata: (metadata as Prisma.InputJsonValue) ?? {} }),
      },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update page' });
  }
}

export async function deletePage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const page = await prisma.pages.findUnique({ where: { id } });

    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    await prisma.pages.update({ where: { id }, data: { status: 'archived' } });
    res.json({ success: true });
  } catch {
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
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const schema = (page.schema as unknown[]) ?? [];
    const settings = (page.metadata as PageSettings) ?? {};

    // 1. Generate HTML (includes inline JS)
    const rawHtmlBase = htmlGenerator.generate(id, page.title, schema, settings);

    // Inject analytics tracking script
    const analyticsScript = `<script>!function(){var s=sessionStorage.getItem('lex_sid')||(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2));sessionStorage.setItem('lex_sid',s);var ua=navigator.userAgent,d=/mobile|android|iphone/i.test(ua)?'mobile':/tablet|ipad/i.test(ua)?'tablet':'desktop',r=document.referrer||'direct';fetch('/api/analytics/pageview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pageId:'${id}',sessionId:s,device:d,source:r,userAgent:ua})}).catch(function(){});var t=Date.now();window.addEventListener('beforeunload',function(){navigator.sendBeacon('/api/analytics/duration',JSON.stringify({pageId:'${id}',sessionId:s,duration:Math.round((Date.now()-t)/1000)}))});window.lexAnalytics={sessionId:s,device:d,source:r}}();</script>`;
    const rawHtml = rawHtmlBase.includes('</body>')
      ? rawHtmlBase.replace('</body>', analyticsScript + '</body>')
      : rawHtmlBase + analyticsScript;

    // 2. Inject JSON-LD schemas
    const jsonLd = schemaGenerator.generate(
      schema as Parameters<typeof schemaGenerator.generate>[0],
      settings,
    );
    const htmlWithSchemas = jsonLd
      ? rawHtml.replace('</head>', `${jsonLd}\n</head>`)
      : rawHtml;

    // 3. Minify
    const minifiedHtml = await minifier.minifyHTML(htmlWithSchemas);
    const sizeKB = fileDeployer.sizeKB(minifiedHtml);

    // 4. Save to disk
    const publishedUrl = await fileDeployer.deploy(id, minifiedHtml);

    // 5. Update DB
    const published = await prisma.pages.update({
      where: { id },
      data: {
        status: 'published',
        published_at: new Date(),
        published_url: publishedUrl,
      },
    });

    res.json({ ...published, sizeKB, url: publishedUrl });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ error: 'Failed to publish page' });
  }
}

export async function unpublishPage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const page = await prisma.pages.findUnique({ where: { id } });

    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const updated = await prisma.pages.update({
      where: { id }, data: { status: 'draft', published_at: null },
    });
    res.json(updated);
  } catch {
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
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const duplicate = await prisma.pages.create({
      data: {
        user_id: userId,
        title: `${page.title} (Cópia)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        schema: (page.schema as Prisma.InputJsonValue) ?? [],
      },
    });
    res.status(201).json(duplicate);
  } catch {
    res.status(500).json({ error: 'Failed to duplicate page' });
  }
}

// ============================================================================
// TEMPLATES
// ============================================================================

export async function getTemplates(_req: Request, res: Response): Promise<void> {
  try {
    const templates = await prisma.page_templates.findMany({ orderBy: { created_at: 'desc' } });
    res.json(templates);
  } catch {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

export async function getTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const template = await prisma.page_templates.findUnique({ where: { id } });

    if (!template) { res.status(404).json({ error: 'Template not found' }); return; }
    res.json(template);
  } catch {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
}

export async function createFromTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { templateId } = req.params;
    const { title, slug } = req.body as { title: string; slug: string };
    const userId = req.user?.id;

    if (!userId || !title || !slug) {
      res.status(400).json({ error: 'Missing required fields' }); return;
    }

    const template = await prisma.page_templates.findUnique({ where: { id: templateId } });
    if (!template) { res.status(404).json({ error: 'Template not found' }); return; }

    const page = await prisma.pages.create({
      data: { user_id: userId, title, slug, schema: (template.schema as Prisma.InputJsonValue) ?? [] },
    });
    res.status(201).json(page);
  } catch {
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
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const leads = await prisma.page_leads.findMany({
      where: { page_id: id }, orderBy: { created_at: 'desc' },
    });
    res.json(leads);
  } catch {
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
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const [viewCount, leadCount] = await Promise.all([
      prisma.page_views.count({ where: { page_id: id } }),
      prisma.page_leads.count({ where: { page_id: id } }),
    ]);

    res.json({
      page_id: id,
      views: viewCount,
      leads: leadCount,
      conversion_rate: viewCount > 0 ? (leadCount / viewCount) * 100 : 0,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

export async function getPageViews(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const page = await prisma.pages.findUnique({ where: { id } });

    if (!page || page.user_id !== userId) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const views = await prisma.page_views.findMany({
      where: { page_id: id }, orderBy: { created_at: 'desc' }, take: 1000,
    });
    res.json(views);
  } catch {
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
      where: { user_id: userId }, orderBy: { created_at: 'desc' },
    });
    res.json(domains);
  } catch {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
}

export async function addDomain(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { domain } = req.body as { domain: string };

    if (!userId || !domain) {
      res.status(400).json({ error: 'Missing required fields' }); return;
    }

    const record = await prisma.page_domains.create({ data: { user_id: userId, domain } });
    res.status(201).json(record);
  } catch {
    res.status(500).json({ error: 'Failed to add domain' });
  }
}

export async function removeDomain(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const domain = await prisma.page_domains.findUnique({ where: { id } });

    if (!domain || domain.user_id !== userId) {
      res.status(404).json({ error: 'Domain not found' }); return;
    }

    await prisma.page_domains.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to remove domain' });
  }
}
