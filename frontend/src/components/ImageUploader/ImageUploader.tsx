import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { UploadResponse } from '@/services/imageApi';

interface ImageUploaderProps {
  pageId: string;
  onUploaded?: (images: UploadResponse[]) => void;
}

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';

export function ImageUploader({ pageId, onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploading, progress, error, handleUpload } = useImageUpload(pageId);

  const processFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;
    const results = await handleUpload(images);
    if (results.length > 0) onUploaded?.(results);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.currentTarget.files ?? []));
    e.currentTarget.value = '';
  };

  const progressEntries = Object.values(progress);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : uploading
              ? 'border-slate-200 bg-slate-50 cursor-default'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          onChange={onChange}
          className="hidden"
        />
        <Upload size={32} className="mx-auto mb-3 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          {uploading ? 'Enviando...' : 'Arraste imagens ou clique para selecionar'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Até 5 imagens, máx 10MB cada — JPEG, PNG, WebP, GIF, SVG
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Per-file progress bars */}
      {progressEntries.length > 0 && (
        <div className="space-y-2">
          {progressEntries.map((f) => (
            <div key={f.name}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="truncate max-w-48">{f.name}</span>
                <span>{f.error ? 'Erro' : f.done ? '✓' : `${f.progress}%`}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${f.error ? 'bg-red-500' : f.done ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${f.error ? 100 : f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
