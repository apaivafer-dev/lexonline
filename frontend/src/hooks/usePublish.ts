import { useState, useCallback } from 'react';
import pageApi from '@/services/pageApi';

export type PublishStep =
  | 'validating'
  | 'generating-html'
  | 'generating-css'
  | 'generating-js'
  | 'schemas'
  | 'minifying'
  | 'deploying'
  | 'published';

export interface PublishProgress {
  step: PublishStep;
  message: string;
}

const STEPS: PublishProgress[] = [
  { step: 'validating', message: 'Validando página' },
  { step: 'generating-html', message: 'Gerando HTML semântico' },
  { step: 'generating-css', message: 'Gerando CSS crítico' },
  { step: 'generating-js', message: 'Gerando JavaScript nativo' },
  { step: 'schemas', message: 'Adicionando JSON-LD schemas' },
  { step: 'minifying', message: 'Minificando (<50KB)' },
  { step: 'deploying', message: 'Enviando para CDN' },
];

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export function usePublish(pageId: string) {
  const [publishing, setPublishing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<PublishStep[]>([]);
  const [currentStep, setCurrentStep] = useState<PublishStep | null>(null);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [sizeKB, setSizeKB] = useState<number | null>(null);
  const [error, setError] = useState('');

  const reset = useCallback(() => {
    setCompletedSteps([]);
    setCurrentStep(null);
    setPublishedUrl('');
    setSizeKB(null);
    setError('');
  }, []);

  const publish = useCallback(async () => {
    if (publishing) return;
    reset();
    setPublishing(true);

    // Simulate frontend progress while the real request runs
    const progressPromise = (async () => {
      for (const s of STEPS) {
        setCurrentStep(s.step);
        await delay(350);
        setCompletedSteps((prev) => [...prev, s.step]);
      }
    })();

    const apiPromise = pageApi.publishPage(pageId);

    try {
      const [, res] = await Promise.all([progressPromise, apiPromise]);
      const data = res.data as { url?: string; published_url?: string; sizeKB?: number };
      const url = data.url ?? data.published_url ?? '';
      setPublishedUrl(url);
      if (data.sizeKB) setSizeKB(data.sizeKB);
      setCurrentStep('published');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao publicar';
      setError(msg);
    } finally {
      setPublishing(false);
    }
  }, [pageId, publishing, reset]);

  return { publishing, completedSteps, currentStep, publishedUrl, sizeKB, error, publish };
}
