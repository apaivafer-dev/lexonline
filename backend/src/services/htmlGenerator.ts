import type { PageSettings } from '@/types/page.types';
import jsGenerator from './jsGenerator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredElement {
  id: string;
  type: string;
  content?: string;
  styles?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

interface StoredColumn {
  id: string;
  width: number;
  elements: StoredElement[];
}

interface StoredSection {
  id: string;
  type: string;
  styles?: Record<string, string>;
  columns: StoredColumn[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function camelToKebab(s: string): string {
  return s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}

/** Convert a styles Record<string,string> to an inline style string */
function inlineStyle(styles?: Record<string, string>): string {
  if (!styles) return '';
  return Object.entries(styles)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${camelToKebab(k)}:${v}`)
    .join(';');
}

function styleAttr(styles?: Record<string, string>): string {
  const s = inlineStyle(styles);
  return s ? ` style="${s}"` : '';
}

// ─── Critical CSS ─────────────────────────────────────────────────────────────

const CRITICAL_CSS = `
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;line-height:1.6;color:#333;}
img{max-width:100%;height:auto;display:block;}
a{color:inherit;text-decoration:none;}
button{cursor:pointer;border:none;background:none;}
.lex-page{width:100%;}
.lex-section{width:100%;padding:40px 16px;}
.lex-row{display:flex;flex-wrap:wrap;max-width:1200px;margin:0 auto;gap:16px;}
.lex-col{flex:1 1 0;min-width:200px;}
.lex-faq details summary{cursor:pointer;padding:12px 0;font-weight:600;list-style:none;}
.lex-faq details summary::-webkit-details-marker{display:none;}
.lex-faq details .faq-body{padding:8px 0 16px;}
.lex-stats-counter{text-align:center;padding:20px;}
.sc-val{font-size:2.5rem;font-weight:700;display:block;}
.sc-label{font-size:0.875rem;color:#666;}
.lex-countdown{display:flex;gap:16px;justify-content:center;}
.cd-unit{text-align:center;}
.cd-num{font-size:2rem;font-weight:700;display:block;}
.cd-lbl{font-size:0.75rem;text-transform:uppercase;color:#666;}
.lex-divider{border:none;border-top:1px solid #e5e7eb;}
.lex-whatsapp-btn{position:fixed;bottom:20px;z-index:999;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.18);text-decoration:none;}
#lgpd-banner{position:fixed;left:0;right:0;z-index:998;padding:16px 24px;font-size:.875rem;}
#lgpd-banner p{margin-bottom:8px;}
.lgpd-actions{display:flex;gap:8px;justify-content:center;}
.form-success{display:none;color:#16a34a;margin-top:8px;}
.btn-submit{display:inline-flex;align-items:center;justify-content:center;padding:10px 24px;border-radius:6px;font-weight:600;cursor:pointer;}
@media(max-width:768px){
  .lex-row{flex-direction:column;}
  .lex-col{min-width:100%;}
  .hidden-mobile{display:none!important;}
}
@media(min-width:769px) and (max-width:1024px){.hidden-tablet{display:none!important;}}
@media(min-width:1025px){.hidden-desktop{display:none!important;}}
`.trim();

// ─── Element renderer ─────────────────────────────────────────────────────────

function renderElement(el: StoredElement): string {
  const s = styleAttr(el.styles);
  const m = el.metadata ?? {};
  const text = el.content ?? '';

  const visClasses = [
    m.visibleOnMobile === false ? 'hidden-mobile' : '',
    m.visibleOnTablet === false ? 'hidden-tablet' : '',
    m.visibleOnDesktop === false ? 'hidden-desktop' : '',
    String(m.customClasses ?? ''),
  ]
    .filter(Boolean)
    .join(' ');

  const idAttr = m.customId ? ` id="${escHtml(String(m.customId))}"` : '';

  switch (el.type) {
    case 'heading': {
      const tag = String(m.tag ?? m.level ?? 'h2');
      const lvl = /^h[1-6]$/.test(tag) ? tag : 'h2';
      return `<${lvl} class="${visClasses}"${idAttr}${s}>${escHtml(text)}</${lvl}>`;
    }

    case 'text':
      return `<p class="${visClasses}"${idAttr}${s}>${escHtml(text)}</p>`;

    case 'rich_text':
      // content is HTML — trust it (editor sanitises)
      return `<div class="lex-rich ${visClasses}"${idAttr}${s}>${text}</div>`;

    case 'list': {
      const items = (m.items as string[]) ?? text.split('\n').filter(Boolean);
      const ordered = m.ordered === true;
      const tag = ordered ? 'ol' : 'ul';
      const liHtml = items.map((i) => `<li>${escHtml(i)}</li>`).join('');
      return `<${tag} class="${visClasses}"${idAttr}${s}>${liHtml}</${tag}>`;
    }

    case 'quote':
      return `<blockquote class="${visClasses}"${idAttr}${s}><p>${escHtml(text)}</p>${
        m.author ? `<cite>${escHtml(String(m.author))}</cite>` : ''
      }</blockquote>`;

    case 'highlight':
      return `<div class="lex-highlight ${visClasses}"${idAttr}${s}>${escHtml(text)}</div>`;

    case 'image': {
      const src = escHtml(String(m.src ?? m.url ?? ''));
      const alt = escHtml(String(m.alt ?? ''));
      const srcset = m.srcset ? ` srcset="${escHtml(String(m.srcset))}"` : '';
      const sizes = m.sizes ? ` sizes="${escHtml(String(m.sizes))}"` : '';
      return `<img src="${src}" alt="${alt}"${srcset}${sizes} loading="lazy" class="${visClasses}"${idAttr}${s}>`;
    }

    case 'video': {
      const src = String(m.src ?? '');
      const ytMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        return `<div class="lex-video-wrap ${visClasses}"${idAttr} style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;${inlineStyle(el.styles)}"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
      }
      const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `<div class="lex-video-wrap ${visClasses}"${idAttr} style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;${inlineStyle(el.styles)}"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe></div>`;
      }
      return `<video class="${visClasses}"${idAttr}${s} controls src="${escHtml(src)}"></video>`;
    }

    case 'button': {
      const href = String(m.href ?? m.link ?? '');
      const target = m.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
      const label = escHtml(text || String(m.label ?? 'Clique aqui'));
      if (href) {
        return `<a href="${escHtml(href)}"${target} class="lex-btn ${visClasses}"${idAttr}${s}>${label}</a>`;
      }
      return `<button type="button" class="lex-btn ${visClasses}"${idAttr}${s}>${label}</button>`;
    }

    case 'icon_button': {
      const href = String(m.href ?? '');
      const icon = String(m.icon ?? '');
      const label = escHtml(text || String(m.label ?? ''));
      if (href) {
        return `<a href="${escHtml(href)}" class="lex-icon-btn ${visClasses}"${idAttr}${s}>${icon} ${label}</a>`;
      }
      return `<button type="button" class="lex-icon-btn ${visClasses}"${idAttr}${s}>${icon} ${label}</button>`;
    }

    case 'html_custom':
      return `<div class="lex-custom ${visClasses}"${idAttr}${s}>${text}</div>`;

    case 'spacer':
      return `<div class="lex-spacer ${visClasses}"${idAttr}${s}></div>`;

    case 'divider':
      return `<hr class="lex-divider ${visClasses}"${idAttr}${s}>`;

    case 'map': {
      const loc = encodeURIComponent(String(m.location ?? 'Brasil'));
      return `<div class="lex-map ${visClasses}"${idAttr}${s}><iframe src="https://maps.google.com/maps?q=${loc}&output=embed" width="100%" height="400" frameborder="0" loading="lazy" allowfullscreen></iframe></div>`;
    }

    case 'countdown': {
      const targetDate = escHtml(String(m.targetDate ?? m.date ?? ''));
      return `<div class="lex-countdown ${visClasses}"${idAttr}${s} data-date="${targetDate}">
  <div class="cd-unit"><span class="cd-num cd-d">0</span><span class="cd-lbl">dias</span></div>
  <div class="cd-unit"><span class="cd-num cd-h">0</span><span class="cd-lbl">horas</span></div>
  <div class="cd-unit"><span class="cd-num cd-m">00</span><span class="cd-lbl">min</span></div>
  <div class="cd-unit"><span class="cd-num cd-s">00</span><span class="cd-lbl">seg</span></div>
</div>`;
    }

    case 'stats_counter': {
      const target = String(m.target ?? m.value ?? '0');
      const label = escHtml(String(m.label ?? ''));
      return `<div class="lex-stats-counter ${visClasses}"${idAttr}${s} data-target="${escHtml(target)}">
  <span class="sc-val">0</span>
  <span class="sc-label">${label}</span>
</div>`;
    }

    case 'faq': {
      const items = (m.items as Array<{ question: string; answer: string }>) ?? [];
      const faqs = items
        .map((item) => `<details class="faq-item">
  <summary>${escHtml(item.question)}</summary>
  <div class="faq-body">${escHtml(item.answer)}</div>
</details>`)
        .join('\n');
      return `<div class="lex-faq ${visClasses}"${idAttr}${s}>${faqs}</div>`;
    }

    case 'form': {
      const formId = el.id;
      const submitText = escHtml(String(m.submitText ?? 'Enviar'));
      return `<form class="lex-form ${visClasses}"${idAttr}${s} data-form-id="${formId}">
  <div class="form-fields"></div>
  <button type="submit" class="btn-submit">${submitText}</button>
  <p class="form-success">Enviado com sucesso!</p>
</form>`;
    }

    case 'input': {
      const name = escHtml(String(m.name ?? m.fieldName ?? ''));
      const placeholder = escHtml(String(m.placeholder ?? ''));
      const required = m.required ? ' required' : '';
      const type = escHtml(String(m.inputType ?? 'text'));
      return `<input type="${type}" name="${name}" placeholder="${placeholder}"${required} class="lex-input ${visClasses}"${idAttr}${s}>`;
    }

    case 'textarea': {
      const name = escHtml(String(m.name ?? ''));
      const placeholder = escHtml(String(m.placeholder ?? ''));
      const required = m.required ? ' required' : '';
      return `<textarea name="${name}" placeholder="${placeholder}"${required} rows="${m.rows ?? 4}" class="lex-textarea ${visClasses}"${idAttr}${s}></textarea>`;
    }

    case 'select': {
      const name = escHtml(String(m.name ?? ''));
      const opts = (m.options as string[]) ?? [];
      const options = opts.map((o) => `<option value="${escHtml(o)}">${escHtml(o)}</option>`).join('');
      return `<select name="${name}" class="lex-select ${visClasses}"${idAttr}${s}>${options}</select>`;
    }

    case 'checkbox': {
      const name = escHtml(String(m.name ?? ''));
      const label = escHtml(text || String(m.label ?? ''));
      return `<label class="lex-checkbox ${visClasses}"${idAttr}${s}><input type="checkbox" name="${name}"> ${label}</label>`;
    }

    case 'radio': {
      const name = escHtml(String(m.name ?? 'radio'));
      const value = escHtml(String(m.value ?? ''));
      const label = escHtml(text || String(m.label ?? ''));
      return `<label class="lex-radio ${visClasses}"${idAttr}${s}><input type="radio" name="${name}" value="${value}"> ${label}</label>`;
    }

    case 'whatsapp': {
      const phone = String(m.phoneNumber ?? m.phone ?? '').replace(/\D/g, '');
      const msg = encodeURIComponent(String(m.message ?? m.defaultMessage ?? ''));
      return `<a href="https://wa.me/55${phone}?text=${msg}" target="_blank" rel="noopener noreferrer" class="lex-btn-wa ${visClasses}"${idAttr}${s}>WhatsApp</a>`;
    }

    case 'social_icons': {
      const links = (m.links as Array<{ platform: string; url: string }>) ?? [];
      const icons = links
        .map((l) => `<a href="${escHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="social-${escHtml(l.platform)}">${escHtml(l.platform)}</a>`)
        .join(' ');
      return `<div class="lex-social ${visClasses}"${idAttr}${s}>${icons}</div>`;
    }

    case 'testimonial': {
      const author = escHtml(String(m.author ?? m.name ?? ''));
      const role = escHtml(String(m.role ?? m.position ?? ''));
      const avatar = escHtml(String(m.avatar ?? ''));
      return `<blockquote class="lex-testimonial ${visClasses}"${idAttr}${s}>
  <p>${escHtml(text)}</p>
  <footer>${avatar ? `<img src="${avatar}" alt="${author}" style="width:40px;height:40px;border-radius:50%;">` : ''}
    <cite><strong>${author}</strong>${role ? ` — ${role}` : ''}</cite>
  </footer>
</blockquote>`;
    }

    case 'section':
    case 'container':
      // Nested container — render as div
      return `<div class="lex-container ${visClasses}"${idAttr}${s}></div>`;

    default:
      // Unknown element — skip silently
      return '';
  }
}

// ─── Section/Column renderer ──────────────────────────────────────────────────

function renderSection(section: StoredSection): string {
  const s = styleAttr(section.styles);
  const cols = section.columns ?? [];

  const colsHtml = cols
    .map((col) => {
      const colStyle = `flex:0 0 ${col.width}%;max-width:${col.width}%;`;
      const elementsHtml = (col.elements ?? []).map(renderElement).join('\n');
      return `<div style="${colStyle}" class="lex-col">${elementsHtml}</div>`;
    })
    .join('\n');

  return `<section class="lex-section"${s}>\n<div class="lex-row">\n${colsHtml}\n</div>\n</section>`;
}

// ─── Analytics scripts ────────────────────────────────────────────────────────

function analyticsScripts(analytics?: PageSettings['analytics']): string {
  if (!analytics) return '';
  let out = '';

  if (analytics.ga4Id) {
    out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analytics.ga4Id}');</script>`;
  }
  if (analytics.gtmId) {
    out += `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analytics.gtmId}');</script>`;
  }
  if (analytics.metaPixelId) {
    const pageview = analytics.metaPixelPageView !== false ? "fbq('track','PageView');" : '';
    out += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${analytics.metaPixelId}');${pageview}</script>`;
  }
  if (analytics.hotjarId) {
    out += `<script>(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${analytics.hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');</script>`;
  }
  return out;
}

