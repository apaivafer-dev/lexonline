import React from 'react';
import { ChevronLeft, Grid3x3, RotateCcw, RotateCw, Eye, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Page } from '@/types/page.types';
import type { DeviceType } from '@/types/editor.types';
import { DeviceSelector } from './DeviceSelector';
import { SaveToggle } from './SaveToggle';
import { SaveIndicator } from './SaveIndicator';
import { PublishButton } from './PublishButton';

interface TopBarProps {
  page: Page | null;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  autoSave: boolean;
  onAutoSaveToggle: (enabled: boolean) => void;
  isSaving: boolean;
  saveError: boolean;
  isDirty: boolean;
  onPublish: () => Promise<void>;
  onManualSave?: () => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  onSettings?: () => void;
  onAiPanel?: () => void;
  aiPanelOpen?: boolean;
}

export function TopBar({
  page, device, onDeviceChange,
  autoSave, onAutoSaveToggle,
  isSaving, saveError, isDirty,
  onPublish, onManualSave,
  showGrid = false, onToggleGrid,
  canUndo = false, canRedo = false,
  onUndo, onRedo, onPreview, onSettings, onAiPanel, aiPanelOpen = false,
}: TopBarProps) {
  const navigate = useNavigate();
  const isInsideIframe = window.self !== window.top;

  const handleBack = () => {
    if (isInsideIframe) {
      window.parent.postMessage({ type: 'page-editor:close' }, '*');
    } else {
      navigate('/page');
    }
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
          title="Voltar às páginas"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-slate-400">Editando</p>
          <p className="font-semibold text-slate-900 truncate max-w-48">
            {page?.title ?? 'Carregando...'}
          </p>
        </div>

        {/* Grid toggle */}
        {onToggleGrid && (
          <button
            onClick={onToggleGrid}
            title="Mostrar/ocultar grid"
            className={`p-2 rounded-lg transition ml-1 ${showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-400'}`}
          >
            <Grid3x3 size={16} />
          </button>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-2 border-l border-slate-200 pl-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
            className="p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
            className="p-2 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-600"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>

      {/* Center */}
      <DeviceSelector device={device} onDeviceChange={onDeviceChange} />

      {/* Right */}
      <div className="flex items-center gap-3">
        <SaveIndicator isSaving={isSaving} hasError={saveError} />
        <SaveToggle enabled={autoSave} onToggle={onAutoSaveToggle} onManualSave={onManualSave} />
        {onAiPanel && (
          <button
            onClick={onAiPanel}
            title="LexOnline AI"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition border ${
              aiPanelOpen
                ? 'bg-violet-600 text-white border-violet-600'
                : 'border-violet-200 text-violet-600 hover:bg-violet-50'
            }`}
          >
            <Sparkles size={14} />
            AI
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            title="Configurações da página"
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-700"
          >
            <Settings size={18} />
          </button>
        )}
        {onPreview && (
          <button
            onClick={onPreview}
            title="Preview (Ctrl+P)"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <Eye size={14} />
            Preview
          </button>
        )}
        <PublishButton page={page} isDirty={isDirty} onPublish={onPublish} />
      </div>
    </div>
  );
}
