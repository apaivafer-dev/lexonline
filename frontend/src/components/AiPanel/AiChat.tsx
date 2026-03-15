import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/hooks/useAi';

interface AiChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onInsertContent: (content: string) => void;
}

function MarkdownText({ text }: { text: string }) {
  // Basic markdown: **bold**, *italic*
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-blue-600 text-white text-sm px-3 py-2 rounded-2xl rounded-tr-sm">
        {message.content}
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  onInsert,
}: {
  message: ChatMessage;
  onInsert: (content: string) => void;
}) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">✦</span>
      </div>
      <div className="flex-1 space-y-2">
        <div className="bg-slate-100 text-slate-800 text-sm px-3 py-2 rounded-2xl rounded-tl-sm">
          {message.content ? (
            <MarkdownText text={message.content} />
          ) : (
            <span className="text-slate-400 italic">...</span>
          )}
          {message.isStreaming && (
            <span className="inline-block w-1 h-3 bg-blue-500 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
        {!message.isStreaming && message.content && (
          <button
            onClick={() => onInsert(message.content)}
            className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Inserir na página
          </button>
        )}
      </div>
    </div>
  );
}

export function AiChat({ messages, isLoading, onInsertContent }: AiChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xl">✦</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">LexOnline AI</p>
          <p className="text-xs text-slate-400 mt-1">
            Especialista em marketing jurídico conforme o Código de Ética da OAB.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Use os botões abaixo ou escreva sua solicitação.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserBubble key={msg.id} message={msg} />
        ) : (
          <AssistantBubble key={msg.id} message={msg} onInsert={onInsertContent} />
        ),
      )}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">✦</span>
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
