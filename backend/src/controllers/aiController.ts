import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { UserPlan } from '@/types/page.types';
import lexAiService from '@/services/lexAiService';
import type { GenerateTextType, GenerateTextRequest } from '@/services/lexAiService';

const prisma = new PrismaClient();

const AI_DAILY_LIMITS: Record<UserPlan, number> = {
  essential: 10,
  professional: 50,
  agency: Infinity,
};

// ─── Rate limit helpers ───────────────────────────────────────────────────────

async function getTodayUsage(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.ai_usage_logs.count({
    where: { user_id: userId, created_at: { gte: startOfDay } },
  });
}

async function logUsage(
  userId: string,
  pageId: string | undefined,
  requestType: string,
  tokensUsed = 0,
  responseLength = 0,
): Promise<void> {
  await prisma.ai_usage_logs.create({
    data: { user_id: userId, page_id: pageId ?? null, request_type: requestType, tokens_used: tokensUsed, response_length: responseLength },
  });
}

function getResetAt(): string {
  const reset = new Date();
  reset.setDate(reset.getDate() + 1);
  reset.setHours(0, 0, 0, 0);
  return reset.toISOString();
}

async function checkRateLimit(
  req: Request,
  res: Response,
): Promise<{ allowed: boolean; remaining: number }> {
  const userId = req.user?.id ?? '';
  const plan = (req.user?.plan ?? 'essential') as UserPlan;
  const limit = AI_DAILY_LIMITS[plan];

  if (limit === Infinity) return { allowed: true, remaining: Infinity };

  const used = await getTodayUsage(userId);
  const remaining = Math.max(0, limit - used);

  if (used >= limit) {
    res.status(429).json({
      error: 'Limite diário de uso da IA atingido',
      remaining: 0,
      limit,
      reset_at: getResetAt(),
    });
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining };
}

// ─── POST /api/ai/generate-text (SSE streaming) ───────────────────────────────

export async function generateText(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? '';
  const { type, context, pageId } = req.body as {
    type: GenerateTextType;
    context: GenerateTextRequest;
    pageId?: string;
  };

  if (!type || !context) {
    res.status(400).json({ error: 'Campos obrigatórios: type, context' });
    return;
  }

  const { allowed, remaining } = await checkRateLimit(req, res);
  if (!allowed) return;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-RateLimit-Remaining', String(remaining - 1));
  res.setHeader('X-RateLimit-Reset', getResetAt());
  res.flushHeaders();

  let totalChars = 0;

  try {
    for await (const chunk of lexAiService.generateText(type, context)) {
      totalChars += chunk.length;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    await logUsage(userId, pageId, `generate-text:${type}`, 0, totalChars);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar conteúdo';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  } finally {
    res.end();
  }
}

// ─── POST /api/ai/seo ────────────────────────────────────────────────────────

export async function generateSeo(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? '';
  const { pageContent, city, pageId } = req.body as {
    pageContent: string;
    city: string;
    pageId?: string;
  };

  if (!pageContent || !city) {
    res.status(400).json({ error: 'Campos obrigatórios: pageContent, city' });
    return;
  }

  const { allowed } = await checkRateLimit(req, res);
  if (!allowed) return;

  try {
    const result = await lexAiService.generateSeo(pageContent, city);
    await logUsage(userId, pageId, 'seo', 0, JSON.stringify(result).length);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar SEO';
    res.status(500).json({ error: message });
  }
}

// ─── POST /api/ai/analyze ─────────────────────────────────────────────────────

export async function analyzePage(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? '';
  const { pageJSON, pageId } = req.body as { pageJSON: unknown; pageId?: string };

  if (!pageJSON) {
    res.status(400).json({ error: 'Campo obrigatório: pageJSON' });
    return;
  }

  const { allowed } = await checkRateLimit(req, res);
  if (!allowed) return;

  try {
    const suggestions = await lexAiService.analyzePage(pageJSON);
    await logUsage(userId, pageId, 'analyze', 0, JSON.stringify(suggestions).length);
    res.json({ suggestions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao analisar página';
    res.status(500).json({ error: message });
  }
}

// ─── POST /api/ai/faq ────────────────────────────────────────────────────────

export async function generateFaq(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? '';
  const { area, nicho, pageId } = req.body as {
    area: string;
    nicho: string;
    pageId?: string;
  };

  if (!area || !nicho) {
    res.status(400).json({ error: 'Campos obrigatórios: area, nicho' });
    return;
  }

  const { allowed } = await checkRateLimit(req, res);
  if (!allowed) return;

  try {
    const items = await lexAiService.generateFaqList(area, nicho);
    await logUsage(userId, pageId, 'faq', 0, JSON.stringify(items).length);
    res.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar FAQ';
    res.status(500).json({ error: message });
  }
}

// ─── GET /api/ai/usage ───────────────────────────────────────────────────────

export async function getUsage(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? '';
  const plan = (req.user?.plan ?? 'essential') as UserPlan;
  const limit = AI_DAILY_LIMITS[plan];

  const used = await getTodayUsage(userId);
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);

  res.json({
    used,
    limit: limit === Infinity ? null : limit,
    remaining: remaining === Infinity ? null : remaining,
    reset_at: getResetAt(),
  });
}
