import { useState, useRef, useCallback } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';
import { useAi } from '@/hooks/useAi';
import { AiChat } from './AiChat';
import type { GenerateTextContext } from '@/services/aiApi';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AiPanelProps {
  pageId: string;
  pageData?: unknown;
  selectedElementContent?: string;
  onElementUpdate: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Botões rápidos ───────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Headline', type: 'headline' as const, icon: '✏️' },
  { label: 'Bio', type: 'bio' as const, icon: '👤' },
  { label: 'Serviço', type: 'service-description' as const, icon: '⚖️' },
  { label: 'Sobre', type: 'about' as const, icon: '🏛️' },
  { label: 'FAQ', type: 'faq-answer' as const, icon: '❓' },
];

const AREAS_JURIDICAS = [
  'Direito do Trabalho',
  'Direito de Família',
  'Direito Criminal',
  'Direito Previdenciário',
  'Direito Imobiliário',
  'Direito do Consumidor',
  'Direito Empresarial',
  'Direito Tributário',
  'Direito Civil',
  'Direito Administrativo',
];

// ─── Componente de contexto rápido ────────────────────────────────────────────

function ContextForm({
  onGenerate,
  onClose,
  type,
}: {
  onGenerate: (ctx: GenerateTextContext, label: string) => void;
  onClose: () => void;
  type: string;
}) {
  const [area, setArea] = useState(AREAS_JURIDICAS[0]);
  const [especialidade, setEspecialidade] = useState('');
  const [cidade, setCidade] = useState('');

  function handleSubmit() {
    const ctx: GenerateTextContext = { area, especialidade: especialidade || undefined, cidade: cidade || undefined };
    const label = `${type === 'headline' ? 'Headline' : type === 'bio' ? 'Bio' : 'Conteúdo'} — ${area}`;
    onGenerate(ctx, label);
    onClose();
  }

  return (
    <div className="absolute bottom-full mb-2 left-0 right-0 mx-3 bg-white border border-slate-200 rounded-xl shadow-xl p-4 space-y-3 z-10">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Contexto</p>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">Área jurídica</label>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400"
        >
          {AREAS_JURIDICAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">Especialidade (opcional)</label>
        <input
          type="text"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          placeholder="ex: Rescisão indevida"
          className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400"
        />
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">Cidade (opcional)</label>
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="ex: São Paulo"
          className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Gerar
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 border border-slate-200 text-sm rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── AiPanel principal ────────────────────────────────────────────────────────

export function AiPanel({
  pageId,
  pageData,
  selectedElementContent,
  onElementUpdate,
  isOpen,
  onClose,
}: AiPanelProps) {
  const { messages, isLoading, error, usage, generateText, sendMessage, analyzePage, clearMessages } =
    useAi(pageId);

  const [inputText, setInputText] = useState('');
  const [contextFormType, setContextFormType] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    setInputText('');
    await sendMessage(text);
  }, [inputText, isLoading, sendMessage]);

  const handleQuickAction = useCallback(
    (type: string) => {
      if (isLoading) return;
      setContextFormType((prev) => (prev === type ? null : type));
    },
    [isLoading],
  );

  const handleContextGenerate = useCallback(
    async (ctx: GenerateTextContext, label: string) => {
      setContextFormType(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await generateText(contextFormType as any, ctx, label);
    },
    [contextFormType, generateText],
  );

  const handleAnalyze = useCallback(async () => {
    if (!pageData || isLoading) return;
    await analyzePage(pageData);
  }, [pageData, isLoading, analyzePage]);

  const handleInsertContent = useCallback(
    (content: string) => {
      onElementUpdate(content);
    },
    [onElementUpdate],
  );

  if (!isOpen) return null;

  const rateLimitText =
    usage
      ? usage.limit === null
        ? 'Ilimitado'
        : `${usage.remaining ?? 0} de ${usage.limit} restantes hoje`
      : null;

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-slate-200 flex flex-col z-30 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">✦</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">LexOnline AI</span>
          {rateLimitText && (
            <span className="text-xs text-slate-400">{rateLimitText}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Limpar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Elemento selecionado */}
      {selectedElementContent && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex-shrink-0">
          <p className="text-xs text-blue-600 font-medium">Elemento selecionado:</p>
          <p className="text-xs text-blue-800 mt-0.5 truncate">{selectedElementContent}</p>
        </div>
      )}

      {/* Chat */}
      <AiChat
        messages={messages}
        isLoading={isLoading}
        onInsertContent={handleInsertContent}
      />

      {/* Error */}
      {error && (
        <div className="mx-3 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.type}
              onClick={() => handleQuickAction(action.type)}
              disabled={isLoading}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-50
                ${contextFormType === action.type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{action.icon as string}</span>
              {action.label}
              {contextFormType === action.type && <ChevronDown size={10} />}
            </button>
          ))}
          {pageData ? (
            <button
              onClick={() => void handleAnalyze()}
              disabled={isLoading}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              🔍 Analisar página
            </button>
          ) : null}
        </div>

        {/* Context form overlay */}
        {contextFormType && (
          <div className="relative">
            <ContextForm
              type={contextFormType}
              onGenerate={(ctx, label) => void handleContextGenerate(ctx, label)}
              onClose={() => setContextFormType(null)}
            />
          </div>
        )}

        {/* Input bar */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && void handleSend()}
            placeholder="Escreva uma solicitação..."
            disabled={isLoading}
            className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => void handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={15} />
          </button>
        </div>

        <p className="text-center text-xs text-slate-300 mt-2">
          Conteúdo em conformidade com o Código de Ética da OAB
        </p>
      </div>
    </div>
  );
}

export default AiPanel;
