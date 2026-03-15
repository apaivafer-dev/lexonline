import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterBlock() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="w-full py-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-center">
      <Mail size={48} className="mx-auto mb-4 text-white/80" />
      <h2 className="text-3xl font-bold text-white mb-3">Receba Dicas Jurídicas Exclusivas</h2>
      <p className="text-blue-100 mb-8 text-lg">Inscreva-se em nossa newsletter semanal e fique informado sobre seus direitos</p>
      {subscribed ? (
        <div className="bg-white/20 rounded-xl px-8 py-4 inline-block">
          <p className="text-white font-semibold">✓ Inscrição confirmada! Obrigado.</p>
        </div>
      ) : (
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={() => email && setSubscribed(true)}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            Inscrever
          </button>
        </div>
      )}
      <p className="text-blue-200 text-xs mt-4">Sem spam. Cancele quando quiser.</p>
    </div>
  );
}
