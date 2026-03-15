import React from 'react';
import {
  Type, AlignLeft, List, Quote, Highlighter, Image, Play, Star, Grid2x2, Zap,
  MousePointer2, Circle, Code, FileText, ChevronDown, CheckSquare, CircleDot,
  Layout, Box, Columns2, Maximize2, Minus, Clock, MessageCircle, CreditCard,
  HelpCircle, BarChart3, Share2, MapPin, Layers, Shuffle, Square, TrendingUp,
  Settings, Heading1,
} from 'lucide-react';
import type { ElementMeta } from '@/types/element.types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Type, AlignLeft, List, Quote, Highlighter, Image, Play, Star, Grid2x2, Zap,
  MousePointer2, Circle, Code, FileText, ChevronDown, CheckSquare, CircleDot,
  Layout, Box, Columns2, Maximize2, Minus, Clock, MessageCircle, CreditCard,
  HelpCircle, BarChart3, Share2, MapPin, Layers, Shuffle, Square, TrendingUp,
  Settings, Heading1,
};

interface ElementCardProps {
  element: ElementMeta;
}

export function ElementCard({ element }: ElementCardProps) {
  const Icon = ICON_MAP[element.icon] ?? Type;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('element-type', element.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-slate-200 cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:border-blue-300 transition group"
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <Icon size={20} className="text-slate-500 group-hover:text-blue-600 transition" />
      </div>
      <p className="text-xs font-medium text-slate-600 group-hover:text-blue-700 text-center leading-tight transition">
        {element.name}
      </p>
    </div>
  );
}
