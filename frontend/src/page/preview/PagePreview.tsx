import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ElementVisualRenderer } from '@/page/editor/Canvas/ElementVisualRenderer';
import pageApi from '@/services/pageApi';
import type { Page, PageSchema } from '@/types/page.types';

function SectionPreview({ section }: { section: PageSchema }) {
  const ss = section.styles || {};

  const sectionStyle: React.CSSProperties = {};
  if (ss.backgroundColor) sectionStyle.backgroundColor = ss.backgroundColor;
  if (ss.padding) sectionStyle.padding = ss.padding;
  if (ss.textAlign) sectionStyle.textAlign = ss.textAlign as React.CSSProperties['textAlign'];
  if (ss.color) sectionStyle.color = ss.color;

  return (
    <div style={sectionStyle}>
      <div style={{ display: 'flex', gap: '16px', maxWidth: '1200px', margin: '0 auto' }}>
        {section.columns.map((col) => (
          <div key={col.id} style={{ flex: col.width }}>
            {col.elements.map((el) => (
              <div key={el.id} style={{ marginBottom: '4px' }}>
                <ElementVisualRenderer element={el} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PagePreview() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    pageApi.getPageById(id)
      .then((res) => setPage(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-slate-500">Página não encontrada</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {page.schema.map((section) => (
        <SectionPreview key={section.id} section={section} />
      ))}
    </div>
  );
}
