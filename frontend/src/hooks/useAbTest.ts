import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// ─── API client ───────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AbTest {
  id: string;
  page_id: string;
  element_id: string;
  name: string;
  status: 'active' | 'paused' | 'concluded';
  variant_a_schema: Record<string, unknown>;
  variant_b_schema: Record<string, unknown>;
  split_a: number;
  split_b: number;
  winner: 'A' | 'B' | null;
  created_at: string;
  started_at: string | null;
  ends_at: string | null;
  ended_at: string | null;
  concluded_at: string | null;
}

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

export interface DayPoint {
  date: string;
  variantA: number;
  variantB: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAbTest() {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [currentTest, setCurrentTest] = useState<AbTest | null>(null);
  const [results, setResults] = useState<TestResult | null>(null);
  const [series, setSeries] = useState<DayPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createTest = useCallback(async (
    pageId: string,
    elementId: string,
    variantA: Record<string, unknown>,
    variantB: Record<string, unknown>,
    options?: { name?: string; splitA?: number; endDate?: string }
  ): Promise<AbTest> => {
    const res = await api.post<AbTest>('/api/ab/tests', {
      pageId, elementId, variantA, variantB,
      name: options?.name,
      splitA: options?.splitA,
      splitB: options?.splitA ? 100 - options.splitA : undefined,
      endDate: options?.endDate,
    });
    setTests((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const fetchTests = useCallback(async (pageId: string) => {
    try {
      setLoading(true);
      const res = await api.get<AbTest[]>(`/api/ab/pages/${pageId}/tests`);
      setTests(res.data);
    } catch {
      setError('Falha ao carregar testes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTestResults = useCallback(async (
    testId: string,
    dateRange?: { startDate?: string; endDate?: string }
  ): Promise<TestResult> => {
    setLoading(true);
    try {
      const res = await api.get<{ test: AbTest; result: TestResult; series: DayPoint[] }>(
        `/api/ab/tests/${testId}/results`,
        { params: dateRange }
      );
      setCurrentTest(res.data.test);
      setResults(res.data.result);
      setSeries(res.data.series);
      return res.data.result;
    } finally {
      setLoading(false);
    }
  }, []);

  const declareWinner = useCallback(async (testId: string, winner: 'A' | 'B') => {
    await api.post(`/api/ab/tests/${testId}/declare-winner`, { winner });
    setCurrentTest((prev) => prev ? { ...prev, status: 'concluded', winner } : prev);
    setTests((prev) => prev.map((t) => t.id === testId ? { ...t, status: 'concluded', winner } : t));
  }, []);

  const endTest = useCallback(async (testId: string) => {
    await api.put(`/api/ab/tests/${testId}`, { status: 'concluded' });
    setCurrentTest((prev) => prev ? { ...prev, status: 'concluded' } : prev);
    setTests((prev) => prev.map((t) => t.id === testId ? { ...t, status: 'concluded' } : t));
  }, []);

  const deleteTest = useCallback(async (testId: string) => {
    await api.delete(`/api/ab/tests/${testId}`);
    setTests((prev) => prev.filter((t) => t.id !== testId));
    if (currentTest?.id === testId) setCurrentTest(null);
  }, [currentTest]);

  const enableAutoRefresh = useCallback((testId: string, intervalMs = 30_000): (() => void) => {
    if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    autoRefreshRef.current = setInterval(() => {
      fetchTestResults(testId).catch(() => null);
    }, intervalMs);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [fetchTestResults]);

  return {
    tests,
    currentTest,
    results,
    series,
    loading,
    error,
    createTest,
    fetchTests,
    fetchTestResults,
    declareWinner,
    endTest,
    deleteTest,
    enableAutoRefresh,
  };
}
