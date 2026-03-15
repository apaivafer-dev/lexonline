import { useState, useCallback } from 'react';
import imageApi, { type UploadResponse } from '@/services/imageApi';

interface FileProgress {
  name: string;
  progress: number;
  done: boolean;
  error?: string;
}

const MAX_FILES = 5;

export function useImageUpload(pageId: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, FileProgress>>({});
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (files: File[]): Promise<UploadResponse[]> => {
      if (files.length > MAX_FILES) {
        setError(`Máximo ${MAX_FILES} imagens por vez`);
        return [];
      }

      setError(null);
      setUploading(true);

      // Init progress entries
      const initial: Record<string, FileProgress> = {};
      for (const f of files) {
        initial[f.name] = { name: f.name, progress: 0, done: false };
      }
      setProgress(initial);

      try {
        const results = await Promise.all(
          files.map((file) =>
            imageApi.upload(pageId, file, (pct) => {
              setProgress((prev) => ({
                ...prev,
                [file.name]: { name: file.name, progress: pct, done: pct === 100 },
              }));
            }).catch((err: Error) => {
              setProgress((prev) => ({
                ...prev,
                [file.name]: { name: file.name, progress: 0, done: false, error: err.message },
              }));
              return null;
            }),
          ),
        );

        return results.filter((r): r is UploadResponse => r !== null);
      } catch (err) {
        setError((err as Error).message || 'Erro ao fazer upload');
        return [];
      } finally {
        setUploading(false);
        setTimeout(() => setProgress({}), 2000);
      }
    },
    [pageId],
  );

  return { uploading, progress, error, handleUpload };
}
