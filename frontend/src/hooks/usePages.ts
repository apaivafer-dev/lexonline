import { useState, useEffect, useCallback } from 'react';
import type { Page } from '@/types/page.types';
import pageApi from '@/services/pageApi';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pageApi.getPages();
      setPages(response.data);
      setError(null);
    } catch {
      setError('Falha ao carregar páginas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createPage = useCallback(
    async (data: { title: string; slug: string; template_id?: string }) => {
      const response = await pageApi.createPage(data);
      setPages((prev) => [response.data, ...prev]);
      return response.data as Page;
    },
    []
  );

  const deletePage = useCallback(async (id: string) => {
    await pageApi.deletePage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicatePage = useCallback(async (id: string) => {
    const response = await pageApi.duplicatePage(id);
    setPages((prev) => [response.data, ...prev]);
    return response.data as Page;
  }, []);

  const publishPage = useCallback(async (id: string) => {
    const response = await pageApi.publishPage(id);
    setPages((prev) => prev.map((p) => (p.id === id ? response.data : p)));
    return response.data as Page;
  }, []);

  return {
    pages,
    isLoading,
    error,
    createPage,
    deletePage,
    duplicatePage,
    publishPage,
    refetch: fetchPages,
  };
}
