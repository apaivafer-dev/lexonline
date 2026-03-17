import type { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import abAnalytics from '@/services/abAnalytics';

const prisma = new PrismaClient();

function getUserId(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return null; }
  return userId;
}

// ── Testes ─────────────────────────────────────────────────────────────────────

export async function createTest(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { pageId, elementId, name, variantA, variantB, splitA, splitB, endDate } = req.body as {
      pageId: string;
      elementId: string;
      name?: string;
      variantA: Record<string, unknown>;
      variantB: Record<string, unknown>;
      splitA?: number;
      splitB?: number;
      endDate?: string;
    };

    if (!pageId || !elementId || !variantA || !variantB) {
      res.status(400).json({ error: 'Missing required fields: pageId, elementId, variantA, variantB' });
      return;
    }

    const a = splitA ?? 50;
    const b = splitB ?? 100 - a;

    const test = await prisma.ab_tests.create({
      data: {
        page_id: pageId,
        element_id: elementId,
        name: name ?? `Teste ${elementId}`,
        status: 'active',
        variant_a_schema: variantA as Prisma.InputJsonValue,
        variant_b_schema: variantB as Prisma.InputJsonValue,
        split_a: a,
        split_b: b,
        traffic_split: b,
        started_at: new Date(),
        ends_at: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json(test);
  } catch {
    res.status(500).json({ error: 'Failed to create test' });
  }
}

export async function getTest(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const test = await prisma.ab_tests.findUnique({ where: { id: testId } });
    if (!test) { res.status(404).json({ error: 'Teste não encontrado' }); return; }
    res.json(test);
  } catch {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
}

export async function getTestsByPage(req: Request, res: Response): Promise<void> {
  try {
    const { pageId } = req.params;
    const tests = await prisma.ab_tests.findMany({
      where: { page_id: pageId },
      orderBy: { created_at: 'desc' },
    });
    res.json(tests);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
}

export async function updateTest(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const { splitA, splitB, endDate, status } = req.body as {
      splitA?: number;
      splitB?: number;
      endDate?: string;
      status?: string;
    };

    const test = await prisma.ab_tests.findUnique({ where: { id: testId } });
    if (!test) { res.status(404).json({ error: 'Teste não encontrado' }); return; }

    const updated = await prisma.ab_tests.update({
      where: { id: testId },
      data: {
        ...(splitA !== undefined && { split_a: splitA }),
        ...(splitB !== undefined && { split_b: splitB }),
        ...(endDate !== undefined && { ends_at: new Date(endDate) }),
        ...(status !== undefined && { status }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update test' });
  }
}

export async function declareWinner(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const { winner } = req.body as { winner: 'A' | 'B' };

    if (winner !== 'A' && winner !== 'B') {
      res.status(400).json({ error: 'winner deve ser "A" ou "B"' });
      return;
    }

    const test = await prisma.ab_tests.findUnique({ where: { id: testId } });
    if (!test) { res.status(404).json({ error: 'Teste não encontrado' }); return; }

    const now = new Date();
    const updated = await prisma.ab_tests.update({
      where: { id: testId },
      data: {
        status: 'concluded',
        winner,
        concluded_at: now,
        ended_at: now,
      },
    });

    // Se winner = B, atualizar schema da página com a variante B
    if (winner === 'B') {
      const page = await prisma.pages.findUnique({
        where: { id: test.page_id },
        select: { schema: true },
      });
      if (page) {
        const schema = page.schema as unknown[];
        const variantBSchema = test.variant_b_schema as Record<string, unknown>;
        // Substituir o elemento pelo schema da variante B
        const updatedSchema = schema.map((section: unknown) => {
          const s = section as Record<string, unknown>;
          if (!Array.isArray(s['columns'])) return s;
          return {
            ...s,
            columns: (s['columns'] as unknown[]).map((col: unknown) => {
              const c = col as Record<string, unknown>;
              if (!Array.isArray(c['elements'])) return c;
              return {
                ...c,
                elements: (c['elements'] as unknown[]).map((el: unknown) => {
                  const e = el as Record<string, unknown>;
                  return e['id'] === test.element_id ? { ...e, ...variantBSchema } : e;
                }),
              };
            }),
          };
        });
        await prisma.pages.update({
          where: { id: test.page_id },
          data: { schema: updatedSchema as Prisma.InputJsonValue },
        });
      }
    }

    res.json({ testId, winner, appliedAt: now, test: updated });
  } catch {
    res.status(500).json({ error: 'Failed to declare winner' });
  }
}

export async function deleteTest(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    await prisma.ab_tests.delete({ where: { id: testId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete test' });
  }
}

// ── Impressões e Conversões ────────────────────────────────────────────────────

export async function recordImpression(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const { variant, sessionId, device, source } = req.body as {
      variant: 'A' | 'B';
      sessionId?: string;
      device?: string;
      source?: string;
    };

    await prisma.ab_events.create({
      data: {
        test_id: testId,
        event_type: 'impression',
        variant,
        session_id: sessionId,
        device,
        source,
      },
    });

    res.json({ recorded: true });
  } catch {
    res.status(500).json({ error: 'Failed to record impression' });
  }
}

export async function recordConversion(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const { variant, sessionId, value } = req.body as {
      variant: 'A' | 'B';
      sessionId?: string;
      elementId?: string;
      value?: number;
    };

    await prisma.ab_events.create({
      data: {
        test_id: testId,
        event_type: 'conversion',
        variant,
        session_id: sessionId,
        value: value ?? null,
      },
    });

    res.json({ recorded: true });
  } catch {
    res.status(500).json({ error: 'Failed to record conversion' });
  }
}

// ── Resultados ─────────────────────────────────────────────────────────────────

export async function getResults(req: Request, res: Response): Promise<void> {
  try {
    const { testId } = req.params;
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

    const test = await prisma.ab_tests.findUnique({ where: { id: testId } });
    if (!test) { res.status(404).json({ error: 'Teste não encontrado' }); return; }

    const [result, series] = await Promise.all([
      abAnalytics.analyzeTest(
        testId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      ),
      abAnalytics.getDailySeries(testId),
    ]);

    res.json({ test, result, series });
  } catch {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
}
