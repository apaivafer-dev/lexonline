import axios from 'axios';
import type { AxiosInstance } from 'axios';

export type GenerateTextType =
  | 'headline'
  | 'bio'
  | 'service-description'
  | 'blog-post'
  | 'testimonial-request'
  | 'about'
  | 'faq-answer';

export interface GenerateTextContext {
  area?: string;
  especialidade?: string;
  publicoAlvo?: string;
  tom?: string;
  nicho?: string;
  cidade?: string;
  experiencia?: string;
  servico?: string;
  contextoExtra?: string;
}

export interface SeoOptimization {
  title: string;
  metaDescription: string;
  keywords: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Suggestion {
  element: string;
  text: string;
  priority: 'alta' | 'media' | 'baixa';
}

export interface AiUsage {
  used: number;
  limit: number | null;
  remaining: number | null;
  reset_at: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const aiApi = {
  // Non-streaming endpoints
  generateSeo: (data: { pageContent: string; city: string; pageId?: string }) =>
    api.post<SeoOptimization>('/api/ai/seo', data),

  analyzePage: (data: { pageJSON: unknown; pageId?: string }) =>
    api.post<{ suggestions: Suggestion[] }>('/api/ai/analyze', data),

  generateFaq: (data: { area: string; nicho: string; pageId?: string }) =>
    api.post<{ items: FaqItem[] }>('/api/ai/faq', data),

  getUsage: () => api.get<AiUsage>('/api/ai/usage'),
};

/**
 * Streaming generate-text via fetch + ReadableStream.
 * Calls onChunk for each text piece and onDone when finished.
 */
export async function streamGenerateText(
  payload: { type: GenerateTextType; context: GenerateTextContext; pageId?: string },
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (message: string) => void,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/ai/generate-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    onError(data.error ?? `Erro ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) { onError('Streaming não suportado'); return; }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') { onDone(); return; }
      try {
        const parsed = JSON.parse(raw) as { text?: string; error?: string };
        if (parsed.error) { onError(parsed.error); return; }
        if (parsed.text) onChunk(parsed.text);
      } catch {
        // ignore malformed lines
      }
    }
  }

  onDone();
}