// ─── WhatsApp floating button ─────────────────────────────────────────────────

function whatsAppButton(wa: NonNullable<PageSettings['whatsapp']>): string {
  if (!wa.enabled) return '';
  const phone = (wa.phoneNumber ?? '').replace(/\D/g, '');
  const msg = encodeURIComponent(wa.defaultMessage ?? '');
  const side = wa.position === 'bottom-left' ? 'left:20px' : 'right:20px';
  return `<a href="https://wa.me/55${phone}?text=${msg}" target="_blank" rel="noopener noreferrer" class="lex-whatsapp-btn" style="${side}" title="WhatsApp">
<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.15-1.739-.857-2.008-.96-.27-.102-.459-.15-.652.15-.193.297-.748.96-.917 1.155-.168.194-.337.21-.634.02-.297-.192-1.256-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.652-1.566-.893-2.145-.235-.572-.474-.495-.652-.503-.168-.007-.36-.007-.552-.007-.192 0-.505.072-.769.359-.264.287-1.006.982-1.006 2.4 0 1.418 1.03 2.778 1.175 2.965.145.187 2.057 3.142 4.982 4.402.693.3 1.233.476 1.655.61.695.227 1.327.195 1.826.118.557-.084 1.717-.702 1.958-1.379.242-.678.242-1.256.169-1.379-.073-.123-.268-.195-.56-.344m-5.334-7.431c1.052 0 2.062.411 2.811 1.151.748.74 1.162 1.728 1.162 2.776 0 2.181-1.784 3.967-3.973 3.967-1.052 0-2.062-.411-2.811-1.151-.748-.74-1.162-1.728-1.162-2.776 0-2.181 1.784-3.967 3.973-3.967M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0"/></svg>
</a>`;
}

