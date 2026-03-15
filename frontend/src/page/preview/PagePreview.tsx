import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockRenderer } from '@/page/editor/Canvas/BlockRenderer';
import pageApi from '@/services/pageApi';
import type { Page } from '@/types/page.types';

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
      {page.schema.map((section: any) => (
        <BlockRenderer key={section.id} blockType={section.styles?.blockType ?? section.type} />
      ))}
    </div>
  );
}
