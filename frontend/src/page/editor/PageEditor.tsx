import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorLayout } from '@/hooks/useEditorLayout';
import { useEditorState } from '@/hooks/useEditorState';
import { useHistory } from '@/hooks/useHistory';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';
import { Canvas } from './Canvas/Canvas';
import { RightPanel } from './RightPanel/RightPanel';
import { PreviewModal } from './Canvas/PreviewModal';
import { PageSettingsModal } from './Settings/PageSettingsModal';
import { PublishProgressModal } from './TopBar/PublishProgress';
import { AiPanel } from '@/components/AiPanel/AiPanel';
import type { Page, PageSchema } from '@/types/page.types';
import type { SelectedElement } from '@/types/editor.types';

export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const layout = useEditorLayout();
  const { page, setPage, isLoading, isSaving, saveError, savePage, debouncedSave } = useEditorState(id!);
  const history = useHistory(setPage);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Auto-save when dirty
  useEffect(() => {
    if (layout.autoSave && layout.isDirty && page?.schema) {
      debouncedSave(page.schema as PageSchema[]);
    }
  }, [layout.isDirty, layout.autoSave, page, debouncedSave]);

  const handleManualSave = useCallback(() => {
    if (page) savePage(page.schema as PageSchema[]);
  }, [page, savePage]);

  const handlePublish = useCallback(async () => {
    if (!page) return;
    // Save any pending changes first, then open publish progress modal
    if (layout.isDirty) await savePage(page.schema as PageSchema[]);
    layout.setDirty(false);
    setPublishOpen(true);
  }, [page, layout, savePage]);

  const handleAddBlock = useCallback((_type: string) => {
    layout.setDirty(true);
  }, [layout]);

  const handleCreateFromLayout = useCallback((_columns: number[]) => {
    layout.setDirty(true);
  }, [layout]);

  const handlePageUpdate = useCallback((updatedPage: Page) => {
    setPage(updatedPage);
    layout.setDirty(true);
    history.push(updatedPage);
  }, [setPage, layout, history]);

  const handleElementSelect = useCallback((element: SelectedElement) => {
    layout.setSelectedElement(element);
    layout.setRightPanelOpen(true);
  }, [layout]);

  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    onSave: handleManualSave,
    onPreview: () => setPreviewOpen(true),
    onEscape: () => {
      setPreviewOpen(false);
      layout.setRightPanelOpen(false);
      layout.setSelectedElement(null);
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Carregando editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        page={page}
        device={layout.device}
        onDeviceChange={layout.setDevice}
        autoSave={layout.autoSave}
        onAutoSaveToggle={layout.setAutoSave}
        isSaving={isSaving}
        saveError={!!saveError}
        isDirty={layout.isDirty}
        onPublish={handlePublish}
        onManualSave={handleManualSave}
        showGrid={layout.showGrid}
        onToggleGrid={() => layout.setShowGrid(!layout.showGrid)}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onPreview={() => setPreviewOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onAiPanel={() => setAiPanelOpen((o) => !o)}
        aiPanelOpen={aiPanelOpen}
      />

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar hover zone (40px borda esquerda) */}
        <div
          className="absolute left-0 top-0 w-10 h-full z-20"
          onMouseEnter={() => !layout.rightPanelOpen && layout.setSidebarVisible(true)}
        />

        <Sidebar
          isVisible={layout.sidebarVisible && !layout.rightPanelOpen}
          onMouseEnter={() => layout.setSidebarVisible(true)}
          onMouseLeave={() => layout.setSidebarVisible(false)}
        />

        <Canvas
          page={page}
          device={layout.device}
          onAddBlock={handleAddBlock}
          onCreateFromLayout={handleCreateFromLayout}
          onPageUpdate={handlePageUpdate}
          onElementSelect={handleElementSelect}
          showGrid={layout.showGrid}
        />

        <RightPanel
          isOpen={layout.rightPanelOpen && !aiPanelOpen}
          onClose={() => layout.setRightPanelOpen(false)}
          selectedElement={layout.selectedElement}
        />

        <AiPanel
          pageId={id!}
          pageData={page?.schema}
          selectedElementContent={layout.selectedElement?.content as string | undefined}
          onElementUpdate={(content) => {
            if (!page || !layout.selectedElement) return;
            // Delegate actual update to the editor page update mechanism
            handlePageUpdate({
              ...page,
              schema: page.schema,
            } as Page);
            // Propagate as a clipboard/notification for now
            void navigator.clipboard.writeText(content);
          }}
          isOpen={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
        />
      </div>

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        pageId={id!}
      />

      {settingsOpen && page && (
        <PageSettingsModal
          page={page}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {publishOpen && id && (
        <PublishProgressModal
          pageId={id}
          onClose={() => setPublishOpen(false)}
        />
      )}
    </div>
  );
}