// ─── LGPD banner ──────────────────────────────────────────────────────────────

function lgpdBanner(lgpd: NonNullable<PageSettings['lgpd']>): string {
  if (!lgpd.enabled) return '';
  const pos = lgpd.position === 'top' ? 'top:0' : 'bottom:0';
  const bg = escHtml(lgpd.backgroundColor ?? '#1f2937');
  const txt = escHtml(lgpd.text ?? 'Utilizamos cookies para melhorar sua experiência.');
  const privacyLink = lgpd.privacyLink
    ? ` <a href="${escHtml(lgpd.privacyLink)}" target="_blank" style="color:#93c5fd;text-decoration:underline;">Política de Privacidade</a>`
    : '';
  return `<div id="lgpd-banner" style="${pos};background-color:${bg};color:#fff;text-align:center;">
<p>${txt}${privacyLink}</p>
<div class="lgpd-actions">
  <button id="lgpd-accept" style="background:#fff;color:#1f2937;padding:6px 20px;border-radius:4px;font-weight:600;">Aceitar</button>
  <button id="lgpd-reject" style="border:1px solid #fff;color:#fff;background:transparent;padding:6px 20px;border-radius:4px;">Rejeitar</button>
</div>
</div>`;
}

// ─── Main generator ───────────────────────────────────────────────────────────

