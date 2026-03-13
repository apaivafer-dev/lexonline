/**
 * abAnalytics — análise estatística de Testes A/B via Z-test de proporções.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface TestMetrics {
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface TestResult {
  variantA: TestMetrics;
  variantB: TestMetrics;
  winner: 'A' | 'B' | null;
  confidence: number;
  zScore: number;
  pValue: number;
  sampleSize: number;
  recommendation: string;
  sufficientData: boolean;
}

// ─── Matemática estatística ───────────────────────────────────────────────────

/**
 * Distribuição normal acumulada (aproximação de Abramowitz & Stegun).
 * Retorna P(X ≤ x) para X ~ N(0,1).
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.SQRT2;

  const t = 1 / (1 + p * absX);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1 + sign * y);
}

function getRecommendation(delta: number, confidence: number, sufficientData: boolean): string {
  if (!sufficientData) {
    return 'Dados insuficientes. Aguarde pelo menos 100 impressões por variante.';
  }
  if (confidence < 80) {
    return 'Continue o teste. Dados insuficientes para conclusão.';
  }
  if (confidence >= 95 && delta > 0) {
    return 'B está vencendo com alta confiança. Considere declarar vencedor.';
  }
  if (confidence >= 95 && delta < 0) {
    return 'A está vencendo com alta confiança. Considere encerrar.';
  }
  return 'Teste em andamento. Revise em alguns dias.';
}

// ─── API pública ──────────────────────────────────────────────────────────────

const abAnalytics = {
  async analyzeTest(
    testId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TestResult> {
    const where = {
      test_id: testId,
      ...(startDate || endDate
        ? {
            created_at: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            },
          }
        : {}),
    };

    // Buscar contagens agrupadas por variante e tipo de evento
    const events = await prisma.ab_events.groupBy({
      by: ['variant', 'event_type'],
      where,
      _count: { id: true },
    });

    const get = (variant: string, type: string) =>
      events.find((e) => e.variant === variant && e.event_type === type)?._count.id ?? 0;

    const impressionsA = get('A', 'impression');
    const impressionsB = get('B', 'impression');
    const conversionsA = get('A', 'conversion');
    const conversionsB = get('B', 'conversion');

    const MIN_SAMPLE = 100;
    const sufficientData = impressionsA >= MIN_SAMPLE && impressionsB >= MIN_SAMPLE;

    const pA = impressionsA > 0 ? conversionsA / impressionsA : 0;
    const pB = impressionsB > 0 ? conversionsB / impressionsB : 0;

    let zScore = 0;
    let confidence = 0;
    let pValue = 1;

    if (sufficientData) {
      const total = impressionsA + impressionsB;
      const totalConversions = conversionsA + conversionsB;
      const pPooled = totalConversions / total;
      const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / impressionsA + 1 / impressionsB));

      if (se > 0) {
        zScore = (pB - pA) / se;
        pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
        confidence = (1 - pValue) * 100;
      }
    }

    let winner: 'A' | 'B' | null = null;
    if (confidence >= 95 && sufficientData) {
      winner = pB > pA ? 'B' : 'A';
    }

    const delta = pB - pA;

    return {
      variantA: {
        impressions: impressionsA,
        conversions: conversionsA,
        conversionRate: Math.round(pA * 10000) / 100,
      },
      variantB: {
        impressions: impressionsB,
        conversions: conversionsB,
        conversionRate: Math.round(pB * 10000) / 100,
      },
      winner,
      confidence: Math.round(confidence * 10) / 10,
      zScore: Math.round(zScore * 1000) / 1000,
      pValue: Math.round(pValue * 10000) / 10000,
      sampleSize: impressionsA + impressionsB,
      recommendation: getRecommendation(delta, confidence, sufficientData),
      sufficientData,
    };
  },

  /** Série temporal: conversão diária por variante (últimos N dias). */
  async getDailySeries(
    testId: string,
    days = 30
  ): Promise<{ date: string; variantA: number; variantB: number }[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await prisma.ab_events.findMany({
      where: { test_id: testId, event_type: 'conversion', created_at: { gte: since } },
      select: { variant: true, created_at: true },
      orderBy: { created_at: 'asc' },
    });

    const byDay: Map<string, { A: number; B: number }> = new Map();

    for (const ev of events) {
      const day = ev.created_at.toISOString().slice(0, 10);
      const cur = byDay.get(day) ?? { A: 0, B: 0 };
      if (ev.variant === 'A') cur.A += 1;
      else cur.B += 1;
      byDay.set(day, cur);
    }

    return Array.from(byDay.entries()).map(([date, counts]) => ({
      date,
      variantA: counts.A,
      variantB: counts.B,
    }));
  },
};

export default abAnalytics;
