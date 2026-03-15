import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { ColorPicker } from '../controls/ColorPicker';
import { SliderInput } from '../controls/SliderInput';
import { FontSelector } from '../controls/FontSelector';
import { AnimSelector } from '../controls/AnimSelector';
import { STYLE_GROUPS } from '@/constants/elements.constants';
import type { SelectedElement } from '@/types/editor.types';
import type { StylePropDef } from '@/types/element.types';

interface StyleTabProps {
  element: SelectedElement;
  onUpdate: (data: Partial<SelectedElement>) => void;
}

function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();
  return useCallback((...args: any[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]) as T;
}

export function StyleTab({ element, onUpdate }: StyleTabProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Cores', 'Tipografia', 'Espaçamento']));

  const updateStyle = useDebounce((key: string, value: string) => {
    onUpdate({ styles: { ...element.styles, [key]: value } });
  }, 300);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const renderControl = (prop: StylePropDef) => {
    const currentValue = element.styles[prop.key] ?? '';

    switch (prop.type) {
      case 'color-picker':
        return (
          <ColorPicker
            value={currentValue || '#000000'}
            onChange={(v) => updateStyle(prop.key, v)}
          />
        );

      case 'slider':
        return (
          <SliderInput
            value={parseFloat(currentValue) || (prop.min ?? 0)}
            onChange={(v) => updateStyle(prop.key, prop.unit ? `${v}${prop.unit}` : String(v))}
            min={prop.min}
            max={prop.max}
            step={prop.step}
            unit={prop.unit}
          />
        );

      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => updateStyle(prop.key, e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">--</option>
            {prop.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            defaultValue={parseFloat(currentValue) || 0}
            min={prop.min}
            max={prop.max}
            onChange={(e) => updateStyle(prop.key, e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'input':
        return (
          <input
            type="text"
            defaultValue={currentValue}
            placeholder={prop.placeholder}
            onChange={(e) => updateStyle(prop.key, e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'font-selector':
        return (
          <FontSelector
            value={currentValue || 'System Default'}
            onChange={(v) => updateStyle(prop.key, v === 'System Default' ? '' : v)}
          />
        );

      case 'anim-selector':
        return (
          <AnimSelector
            value={currentValue || 'none'}
            onChange={(v) => updateStyle(prop.key, v)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="divide-y divide-slate-100">
      {STYLE_GROUPS.map((group) => (
        <div key={group.name}>
          <button
            onClick={() => toggleGroup(group.name)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition text-sm font-semibold text-slate-800"
          >
            {group.name}
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${openGroups.has(group.name) ? 'rotate-180' : ''}`}
            />
          </button>

          {openGroups.has(group.name) && (
            <div className="px-4 pb-4 space-y-3">
              {group.props.map((prop) => (
                <div key={prop.key}>
                  <label className="block text-xs text-slate-500 mb-1">{prop.label}</label>
                  {renderControl(prop)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