class HTMLGenerator {
  generate(
    pageId: string,
    pageTitle: string,
    schema: unknown[],
    settings: PageSettings,
  ): string {
    const sections = schema as StoredSection[];
    const seo = settings.seo ?? {};
    const title = escHtml(seo.title || pageTitle || 'Página');
    const description = escHtml(seo.metaDescription ?? '');
    const slug = seo.slug ?? '';

    // ── <head> ───────────────────────────────────────────────────────────────
    let head = `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='32' font-size='32'>📄</text></svg>">
`;

    if (slug) head += `<link rel="canonical" href="https://lexonline.com/${escHtml(slug)}">\n`;
    if (seo.indexable === false) head += `<meta name="robots" content="noindex,nofollow">\n`;

    // OG tags
    head += `<meta property="og:type" content="website">\n`;
    head += `<meta property="og:title" content="${title}">\n`;
    head += `<meta property="og:description" content="${description}">\n`;
    if (seo.ogImage) head += `<meta property="og:image" content="${escHtml(seo.ogImage)}">\n`;

    // Keywords
    if (seo.keywords?.length) {
      head += `<meta name="keywords" content="${escHtml(seo.keywords.join(', '))}">\n`;
    }

    // Fonts
    head += `<link rel="preconnect" href="https://fonts.googleapis.com">\n`;
    head += `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">\n`;

    // Critical CSS
    head += `<style>${CRITICAL_CSS}</style>\n`;

    // Analytics
    head += analyticsScripts(settings.analytics);

    head += `</head>`;

    // ── <body> ────────────────────────────────────────────────────────────────
    let body = `<body>`;

    // GTM noscript
    if (settings.analytics?.gtmId) {
      body += `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.analytics.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n`;
    }

    // Main content
    body += `<main class="lex-page">\n`;
    body += sections.map(renderSection).join('\n');
    body += `\n</main>\n`;

    // WhatsApp button
    if (settings.whatsapp?.enabled && settings.whatsapp.phoneNumber) {
      body += whatsAppButton(settings.whatsapp);
    }

    // LGPD banner
    if (settings.lgpd?.enabled) {
      body += lgpdBanner(settings.lgpd);
    }

    // Inline JS
    body += `<script>${jsGenerator.generate(pageId)}</script>\n`;
    body += `</body>`;

    return `<!DOCTYPE html>\n<html lang="pt-BR">\n${head}\n${body}\n</html>`;
  }
}

export default new HTMLGenerator();
