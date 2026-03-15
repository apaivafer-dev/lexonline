import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export function FooterBlock() {
  return (
    <footer className="w-full bg-slate-900 text-white pt-16 pb-8 px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-3">Escritório de Advocacia</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">Especialistas em direito do consumidor com mais de 15 anos de experiência e 500+ casos resolvidos.</p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-300">Links Rápidos</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            {['Início', 'Sobre', 'Áreas', 'Contato', 'Blog'].map((l) => (
              <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-slate-300">Contato</h4>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2"><Mail size={14} /><span>contato@escritorio.com</span></div>
            <div className="flex items-center gap-2"><Phone size={14} /><span>(11) 9999-9999</span></div>
            <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0" /><span>Av. Paulista, 1000<br/>São Paulo, SP</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-6 text-center">
        <p className="text-slate-500 text-sm">© 2024 Escritório de Advocacia. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
