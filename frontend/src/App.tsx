import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { PagesGallery } from '@/page/gallery/PagesGallery';
import { TemplatesPage } from '@/page/templates/TemplatesPage';
import { PageEditor } from '@/page/editor/PageEditor';
import { DomainSettings } from '@/page/settings/DomainSettings';
import { CollectionsPage } from '@/page/collections/CollectionsPage';
import { PageAnalytics } from '@/page/analytics/PageAnalytics';
import { PagePreview } from '@/page/preview/PagePreview';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-500">{title}</h1>
    </div>
  );
}

function PageSettingsRoute() {
  const { pageId } = useParams<{ pageId: string }>();
  if (!pageId) return <PlaceholderPage title="Página não encontrada" />;
  return <DomainSettings pageId={pageId} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /page */}
        <Route path="/" element={<Navigate to="/page" replace />} />

        {/* Editor — full screen, sem sidebar */}
        <Route path="/editor/:id" element={<PageEditor />} />

        {/* Preview — renderiza a página sem UI do editor */}
        <Route path="/preview/:id" element={<PagePreview />} />

        {/* Templates — sem sidebar (navegação própria) */}
        <Route path="/page/templates" element={<TemplatesPage />} />

        {/* App com sidebar */}
        <Route
          path="/dashboard"
          element={<AppLayout><PlaceholderPage title="Dashboard" /></AppLayout>}
        />
        <Route
          path="/page"
          element={<AppLayout><PagesGallery /></AppLayout>}
        />
        <Route
          path="/analytics"
          element={<AppLayout><PageAnalytics /></AppLayout>}
        />
        <Route
          path="/leads"
          element={<AppLayout><PlaceholderPage title="Leads" /></AppLayout>}
        />
        <Route
          path="/content"
          element={<AppLayout><PlaceholderPage title="Conteúdo" /></AppLayout>}
        />
        <Route
          path="/collections"
          element={<AppLayout><CollectionsPage /></AppLayout>}
        />
        <Route
          path="/settings"
          element={<AppLayout><PlaceholderPage title="Configurações" /></AppLayout>}
        />
        <Route
          path="/page/:pageId/settings"
          element={<AppLayout><PageSettingsRoute /></AppLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
