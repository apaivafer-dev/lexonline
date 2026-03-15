import React from 'react';

interface FormElementProps {
  title?: string;
  submitText?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function FormElement({ title = 'Formulário de Contato', submitText = 'Enviar', styles, onSelect }: FormElementProps) {
  return (
    <div style={{ padding: 24, border: '2px dashed #e2e8f0', borderRadius: 12, ...styles }} onClick={onSelect}>
      <h4 className="font-bold text-slate-900 mb-4">{title}</h4>
      <div className="space-y-3">
        <input type="text" placeholder="Nome" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" readOnly />
        <input type="email" placeholder="E-mail" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" readOnly />
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">{submitText}</button>
      </div>
    </div>
  );
}
