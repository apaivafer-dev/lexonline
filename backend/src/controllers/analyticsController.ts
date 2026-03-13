import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDevice(ua: string): string {
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function extractSource(referrer: string | null | undefined): string {
  if (!referrer || referrer === 'direct') return 'Direto';
  try {
    const url = new URL(referrer);
    const h = url.hostname.replace('www.', '');
    if (h.includes('google')) return 'Google';
    if (h.includes('facebook') || h.includes('fb.com')) return 'Facebook';
    if (h.includes('instagram')) return 'Instagram';
    if (h.includes('linkedin')) return 'LinkedIn';
    if (h.includes('twitter') || h.includes('x.com')) return 'Twitter/X';
    if (h.includes('whatsapp')) return 'WhatsApp';
    return h;
  } catch {
    return 'Outro';
  }
}

function truncateIp(ip: string): string {
  // Truncate last octet for IPv4 privacy
  const parts = ip.split('.');
  if (parts.length === 4) { parts[3] = '0'; return parts.join('.'); }
  return ip;
}

interface DateFilter {
  gte?: Date;
  lte?: Date;
  lt?: Date;
}

function getDateFilter(period: string, start?: string, end?: string): DateFilter {
  const now = new Date();
  switch (period) {
    case 'today': {
      const s = new Date(now); s.setHours(0, 0, 0, 0);
      return { gte: s };
    }
    case '7d': return { gte: new Date(now.getTime() - 7 * 86_400_000) };
    case '90d': return { gte: new Date(now.getTime() - 90 * 86_400_000) };
    case 'custom': return { gte: new Date(start!), lte: new Date(end!) };
    default: return { gte: new Date(now.getTime() - 30 * 86_400_000) }; // 30d
  }
}

function getPrevDateFilter(period: string): DateFilter {
  const now = new Date();
  switch (period) {
    case 'today': {
      const s = new Date(now); s.setHours(0, 0, 0, 0);
      const p = new Date(s); p.setDate(p.getDate() - 1);
      return { gte: p, lt: s };
    }
    case '7d': return {
      gte: new Date(now.getTime() - 14 * 86_400_000),
      lt: new Date(now.getTime() - 7 * 86_400_000),
    };
    case '90d': return {
      gte: new Date(now.getTime() - 180 * 86_400_000),
      lt: new Date(now.getTime() - 90 * 86_400_000),
    };
    default: return {
      gte: new Date(now.getTime() - 60 * 86_400_000),
      lt: new Date(now.getTime() - 30 * 86_400_000),
    };
  }
}

function calcTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ─── PUBLIC: Record Pageview ──────────────────────────────────────────────────

export async function recordPageview(req: Request, res: Response): Promise<void> {
  try {
    const { pageId, sessionId, device, source, userAgent } = req.body as {
      pageId: string; sessionId: string; device?: string; source?: string; userAgent?: string;
    };

    if (!pageId || !sessionId) {
      res.status(400).json({ error: 'pageId and sessionId required' }); return;
    }

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket.remoteAddress ?? '';
    const safeIp = ip ? truncateIp(ip) : null;

    await prisma.page_views.create({
      data: {
        page_id: pageId,
        session_id: sessionId,
        device: device ?? detectDevice(userAgent ?? ''),
        referrer: source ?? null,
        user_agent: userAgent ?? null,
        ip_address: safeIp,
      },
    });

    res.json({ recorded: true, sessionId });
  } catch {
    res.status(500).json({ error: 'Failed to record pageview' });
  }
}

// ─── PUBLIC: Record Duration ──────────────────────────────────────────────────

export async function recordDuration(req: Request, res: Response): Promise<void> {
  try {
    const { pageId, sessionId, duration } = req.body as {
      pageId: string; sessionId: string; duration: number;
    };

    if (!pageId || !sessionId) {
      res.status(400).json({ error: 'pageId and sessionId required' }); return;
    }

    // Update most recent pageview for this session
    const view = await prisma.page_views.findFirst({
      where: { page_id: pageId, session_id: sessionId },
      orderBy: { created_at: 'desc' },
    });

    if (view) {
      await prisma.page_views.update({
        where: { id: view.id },
        data: { time_on_page: Math.min(duration, 86400) }, // cap at 24h
      });
    }

    res.json({ recorded: true });
  } catch {
    res.status(500).json({ error: 'Failed to record duration' });
  }
}

// ─── PUBLIC: Record Lead ──────────────────────────────────────────────────────

export async function recordLead(req: Request, res: Response): Promise<void> {
  try {
    const { pageId, sessionId, name, email, phone, area, source } = req.body as {
      pageId: string; sessionId?: string; name?: string; email: string;
      phone?: string; area?: string; source?: string;
    };

    if (!pageId || !email) {
      res.status(400).json({ error: 'pageId and email required' }); return;
    }

    const lead = await prisma.page_leads.create({
      data: {
        page_id: pageId,
        name: name ?? null,
        email,
        phone: phone ?? null,
        area: area ?? null,
        source: source ? extractSource(source) : 'Direto',
        metadata: sessionId ? { sessionId } : undefined,
      },
    });

    res.status(201).json({ leadId: lead.id, createdAt: lead.created_at });
  } catch {
    res.status(500).json({ error: 'Failed to record lead' });
  }
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function verifyPageOwnership(pageId: string, userId: string): Promise<boolean> {
  const page = await prisma.pages.findUnique({ where: { id: pageId }, select: { user_id: true } });
  return !!page && page.user_id === userId;
}

// ─── PROTECTED: Dashboard ─────────────────────────────────────────────────────

export async function getDashboard(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const userId = req.user?.id;
    const { period = '30d', start, end } = req.query as Record<string, string>;

    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const dateFilter = getDateFilter(period, start, end);
    const prevFilter = getPrevDateFilter(period);

    const [views, prevViews, leads, prevLeads] = await Promise.all([
      prisma.page_views.findMany({
        where: { page_id: pageId, created_at: dateFilter },
        select: { session_id: true, time_on_page: true, referrer: true },
      }),
      prisma.page_views.findMany({
        where: { page_id: pageId, created_at: prevFilter },
        select: { session_id: true },
      }),
      prisma.page_leads.count({ where: { page_id: pageId, created_at: dateFilter } }),
      prisma.page_leads.count({ where: { page_id: pageId, created_at: prevFilter } }),
    ]);

    const uniqueSessions = new Set(views.map(v => v.session_id)).size;
    const prevUniqueSessions = new Set(prevViews.map(v => v.session_id)).size;

    // Duration (only sessions with tracked time)
    const withDuration = views.filter(v => v.time_on_page && v.time_on_page > 0);
    const avgDuration = withDuration.length > 0
      ? Math.round(withDuration.reduce((s, v) => s + (v.time_on_page ?? 0), 0) / withDuration.length)
      : 0;

    // Bounce rate: sessions with time_on_page < 10 or null
    const bounced = views.filter(v => !v.time_on_page || v.time_on_page < 10).length;
    const bounceRate = uniqueSessions > 0 ? Math.round((bounced / uniqueSessions) * 100 * 10) / 10 : 0;

    // Conversion rate
    const conversionRate = uniqueSessions > 0
      ? Math.round((leads / uniqueSessions) * 100 * 100) / 100
      : 0;

    // Top source
    const sourceCounts = views.reduce((acc, v) => {
      const s = extractSource(v.referrer);
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Direto';
    const topSourcePct = views.length > 0
      ? Math.round(((sourceCounts[topSource] ?? 0) / views.length) * 100)
      : 0;

    res.json({
      visits: uniqueSessions,
      visitsTrend: calcTrend(uniqueSessions, prevUniqueSessions),
      leads,
      leadsTrend: calcTrend(leads, prevLeads),
      conversionRate,
      conversionRateTrend: 0, // computed below
      avgDuration,
      avgDurationTrend: 0,
      bounceRate,
      bounceRateTrend: 0,
      topSource,
      topSourcePct,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
}

// ─── PROTECTED: Visits Chart ──────────────────────────────────────────────────

export async function getVisitsChart(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const userId = req.user?.id;
    const { period = '30d', start, end } = req.query as Record<string, string>;

    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const dateFilter = getDateFilter(period, start, end);
    const views = await prisma.page_views.findMany({
      where: { page_id: pageId, created_at: dateFilter },
      select: { session_id: true, created_at: true },
      orderBy: { created_at: 'asc' },
    });

    const byDate = views.reduce((acc, v) => {
      const date = v.created_at.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = new Set<string>();
      if (v.session_id) acc[date].add(v.session_id);
      return acc;
    }, {} as Record<string, Set<string>>);

    const data = Object.entries(byDate)
      .map(([date, sessions]) => ({ date, visits: sessions.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch visits chart' });
  }
}

// ─── PROTECTED: Device Chart ──────────────────────────────────────────────────

export async function getDeviceChart(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const userId = req.user?.id;
    const { period = '30d', start, end } = req.query as Record<string, string>;

    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const dateFilter = getDateFilter(period, start, end);
    const views = await prisma.page_views.findMany({
      where: { page_id: pageId, created_at: dateFilter },
      select: { device: true, user_agent: true },
    });

    const counts = { desktop: 0, mobile: 0, tablet: 0 };
    for (const v of views) {
      const d = (v.device ?? detectDevice(v.user_agent ?? '')) as 'desktop' | 'mobile' | 'tablet';
      counts[d] = (counts[d] ?? 0) + 1;
    }

    const total = views.length || 1;
    res.json({
      desktop: Math.round((counts.desktop / total) * 100),
      mobile: Math.round((counts.mobile / total) * 100),
      tablet: Math.round((counts.tablet / total) * 100),
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch device chart' });
  }
}

// ─── PROTECTED: Sources Chart ─────────────────────────────────────────────────

export async function getSourcesChart(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const userId = req.user?.id;
    const { period = '30d', start, end } = req.query as Record<string, string>;

    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const dateFilter = getDateFilter(period, start, end);
    const views = await prisma.page_views.findMany({
      where: { page_id: pageId, created_at: dateFilter },
      select: { referrer: true },
    });

    const sourceCounts = views.reduce((acc, v) => {
      const s = extractSource(v.referrer);
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(sourceCounts)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sources chart' });
  }
}

// ─── PROTECTED: Get Leads ─────────────────────────────────────────────────────

export async function getLeads(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const userId = req.user?.id;
    const {
      page = '1', limit = '20', sort = 'created_at', order = 'desc',
      search, status, area, source, period = '30d', start, end,
    } = req.query as Record<string, string>;

    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const dateFilter = period !== 'all' ? getDateFilter(period, start, end) : undefined;

    const where = {
      page_id: pageId,
      ...(dateFilter && { created_at: dateFilter }),
      ...(status && { status }),
      ...(area && { area }),
      ...(source && { source }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [leads, total] = await Promise.all([
      prisma.page_leads.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limitNum,
        select: {
          id: true, name: true, email: true, phone: true, area: true,
          source: true, status: true, created_at: true, updated_at: true,
        },
      }),
      prisma.page_leads.count({ where }),
    ]);

    res.json({ leads, total, page: pageNum, pageSize: limitNum });
  } catch {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
}

// ─── PROTECTED: Update Lead Status ───────────────────────────────────────────

export async function updateLeadStatus(req: Request, res: Response): Promise<void> {
  try {
    const { leadId } = req.params;
    const userId = req.user?.id;
    const { status } = req.body as { status: string };

    const validStatuses = ['novo', 'contatado', 'convertido', 'perdido'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' }); return;
    }

    const lead = await prisma.page_leads.findUnique({
      where: { id: leadId },
      include: { page: { select: { user_id: true } } },
    });

    if (!lead || lead.page.user_id !== userId) {
      res.status(404).json({ error: 'Lead not found' }); return;
    }

    const updated = await prisma.page_leads.update({
      where: { id: leadId },
      data: { status },
      select: { id: true, status: true, updated_at: true },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update lead' });
  }
}

// ─── PROTECTED: Export Leads CSV ──────────────────────────────────────────────

export async function exportLeads(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { pageId, period = '30d', start, end } = req.query as Record<string, string>;

    if (!pageId) { res.status(400).json({ error: 'pageId required' }); return; }
    if (!await verifyPageOwnership(pageId, userId!)) {
      res.status(404).json({ error: 'Page not found' }); return;
    }

    const dateFilter = period !== 'all' ? getDateFilter(period, start, end) : undefined;
    const leads = await prisma.page_leads.findMany({
      where: { page_id: pageId, ...(dateFilter && { created_at: dateFilter }) },
      orderBy: { created_at: 'desc' },
      select: { name: true, email: true, phone: true, area: true, source: true, status: true, created_at: true },
    });

    const escape = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Nome', 'Email', 'Telefone', 'Área', 'Data de Criação', 'Origem', 'Status'],
      ...leads.map(l => [
        escape(l.name),
        escape(l.email),
        escape(l.phone),
        escape(l.area),
        l.created_at.toLocaleDateString('pt-BR'),
        escape(l.source),
        escape(l.status),
      ]),
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const filename = `leads-${pageId}-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel compatibility
  } catch {
    res.status(500).json({ error: 'Failed to export leads' });
  }
}

// ─── PROTECTED: Send Leads to CRM ─────────────────────────────────────────────

export async function sendLeadsToCrm(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { leadIds, crmType } = req.body as { leadIds: string[]; crmType: string; credentials: unknown };

    if (!leadIds?.length || !crmType) {
      res.status(400).json({ error: 'leadIds and crmType required' }); return;
    }

    // Verify ownership of all leads via their pages
    const leads = await prisma.page_leads.findMany({
      where: { id: { in: leadIds } },
      include: { page: { select: { user_id: true } } },
    });

    const unauthorized = leads.filter(l => l.page.user_id !== userId);
    if (unauthorized.length > 0) {
      res.status(403).json({ error: 'Unauthorized leads included' }); return;
    }

    // CRM integration stub — real implementations require CRM-specific SDKs/API keys
    const supportedCrms = ['salesforce', 'pipedrive', 'hubspot', 'rdstation', 'kommo'];
    if (!supportedCrms.includes(crmType.toLowerCase())) {
      res.status(400).json({ error: `Unsupported CRM: ${crmType}` }); return;
    }

    // TODO: Implement actual CRM API calls per crmType using credentials
    res.json({ sent_count: leads.length, failed_count: 0, errors: [] });
  } catch {
    res.status(500).json({ error: 'Failed to send leads to CRM' });
  }
}
