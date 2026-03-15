import { useState, useCallback } from 'react';
import { aiApi, streamGenerateText } from '@/services/aiApi';
import type {
  GenerateTextType,
  GenerateTextContext,
  SeoOptimization,
  FaqItem,
  Suggestion,
  AiUsage,
} from '@/services/aiApi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export function useAi(pageId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<AiUsage | null>(null);

  function addUserMessage(content: string): string {
    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id, role: 'user', content, timestamp: new Date() },
    ]);
    return id;
  }

  function addAssistantMessage(): string {
    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true },
    ]);
    return id;
  }

  function appendToMessage(id: string, text: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: m.content + text } : m)),
    );
  }

  function finalizeMessage(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m)),
    );
  }

  // ─── generateText (streaming) ─────────────────────────────────────────────

  const generateText = useCallback(
    async (
      type: GenerateTextType,
      context: GenerateTextContext,
      userPromptLabel?: string,
    ): Promise<void> => {
      setError(null);
      setIsLoading(true);

      const label = userPromptLabel ?? `Gerar ${type}`;
      addUserMessage(label);
      const assistantId = addAssistantMessage();

      try {
        await streamGenerateText(
          { type, context, pageId },
          (chunk) => appendToMessage(assistantId, chunk),
          () => { finalizeMessage(assistantId); setIsLoading(false); },
          (msg) => {
            finalizeMessage(assistantId);
            setError(msg);
            setIsLoading(false);
          },
        );
      } catch (err) {
        finalizeMessage(assistantId);
        setError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo');
        setIsLoading(false);
      }
    },
    [pageId],
  );

  // ─── sendMessage (free text chat) ────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      await generateText('faq-answer', { contextoExtra: text }, text);
    },
    [generateText],
  );

  // ─── generateSeo ─────────────────────────────────────────────────────────

  const generateSeo = useCallback(
    async (pageContent: string, city: string): Promise<SeoOptimization | null> => {
      setError(null);
      try {
        const res = await aiApi.generateSeo({ pageContent, city, pageId });
        void fetchUsage();
        return res.data;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'Erro ao gerar SEO';
        setError(msg);
        return null;
      }
    },
    [pageId],
  );

  // ─── generateFaq ─────────────────────────────────────────────────────────

  const generateFaq = useCallback(
    async (area: string, nicho: string): Promise<FaqItem[]> => {
      setError(null);
      try {
        const res = await aiApi.generateFaq({ area, nicho, pageId });
        void fetchUsage();
        return res.data.items;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'Erro ao gerar FAQ';
        setError(msg);
        return [];
      }
    },
    [pageId],
  );

  // ─── analyzePage ─────────────────────────────────────────────────────────

  const analyzePage = useCallback(
    async (pageJSON: unknown): Promise<Suggestion[]> => {
      setError(null);
      try {
        const res = await aiApi.analyzePage({ pageJSON, pageId });
        void fetchUsage();
        return res.data.suggestions;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          'Erro ao analisar página';
        setError(msg);
        return [];
      }
    },
    [pageId],
  );

  // ─── fetchUsage ──────────────────────────────────────────────────────────

  const fetchUsage = useCallback(async () => {
    try {
      const res = await aiApi.getUsage();
      setUsage(res.data);
    } catch {
      // silently ignore
    }
  }, []);

  // ─── clearMessages ────────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // ─── getLastAssistantContent ─────────────────────────────────────────────

  function getLastAssistantContent(): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messages[i].content;
    }
    return '';
  }

  return {
    messages,
    isLoading,
    error,
    usage,
    generateText,
    sendMessage,
    generateSeo,
    generateFaq,
    analyzePage,
    fetchUsage,
    clearMessages,
    getLastAssistantContent,
  };
}
