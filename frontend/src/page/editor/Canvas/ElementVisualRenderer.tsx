import React from 'react';
import {
  Image, Play, MessageCircle, HelpCircle, CreditCard,
  Share2, Mail, Phone, MapPin, Star, ChevronDown,
  Briefcase, Eye, Check, Shield, Building2, Scale, Users,
  PhoneCall, type LucideIcon,
} from 'lucide-react';
import type { PageElement } from '@/types/page.types';

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  eye: Eye,
  check: Check,
  shield: Shield,
  'building-2': Building2,
  scale: Scale,
  phone: PhoneCall,
  'credit-card': CreditCard,
  users: Users,
  star: Star,
};

interface Props {
  element: PageElement;
}

export function ElementVisualRenderer({ element }: Props) {
  const s = element.styles || {};

  switch (element.type) {
    // ── HEADING ──
    case 'heading':
      return (
        <div
          style={{
            fontSize: s.fontSize || '24px',
            fontWeight: s.fontWeight || '700',
            color: s.color || '#0f172a',
            textAlign: (s.textAlign as React.CSSProperties['textAlign']) || undefined,
            marginBottom: s.marginBottom || '0',
            lineHeight: '1.3',
          }}
        >
          {element.content || 'Título'}
        </div>
      );

    // ── TEXT / PARAGRAPH ──
    case 'text':
      return (
        <div
          style={{
            fontSize: s.fontSize || '15px',
            fontWeight: s.fontWeight || '400',
            color: s.color || '#475569',
            lineHeight: s.lineHeight || '1.6',
            textAlign: (s.textAlign as React.CSSProperties['textAlign']) || undefined,
            marginBottom: s.marginBottom || '0',
            fontStyle: s.fontStyle || undefined,
            maxWidth: s.maxWidth || undefined,
          }}
        >
          {element.content || 'Texto do parágrafo'}
        </div>
      );

    // ── BUTTON ──
    case 'button':
      return (
        <div style={{ textAlign: (s.textAlign as React.CSSProperties['textAlign']) || undefined }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: s.backgroundColor || '#2563eb',
              color: s.color || '#ffffff',
              padding: s.padding || '10px 24px',
              borderRadius: s.borderRadius || '8px',
              fontSize: s.fontSize || '15px',
              fontWeight: s.fontWeight || '600',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: s.marginTop || undefined,
            }}
          >
            {element.content || 'Botão'}
          </span>
        </div>
      );

    // ── IMAGE ──
    case 'image':
      if (s.src) {
        return (
          <img
            src={s.src}
            srcSet={s.srcset || undefined}
            sizes={s.srcset ? '(min-width: 1200px) 1200px, (min-width: 800px) 800px, 100vw' : undefined}
            alt={element.content || 'Imagem'}
            loading="lazy"
            style={{
              width: s.width || '100%',
              height: s.height || 'auto',
              borderRadius: s.borderRadius || '8px',
              maxWidth: s.maxWidth || undefined,
              margin: s.margin || undefined,
              objectFit: (s.objectFit as React.CSSProperties['objectFit']) || 'cover',
            }}
          />
        );
      }
      return (
        <div
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: s.borderRadius || '8px',
            minHeight: s.minHeight || '120px',
            maxWidth: s.maxWidth || undefined,
            margin: s.margin || undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="text-center text-slate-400">
            <Image size={32} className="mx-auto mb-1" />
            <span className="text-xs">Clique para adicionar imagem</span>
          </div>
        </div>
      );

    // ── VIDEO ──
    case 'video':
      return (
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: s.borderRadius || '12px',
            minHeight: '180px',
            maxWidth: s.maxWidth || undefined,
            margin: s.margin || undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="text-center text-slate-400">
            <Play size={40} className="mx-auto mb-1" />
            <span className="text-xs">Vídeo</span>
          </div>
        </div>
      );

    // ── ICON ──
    case 'icon': {
      const IconComponent = ICON_MAP[element.content || ''] || Star;
      return (
        <div style={{ textAlign: 'center', marginBottom: s.marginBottom || '0' }}>
          <IconComponent
            size={parseInt(s.fontSize || '32', 10)}
            style={{ color: s.color || '#2563eb', margin: '0 auto' }}
          />
        </div>
      );
    }

    // ── FORM ──
    case 'form':
      return (
        <div
          style={{
            backgroundColor: s.backgroundColor || '#f8fafc',
            padding: s.padding || '20px',
            borderRadius: s.borderRadius || '12px',
            maxWidth: s.maxWidth || undefined,
            margin: s.margin || undefined,
          }}
        >
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">Nome</div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">Email</div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">Telefone</div>
            <div className="bg-blue-600 text-white text-center rounded-lg px-3 py-2 text-sm font-medium">Enviar</div>
          </div>
        </div>
      );

    // ── INPUT ──
    case 'input':
      return (
        <div
          style={{
            maxWidth: s.maxWidth || undefined,
            margin: s.margin || undefined,
            marginBottom: s.marginBottom || '0',
          }}
        >
          <div className="bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-400">
            {element.content || 'Digite aqui...'}
          </div>
        </div>
      );

    // ── TESTIMONIAL ──
    case 'testimonial': {
      const meta = element.metadata || {};
      return (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: s.marginBottom || '0',
          }}
        >
          <div className="flex gap-1 mb-2">
            {Array.from({ length: (meta.rating as number) || 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-700 text-sm italic mb-3">"{element.content || 'Depoimento do cliente'}"</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <MessageCircle size={14} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{(meta.author as string) || 'Cliente'}</p>
              {meta.role ? <p className="text-xs text-slate-500">{String(meta.role)}</p> : null}
            </div>
          </div>
        </div>
      );
    }

    // ── STATS COUNTER ──
    case 'stats_counter': {
      const meta = element.metadata || {};
      return (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: s.fontSize || '36px',
              fontWeight: s.fontWeight || '700',
              color: s.color || '#2563eb',
              lineHeight: '1.2',
            }}
          >
            {element.content || '0'}
          </div>
          {meta.label ? (
            <div className="text-sm text-slate-500 mt-1">{String(meta.label)}</div>
          ) : null}
        </div>
      );
    }

    // ── FAQ ──
    case 'faq': {
      const meta = element.metadata || {};
      const items = (meta.items as Array<{ question: string; answer: string }>) || [];
      return (
        <div className="space-y-2" style={{ maxWidth: s.maxWidth || undefined, margin: s.margin || undefined }}>
          {items.length > 0 ? items.map((item, i) => (
            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                <span className="text-sm font-medium text-slate-700">{item.question}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
              <div className="px-4 py-2 text-sm text-slate-500 border-t border-slate-100">{item.answer}</div>
            </div>
          )) : (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center">
              <HelpCircle size={18} />
              FAQ — Perguntas Frequentes
            </div>
          )}
        </div>
      );
    }

    // ── PRICING ──
    case 'pricing':
      return (
        <div className="flex gap-4 justify-center">
          {['Básico', 'Profissional', 'Premium'].map((plan, i) => (
            <div key={plan} className={`border rounded-xl p-5 flex-1 max-w-[200px] text-center ${i === 1 ? 'border-blue-500 shadow-md' : 'border-slate-200'}`}>
              <p className="font-semibold text-sm text-slate-700 mb-1">{plan}</p>
              <p className="text-2xl font-bold text-slate-900 mb-2">R$ {(i + 1) * 99}</p>
              <p className="text-xs text-slate-400">/mês</p>
            </div>
          ))}
        </div>
      );

    // ── SOCIAL ICONS ──
    case 'social_icons':
      return (
        <div className="flex gap-3 items-center" style={{ justifyContent: s.textAlign || undefined }}>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><Share2 size={14} className="text-white" /></div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><Mail size={14} className="text-white" /></div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><Phone size={14} className="text-white" /></div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><MapPin size={14} className="text-white" /></div>
        </div>
      );

    // ── COUNTDOWN ──
    case 'countdown':
      return (
        <div className="flex gap-4 justify-center" style={{ marginBottom: s.marginBottom || '0' }}>
          {[{ v: '02', l: 'Dias' }, { v: '14', l: 'Horas' }, { v: '37', l: 'Min' }, { v: '52', l: 'Seg' }].map((t) => (
            <div key={t.l} className="text-center">
              <div className="text-3xl font-bold text-white bg-slate-900/20 rounded-lg w-16 h-16 flex items-center justify-center">{t.v}</div>
              <span className="text-xs text-white/70 mt-1 block">{t.l}</span>
            </div>
          ))}
        </div>
      );

    // ── LIST ──
    case 'list': {
      const items = (element.content || '').split('\n').filter(Boolean);
      return (
        <ul className="space-y-1" style={{ fontSize: s.fontSize || '15px', color: s.color || '#475569' }}>
          {items.length > 0 ? items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          )) : (
            <li className="text-slate-400 text-sm">Item da lista</li>
          )}
        </ul>
      );
    }

    // ── DIVIDER ──
    case 'divider':
      return <hr className="border-slate-200 my-2" />;

    // ── SPACER ──
    case 'spacer':
      return <div style={{ height: s.height || '32px' }} />;

    // ── FALLBACK ──
    default:
      return (
        <div className="px-3 py-2 bg-slate-50 border border-dashed border-slate-300 rounded text-xs text-slate-500 flex items-center gap-1.5">
          <CreditCard size={12} />
          {element.type}{element.content ? `: ${element.content.substring(0, 40)}` : ''}
        </div>
      );
  }
}
