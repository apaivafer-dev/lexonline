import React, { useState, useEffect } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { DeviceType } from '@/types/editor.types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
}

const DEVICE_CONFIG: Record<DeviceType, { label: string; icon: React.ReactNode; width: number | string; height: number | string }> = {
  desktop: { label: 'Desktop', icon: <Monitor size={14} />, width: '100%', height: '100%' },
  tablet:  { label: 'Tablet',  icon: <Tablet size={14} />,  width: 768,     height: 1024 },
  mobile:  { label: 'Mobile',  icon: <Smartphone size={14} />, width: 375,  height: 667 },
};

export function PreviewModal({ isOpen, onClose, pageId }: PreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  // Reset to desktop on open
  useEffect(() => {
    if (isOpen) setDevice('desktop');
  }, [isOpen]);

  // Close on Escape is handled by useKeyboardShortcuts in PageEditor
  if (!isOpen) return null;

  const config = DEVICE_CONFIG[device];
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const previewUrl = `${base}/preview/${pageId}`;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[100] flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="h-12 bg-slate-900 flex items-center justify-between px-4 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Device toggles */}
        <div className="flex items-center gap-1">
          {(Object.entries(DEVICE_CONFIG) as [DeviceType, typeof DEVICE_CONFIG[DeviceType]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
                device === key
                  ? 'bg-white text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cfg.icon}
              {cfg.label}
            </button>
          ))}
        </div>

        {/* URL hint */}
        <span className="text-slate-500 text-xs font-mono hidden sm:block">{previewUrl}</span>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded transition"
          title="Fechar (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Preview area */}
      <div
        className="flex-1 flex items-center justify-center overflow-auto p-4"
        onClick={onClose}
      >
        <div
          className="bg-white shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: config.width,
            height: device === 'desktop' ? 'calc(100vh - 96px)' : config.height,
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 96px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={previewUrl}
            className="w-full h-full border-none"
            title={`Preview — ${config.label}`}
          />
        </div>
      </div>

      {/* Footer hint */}
      <div className="h-8 flex items-center justify-center flex-shrink-0">
        <p className="text-slate-600 text-xs">
          Pressione{' '}
          <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-xs">Esc</kbd>{' '}
          para fechar
        </p>
      </div>
    </div>
  );
}
