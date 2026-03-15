import React, { useState } from 'react';

interface SliderInputProps {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
}

export function SliderInput({ value = 0, onChange, min = 0, max = 100, step = 1, unit = '', label }: SliderInputProps) {
  const [inputValue, setInputValue] = useState(String(value));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setInputValue(String(v));
    onChange(v);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
  };

  return (
    <div>
      {label && <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          className="flex-1 accent-blue-600 h-1.5"
        />
        <div className="flex items-center gap-0.5 border border-slate-300 rounded-lg overflow-hidden min-w-[64px]">
          <input
            type="number"
            value={inputValue}
            onChange={handleInput}
            min={min}
            max={max}
            step={step}
            className="w-12 px-2 py-1 text-xs text-right outline-none"
          />
          {unit && <span className="text-xs text-slate-400 pr-1.5">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
