import { useState, useCallback, useRef } from 'react';
import pageApi from '@/services/pageApi';
import type { PageSettings } from '@/types/page.types';

export function usePageSettings(pageId: string, initialSettings: PageSettings = {}) {
  const [settings, setSettings] = useState<PageSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateSettings = useCallback((partial: Partial<PageSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      setSaveError(null);
      try {
        await pageApi.updatePage(pageId, { metadata: next });
      } catch {
        setSaveError('Erro ao salvar configurações');
      } finally {
        setSaving(false);
      }
    }, 1000);
  }, [settings, pageId]);

  return { settings, updateSettings, saving, saveError };
}
