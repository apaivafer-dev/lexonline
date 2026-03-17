import { useState, useEffect, useCallback, useRef } from 'react';
import pageApi from '@/services/pageApi';
import type { Page, PageSchema } from '@/types/page.types';

export function useEditorState(pageId: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    pageApi.getPageById(pageId)
      .then((res) => setPage(res.data))
      .catch(() => setSaveError('Falha ao carregar página'))
      .finally(() => setIsLoading(false));
  }, [pageId]);

  const savePage = useCallback(async (schema: PageSchema[]) => {
    if (!page) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await pageApi.updatePage(page.id, { schema });
      setPage(res.data);
    } catch {
      setSaveError('Erro ao salvar página');
    } finally {
      setIsSaving(false);
    }
  }, [page]);

  const debouncedSave = useCallback((schema: PageSchema[]) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => savePage(schema), 2000);
  }, [savePage]);

  return { page, setPage, isLoading, isSaving, saveError, savePage, debouncedSave };
}
