import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppElementProps {
  phone?: string;
  message?: string;
  text?: string;
  floating?: boolean;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function WhatsAppElement({ phone = '5511999999999', message = 'Olá! Gostaria de uma consultoria.', text = 'Falar no WhatsApp', floating = false, styles, onSelect }: WhatsAppElementProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (floating) {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, ...styles }} onClick={onSelect}>
        <a href={href} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition">
          <MessageCircle size={28} className="text-white" />
        </a>
      </div>
    );
  }

  return (
    <a
      href={href}
      style={{ backgroundColor: '#25d366', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', ...styles }}
      className="hover:bg-green-600 transition"
      onClick={onSelect}
    >
      <MessageCircle size={20} />
      {text}
    </a>
  );
}
