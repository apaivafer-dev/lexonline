import { useState } from 'react';

export function ContactBlock() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="w-full py-16 px-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Mensagem Enviada!</h3>
        <p className="text-slate-600">Entraremos em contato em até 24 horas.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3 text-slate-900">Entre em Contato</h2>
        <p className="text-slate-600 text-center mb-8">Preencha o formulário e entraremos em contato em até 24 horas</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Seu nome completo" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input type="email" placeholder="Seu e-mail" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <input type="tel" placeholder="Telefone / WhatsApp" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          <input type="text" placeholder="Assunto" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          <textarea rows={4} placeholder="Descreva brevemente seu caso..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
          <button onClick={() => setSubmitted(true)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg">
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
}
