import { useState, useCallback, useEffect, useRef } from 'react';
import pageApi from '@/services/pageApi';
import type {
  Domain,
  AddDomainResponse,
  PageDomainsResponse,
} from '@/types/page.types';

const POLL_INTERVAL_MS = 30_000;

export function useDomain(pageId: string) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [freeSubdomain, setFreeSubdomain] = useState('');
  const [planLimit, setPlanLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);
  const [pendingInstructions, setPendingInstructions] = useState<AddDomainResponse | null>(null);

  const pollTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchDomains = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await pageApi.getPageDomains(pageId);
      const data = res.data as PageDomainsResponse;
      setDomains(data.domains);
      setFreeSubdomain(data.free_subdomain);
      setPlanLimit(data.plan_limit);
    } catch {
      setError('Erro ao buscar domínios');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    void fetchDomains();
  }, [fetchDomains]);

  // ─── Add ──────────────────────────────────────────────────────────────────

  const addDomain = useCallback(
    async (domain: string): Promise<AddDomainResponse | null> => {
      setError(null);
      try {
        const res = await pageApi.addPageDomain(pageId, { domain });
        const data = res.data as AddDomainResponse;

        setDomains((prev) => [
          {
            id: data.domainId,
            domain: data.domain,
            status: data.status,
            verified_at: null,
            created_at: data.created_at,
          },
          ...prev,
        ]);

        setPendingInstructions(data);
        startPolling(data.domainId);
        return data;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'Erro ao adicionar domínio';
        setError(msg);
        return null;
      }
    },
    [pageId],
  );

  // ─── Remove ───────────────────────────────────────────────────────────────

  const removeDomain = useCallback(
    async (domainId: string): Promise<void> => {
      setError(null);
      try {
        await pageApi.removePageDomain(pageId, domainId);
        stopPolling(domainId);
        setDomains((prev) => prev.filter((d) => d.id !== domainId));
        if (pendingInstructions?.domainId === domainId) {
          setPendingInstructions(null);
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'Erro ao remover domínio';
        setError(msg);
      }
    },
    [pageId, pendingInstructions],
  );

  // ─── Verify (manual) ─────────────────────────────────────────────────────

  const verifyDomain = useCallback(
    async (domainId: string): Promise<void> => {
      setVerifyingDomainId(domainId);
      try {
        const res = await pageApi.verifyPageDomain(pageId, domainId);
        const { status, verified_at } = res.data as { status: string; verified_at: string | null };

        setDomains((prev) =>
          prev.map((d) =>
            d.id === domainId ? { ...d, status: status as Domain['status'], verified_at } : d,
          ),
        );

        if (status === 'active') {
          stopPolling(domainId);
          if (pendingInstructions?.domainId === domainId) {
            setPendingInstructions(null);
          }
        }
      } finally {
        setVerifyingDomainId(null);
      }
    },
    [pageId, pendingInstructions],
  );

  // ─── Check availability (valida localmente antes de enviar) ──────────────

  const checkAvailability = useCallback(
    async (domain: string): Promise<{ available: boolean; error?: string }> => {
      const trimmed = domain.trim().toLowerCase();
      const DOMAIN_REGEX =
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

      if (!DOMAIN_REGEX.test(trimmed)) {
        return { available: false, error: 'Formato inválido. Use: meudominio.com.br' };
      }
      if (trimmed.endsWith('lexonline.com.br')) {
        return { available: false, error: 'Não é permitido usar subdomínios do lexonline.com.br' };
      }
      if (domains.some((d) => d.domain === trimmed)) {
        return { available: false, error: 'Este domínio já está cadastrado nesta página' };
      }
      return { available: true };
    },
    [domains],
  );

  // ─── Polling ──────────────────────────────────────────────────────────────

  const startPolling = useCallback(
    (domainId: string) => {
      if (pollTimers.current.has(domainId)) return;

      const timer = setInterval(async () => {
        try {
          const res = await pageApi.verifyPageDomain(pageId, domainId);
          const { status, verified_at } = res.data as {
            status: string;
            verified_at: string | null;
          };

          setDomains((prev) =>
            prev.map((d) =>
              d.id === domainId
                ? { ...d, status: status as Domain['status'], verified_at }
                : d,
            ),
          );

          if (status === 'active') {
            stopPolling(domainId);
          }
        } catch {
          // silently ignore polling errors
        }
      }, POLL_INTERVAL_MS);

      pollTimers.current.set(domainId, timer);
    },
    [pageId],
  );

  const stopPolling = useCallback((domainId: string) => {
    const timer = pollTimers.current.get(domainId);
    if (timer) {
      clearInterval(timer);
      pollTimers.current.delete(domainId);
    }
  }, []);

  // Inicia polling para domínios pending ao montar
  useEffect(() => {
    domains
      .filter((d) => d.status === 'pending')
      .forEach((d) => startPolling(d.id));
  }, [domains, startPolling]);

  // Limpa todos os timers ao desmontar
  useEffect(() => {
    return () => {
      pollTimers.current.forEach((timer) => clearInterval(timer));
      pollTimers.current.clear();
    };
  }, []);

  return {
    domains,
    freeSubdomain,
    planLimit,
    loading,
    error,
    verifyingDomainId,
    pendingInstructions,
    fetchDomains,
    addDomain,
    removeDomain,
    verifyDomain,
    checkAvailability,
    clearPendingInstructions: () => setPendingInstructions(null),
  };
}
