# LEX_SITE11 — Fase 6: Great Loader Engine — Publicação HTML

## Objetivo
Motor de publicação completo que transforma JSON → HTML estático otimizado (<50KB), PageSpeed >90, zero React runtime.

## Dependência
- Fase 4 (Upload de Imagens)
- Fase 5 (SEO + Analytics + WhatsApp + LGPD)

## Estrutura de Arquivos

### Backend Services
- `backend/src/services/htmlGenerator.ts` - Gerador HTML5 semântico
- `backend/src/services/cssGenerator.ts` - Gerador CSS com classes únicas
- `backend/src/services/jsGenerator.ts` - JS nativo (<3KB)
- `backend/src/services/schemaGenerator.ts` - JSON-LD (FAQPage, LocalBusiness, Person)
- `backend/src/services/minifier.ts` - html-minifier-terser + cssnano
- `backend/src/services/firebaseDeployer.ts` - Deploy Firebase Hosting
- `backend/src/services/thumbnailService.ts` - Puppeteer screenshot
- `backend/src/controllers/publishController.ts` - Orquestrador
- `backend/src/services/bindingRenderer.ts` - Renderização de bindings {{}}

### Frontend
- `frontend/src/hooks/usePublish.ts` - Hook para publicar
- `frontend/src/components/TopBar/PublishProgress.tsx` - Modal progresso animado

## Implementação Detalhada

### htmlGenerator.ts

```typescript
import { PageJSON, ElementJSON } from '../types';

class HTMLGenerator {
  generate(page: PageJSON, settings: PageSettings): string {
    let html = '<!DOCTYPE html>\n<html lang="pt-BR">\n';

    // HEAD com SEO, analytics, fonts
    html += this.generateHead(page, settings);

    // BODY com elementos
    html += '<body>\n';

    // GTM noscript
    if (settings.analytics?.gtmId) {
      html += `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.analytics.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n`;
    }

    // Main content
    html += '<main id="content">\n';

    // Renderizar elementos recursivamente
    html += this.renderElements(page.elements, page);

    html += '</main>\n';

    // WhatsApp flutuante
    if (settings.whatsapp?.enabled) {
      html += this.generateWhatsAppButton(settings.whatsapp);
    }

    // LGPD banner
    if (settings.lgpd?.enabled) {
      html += this.generateLgpdBanner(settings.lgpd);
    }

    // Scripts
    html += '<script>\n';
    html += this.generateInlineJS(page, settings);
    html += '</script>\n';

    html += '</body>\n</html>';

    return html;
  }

  private generateHead(page: PageJSON, settings: PageSettings): string {
    let head = `<head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${this.escapeHtml(settings.seo?.title || page.title || '')}</title>
      <meta name="description" content="${this.escapeHtml(settings.seo?.metaDescription || '')}" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='32' font-size='32'>📄</text></svg>" />
    `;

    // Canonical URL
    if (settings.seo?.slug) {
      head += `<link rel="canonical" href="https://lexonline.com/${settings.seo.slug}" />\n`;
    }

    // Meta robots
    if (settings.seo?.indexable === false) {
      head += `<meta name="robots" content="noindex, nofollow" />\n`;
    }

    // OG tags
    if (settings.seo?.ogImage) {
      head += `<meta property="og:image" content="${this.escapeHtml(settings.seo.ogImage)}" />\n`;
    }
    head += `<meta property="og:type" content="website" />\n`;
    head += `<meta property="og:title" content="${this.escapeHtml(settings.seo?.title || '')}" />\n`;
    head += `<meta property="og:description" content="${this.escapeHtml(settings.seo?.metaDescription || '')}" />\n`;

    // Google Fonts (coletar do CSS)
    head += `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />\n`;

    // Inline CSS crítico
    head += '<style>\n';
    head += this.generateCriticalCSS();
    head += '\n</style>\n';

    // Analytics scripts no head
    head += this.generateAnalyticsScripts(settings.analytics);

    head += '</head>\n';
    return head;
  }

  private renderElements(elements: ElementJSON[], page: PageJSON, depth: number = 0): string {
    let html = '';

    for (const element of elements) {
      html += this.renderElement(element, page);
    }

    return html;
  }

  private renderElement(element: ElementJSON, page: PageJSON): string {
    let html = '';

    // Visibilidade responsiva
    const mobileClass = element.props.visibleOn?.mobile === false ? 'hidden-mobile' : '';
    const tabletClass = element.props.visibleOn?.tablet === false ? 'hidden-tablet' : '';
    const desktopClass = element.props.visibleOn?.desktop === false ? 'hidden-desktop' : '';

    const classAttr = `class="${element.id} ${element.type} ${mobileClass} ${tabletClass} ${desktopClass} ${element.props.customClasses || ''}"`;
    const idAttr = element.props.customId ? `id="${element.props.customId}"` : '';

    // Inline styles
    const styles = this.generateInlineStyles(element.props);
    const styleAttr = styles ? `style="${styles}"` : '';

    // Por tipo de elemento
    switch (element.type) {
      case 'heading':
        const level = element.props.level || 'h1';
        html += `<${level} ${classAttr} ${idAttr} ${styleAttr}>`;
        html += this.escapeHtml(element.props.text || '');
        html += `</${level}>`;
        break;

      case 'text':
        html += `<p ${classAttr} ${idAttr} ${styleAttr}>`;
        html += this.renderBindings(element.props.text || '', page);
        html += `</p>`;
        break;

      case 'image':
        html += `<img ${classAttr} ${idAttr} ${styleAttr}
          src="${this.escapeHtml(element.props.src || '')}"
          ${element.props.srcset ? `srcset="${this.escapeHtml(element.props.srcset)}"` : ''}
          ${element.props.sizes ? `sizes="${this.escapeHtml(element.props.sizes)}"` : ''}
          alt="${this.escapeHtml(element.props.alt || '')}"
          loading="lazy"
        />`;
        break;

      case 'button':
        html += `<button ${classAttr} ${idAttr} ${styleAttr} type="button">`;
        html += this.escapeHtml(element.props.text || 'Botão');
        html += `</button>`;
        break;

      case 'section':
      case 'container':
        html += `<section ${classAttr} ${idAttr} ${styleAttr}>`;
        html += this.renderElements(element.children || [], page);
        html += `</section>`;
        break;

      case 'video':
        // YouTube embed
        if (element.props.src?.includes('youtube')) {
          const videoId = element.props.src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
          html += `<iframe ${classAttr} ${idAttr} ${styleAttr}
            width="560" height="315"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>`;
        }
        break;

      case 'form':
        html += `<form ${classAttr} ${idAttr} ${styleAttr} data-form-id="${element.id}">`;
        html += this.renderElements(element.children || [], page);
        html += `<button type="submit" class="btn-submit">Enviar</button>`;
        html += `</form>`;
        break;

      case 'input':
        html += `<input ${classAttr} ${idAttr} ${styleAttr}
          type="text"
          name="${element.props.name || ''}"
          placeholder="${this.escapeHtml(element.props.placeholder || '')}"
          ${element.props.required ? 'required' : ''}
        />`;
        break;

      case 'faq':
        html += `<div ${classAttr} ${idAttr} ${styleAttr} class="faq-container">`;
        (element.props.items || []).forEach((item: any, idx: number) => {
          html += `
            <details class="faq-item">
              <summary>${this.escapeHtml(item.question)}</summary>
              <div class="faq-answer">${this.renderBindings(item.answer, page)}</div>
            </details>
          `;
        });
        html += `</div>`;
        break;

      case 'countdown':
        html += `<div ${classAttr} ${idAttr} ${styleAttr} class="countdown" data-date="${element.props.targetDate}">`;
        html += `<span class="countdown-days">0</span><span class="countdown-label">dias</span>`;
        html += `<span class="countdown-hours">0</span><span class="countdown-label">horas</span>`;
        html += `<span class="countdown-minutes">0</span><span class="countdown-label">minutos</span>`;
        html += `<span class="countdown-seconds">0</span><span class="countdown-label">segundos</span>`;
        html += `</div>`;
        break;

      case 'stats_counter':
        html += `<div ${classAttr} ${idAttr} ${styleAttr} class="stats-counter" data-target="${element.props.target || 0}">`;
        html += `<span class="stats-value">0</span>`;
        html += `<span class="stats-label">${this.escapeHtml(element.props.label || '')}</span>`;
        html += `</div>`;
        break;

      case 'whatsapp':
        html += `<a ${classAttr} ${idAttr} ${styleAttr}
          href="https://wa.me/55${element.props.phoneNumber?.replace(/\D/g, '')}"
          target="_blank"
          rel="noopener noreferrer"
          class="whatsapp-button"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.15-1.739-.857-2.008-.96-.27-.102-.459-.15-.652.15-.193.297-.748.96-.917 1.155-.168.194-.337.21-.634.02-.297-.192-1.256-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.652-1.566-.893-2.145-.235-.572-.474-.495-.652-.503-.168-.007-.36-.007-.552-.007-.192 0-.505.072-.769.359-.264.287-1.006 .982-1.006 2.4 0 1.418 1.03 2.778 1.175 2.965.145.187 2.057 3.142 4.982 4.402.693.3 1.233.476 1.655.61.695.227 1.327.195 1.826.118.557-.084 1.717-.702 1.958-1.379.242-.678.242-1.256.169-1.379-.073-.123-.268-.195-.56-.344m-5.334-7.431h.006c1.052 0 2.062.411 2.811 1.151.748.74 1.162 1.728 1.162 2.776 0 2.181-1.784 3.967-3.973 3.967-1.052 0-2.062-.411-2.811-1.151-.748-.74-1.162-1.728-1.162-2.776 0-2.181 1.784-3.967 3.973-3.967M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0"/>
          </svg>
        </a>`;
        break;

      // ... mais 32 elementos
    }

    return html;
  }

  private generateInlineStyles(props: any): string {
    const styles: string[] = [];

    if (props.width) styles.push(`width: ${props.width}px`);
    if (props.height) styles.push(`height: ${props.height}px`);
    if (props.left) styles.push(`left: ${props.left}px`);
    if (props.top) styles.push(`top: ${props.top}px`);
    if (props.position) styles.push(`position: ${props.position}`);
    if (props.display) styles.push(`display: ${props.display}`);
    if (props.flexDirection) styles.push(`flex-direction: ${props.flexDirection}`);
    if (props.justifyContent) styles.push(`justify-content: ${props.justifyContent}`);
    if (props.alignItems) styles.push(`align-items: ${props.alignItems}`);
    if (props.gap) styles.push(`gap: ${props.gap}px`);
    if (props.marginTop) styles.push(`margin-top: ${props.marginTop}px`);
    if (props.marginRight) styles.push(`margin-right: ${props.marginRight}px`);
    if (props.marginBottom) styles.push(`margin-bottom: ${props.marginBottom}px`);
    if (props.marginLeft) styles.push(`margin-left: ${props.marginLeft}px`);
    if (props.paddingTop) styles.push(`padding-top: ${props.paddingTop}px`);
    if (props.paddingRight) styles.push(`padding-right: ${props.paddingRight}px`);
    if (props.paddingBottom) styles.push(`padding-bottom: ${props.paddingBottom}px`);
    if (props.paddingLeft) styles.push(`padding-left: ${props.paddingLeft}px`);
    if (props.fontSize) styles.push(`font-size: ${props.fontSize}px`);
    if (props.fontFamily) styles.push(`font-family: "${props.fontFamily}", sans-serif`);
    if (props.fontWeight) styles.push(`font-weight: ${props.fontWeight}`);
    if (props.color) styles.push(`color: ${props.color}`);
    if (props.backgroundColor) styles.push(`background-color: ${props.backgroundColor}`);
    if (props.borderRadius) styles.push(`border-radius: ${props.borderRadius}px`);
    if (props.opacity) styles.push(`opacity: ${props.opacity}`);

    return styles.join('; ');
  }

  private renderBindings(text: string, page: PageJSON): string {
    // Suporta {{variable}}
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return page.settings?.[key] || match;
    });
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  private generateCriticalCSS(): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.5; color: #333; }
      main { width: 100%; max-width: 1200px; margin: 0 auto; }
      img { max-width: 100%; height: auto; }
      @media (max-width: 768px) {
        .hidden-mobile { display: none !important; }
      }
      @media (max-width: 1024px) {
        .hidden-tablet { display: none !important; }
      }
      @media (min-width: 1025px) {
        .hidden-desktop { display: none !important; }
      }
    `;
  }

  private generateAnalyticsScripts(analytics: any): string {
    let scripts = '';

    if (analytics?.ga4Id) {
      scripts += `<script async src="https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}"></script>`;
      scripts += `<script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analytics.ga4Id}');
      </script>`;
    }

    if (analytics?.metaPixelId) {
      scripts += `<script>
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${analytics.metaPixelId}');
        fbq('track', 'PageView');
      </script>`;
    }

    return scripts;
  }

  private generateWhatsAppButton(whatsapp: any): string {
    const position = whatsapp.position === 'bottom-left' ? 'left: 20px' : 'right: 20px';

    return `
      <a href="https://wa.me/55${whatsapp.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(whatsapp.defaultMessage || '')}"
         target="_blank" rel="noopener noreferrer"
         style="position: fixed; bottom: 20px; ${position}; z-index: 999; width: 60px; height: 60px; border-radius: 50%; background-color: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); text-decoration: none;"
         title="Enviar mensagem pelo WhatsApp">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.15-1.739-.857-2.008-.96-.27-.102-.459-.15-.652.15-.193.297-.748.96-.917 1.155-.168.194-.337.21-.634.02-.297-.192-1.256-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.652-1.566-.893-2.145-.235-.572-.474-.495-.652-.503-.168-.007-.36-.007-.552-.007-.192 0-.505.072-.769.359-.264.287-1.006.982-1.006 2.4 0 1.418 1.03 2.778 1.175 2.965.145.187 2.057 3.142 4.982 4.402.693.3 1.233.476 1.655.61.695.227 1.327.195 1.826.118.557-.084 1.717-.702 1.958-1.379.242-.678.242-1.256.169-1.379-.073-.123-.268-.195-.56-.344m-5.334-7.431h.006c1.052 0 2.062.411 2.811 1.151.748.74 1.162 1.728 1.162 2.776 0 2.181-1.784 3.967-3.973 3.967-1.052 0-2.062-.411-2.811-1.151-.748-.74-1.162-1.728-1.162-2.776 0-2.181 1.784-3.967 3.973-3.967M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0"/>
        </svg>
      </a>
    `;
  }

  private generateLgpdBanner(lgpd: any): string {
    const position = lgpd.position === 'top' ? 'top: 0' : 'bottom: 0';
    return `
      <div id="lgpd-banner" style="position: fixed; ${position}; left: 0; right: 0; background-color: ${lgpd.backgroundColor || '#1f2937'}; color: white; padding: 16px; text-align: center; z-index: 998; font-size: 14px;">
        <p>${this.escapeHtml(lgpd.text || '')}</p>
        <div style="margin-top: 12px;">
          <button onclick="document.getElementById('lgpd-banner').remove(); localStorage.setItem('lgpd-consent', 'accepted');" style="background-color: white; color: #1f2937; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin: 0 4px;">Aceitar</button>
          <button onclick="document.getElementById('lgpd-banner').remove();" style="border: 1px solid white; color: white; background: transparent; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin: 0 4px;">Rejeitar</button>
        </div>
      </div>
    `;
  }

  private generateInlineJS(page: PageJSON, settings: PageSettings): string {
    return jsGenerator.generate(page, settings);
  }
}

export default new HTMLGenerator();
```

### jsGenerator.ts - JS Nativo (<3KB)

```typescript
class JSGenerator {
  generate(page: PageJSON, settings: PageSettings): string {
    let js = '';

    // Countdown
    js += `
      document.querySelectorAll('.countdown').forEach(el => {
        const targetDate = new Date(el.dataset.date).getTime();
        setInterval(() => {
          const now = new Date().getTime();
          const distance = targetDate - now;
          if (distance <= 0) {
            el.querySelector('.countdown-days').textContent = '0';
            el.querySelector('.countdown-hours').textContent = '0';
            el.querySelector('.countdown-minutes').textContent = '0';
            el.querySelector('.countdown-seconds').textContent = '0';
            return;
          }
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          el.querySelector('.countdown-days').textContent = days;
          el.querySelector('.countdown-hours').textContent = hours;
          el.querySelector('.countdown-minutes').textContent = minutes;
          el.querySelector('.countdown-seconds').textContent = seconds;
        }, 1000);
      });
    `;

    // Stats Counter (IntersectionObserver)
    js += `
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const increment = target / 30;
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.querySelector('.stats-value').textContent = target;
                clearInterval(interval);
              } else {
                counter.querySelector('.stats-value').textContent = Math.floor(current);
              }
            }, 50);
            counterObserver.unobserve(entry.target);
          }
        });
      });
      document.querySelectorAll('.stats-counter').forEach(el => counterObserver.observe(el));
    `;

    // Forms (fetch sem reload)
    js += `
      document.querySelectorAll('form[data-form-id]').forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);

          try {
            const response = await fetch('/api/forms/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pageId: '${page.id}',
                formId: form.dataset.formId,
                data
              })
            });

            if (response.ok) {
              alert('Formulário enviado com sucesso!');
              form.reset();
            } else {
              alert('Erro ao enviar formulário. Tente novamente.');
            }
          } catch (error) {
            alert('Erro na conexão. Tente novamente.');
          }
        });
      });
    `;

    // FAQ Acordeão (details/summary nativo)
    js += `
      document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('toggle', () => {
          if (item.open) {
            document.querySelectorAll('.faq-item[open]').forEach(other => {
              if (other !== item) other.open = false;
            });
          }
        });
      });
    `;

    // Lazy loading de imagens (IntersectionObserver fallback)
    js += `
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
      }
    `;

    // Exit intent popup
    if (page.settings?.exitIntentPopup) {
      js += `
        let exitIntentShown = false;
        document.addEventListener('mouseleave', () => {
          if (!exitIntentShown && new Date().getTime() - pageLoadTime > 5000) {
            // Mostrar popup
            exitIntentShown = true;
          }
        });
      `;
    }

    return js;
  }
}

export default new JSGenerator();
```

### schemaGenerator.ts - JSON-LD

```typescript
class SchemaGenerator {
  generate(page: PageJSON, settings: PageSettings): string {
    const schemas: any[] = [];

    // Organisação base
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.seo?.title || page.title,
      description: settings.seo?.metaDescription,
      url: `https://lexonline.com/${settings.seo?.slug}`,
    });

    // FAQ Schema
    const faqElements = page.elements.filter(el => el.type === 'faq');
    if (faqElements.length > 0) {
      const faqItems = faqElements[0].props.items || [];
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    // LocalBusiness se tiver mapa e endereço
    const mapElements = page.elements.filter(el => el.type === 'map');
    if (mapElements.length > 0 && settings.business) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: settings.business.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.business.address,
          addressLocality: settings.business.city,
          addressRegion: settings.business.state,
          postalCode: settings.business.zipCode,
          addressCountry: 'BR',
        },
        telephone: settings.business.phone,
      });
    }

    // Render JSON-LD
    return schemas
      .map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
      .join('\n');
  }
}

export default new SchemaGenerator();
```

### minifier.ts

```typescript
import { minify as htmlMinify } from 'html-minifier-terser';
import postcss from 'postcss';
import cssnano from 'cssnano';

class Minifier {
  async minifyHTML(html: string): Promise<string> {
    return htmlMinify(html, {
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
  }

  async minifyCSS(css: string): Promise<string> {
    const result = await postcss([cssnano()]).process(css, { from: undefined });
    return result.css;
  }
}

export default new Minifier();
```

### firebaseDeployer.ts

```typescript
import admin from 'firebase-admin';

class FirebaseDeployer {
  async deploy(pageId: string, htmlContent: string, cssContent: string): Promise<string> {
    const bucket = admin.storage().bucket();
    const hostname = admin.hosting();

    // Salvar arquivos
    const htmlFile = bucket.file(`pages/${pageId}/index.html`);
    const cssFile = bucket.file(`pages/${pageId}/styles.css`);

    await Promise.all([
      htmlFile.save(htmlContent, {
        metadata: {
          contentType: 'text/html; charset=utf-8',
          cacheControl: 'public, max-age=3600',
        },
      }),
      cssFile.save(cssContent, {
        metadata: {
          contentType: 'text/css; charset=utf-8',
          cacheControl: 'public, max-age=3600',
        },
      }),
    ]);

    // Publicar no Firebase Hosting
    const publishedUrl = `https://${pageId}.lexonline.com/`;

    return publishedUrl;
  }
}

export default new FirebaseDeployer();
```

### thumbnailService.ts - Screenshot com Puppeteer

```typescript
import puppeteer from 'puppeteer';

class ThumbnailService {
  async generateThumbnail(pageUrl: string, pageId: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ type: 'webp' });

    await browser.close();

    return screenshot;
  }
}

export default new ThumbnailService();
```

### publishController.ts - Orquestrador

```typescript
import express from 'express';
import htmlGenerator from '../services/htmlGenerator';
import cssGenerator from '../services/cssGenerator';
import jsGenerator from '../services/jsGenerator';
import schemaGenerator from '../services/schemaGenerator';
import minifier from '../services/minifier';
import firebaseDeployer from '../services/firebaseDeployer';
import thumbnailService from '../services/thumbnailService';
import db from '../database';

const router = express.Router();

interface PublishProgress {
  step: number;
  status: 'validating' | 'generating-html' | 'generating-css' | 'generating-js' | 'schemas' | 'minifying' | 'deploying' | 'thumbnail' | 'published';
  message: string;
}

// POST /api/page/:id/publish
router.post('/:pageId/publish', async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Validação
    const pageDoc = await db.collection('pages').doc(pageId).get();
    if (!pageDoc.exists) {
      return res.status(404).json({ error: 'Página não encontrada' });
    }

    const page = pageDoc.data() as PageJSON;
    const settings = page.settings || {};

    // 2. Gerar HTML
    const htmlContent = htmlGenerator.generate(page, settings);

    // 3. Gerar CSS
    const cssContent = cssGenerator.generate(page);

    // 4. Gerar JS
    const jsContent = jsGenerator.generate(page, settings);

    // 5. Gerar schemas JSON-LD
    const schemas = schemaGenerator.generate(page, settings);
    const htmlWithSchemas = htmlContent.replace('</head>', `${schemas}</head>`);

    // 6. Minificar
    const minifiedHtml = await minifier.minifyHTML(htmlWithSchemas);
    const minifiedCss = await minifier.minifyCSS(cssContent);

    // Validar tamanho
    if (Buffer.byteLength(minifiedHtml, 'utf8') > 50 * 1024) {
      return res.status(400).json({ error: 'Página muito grande (>50KB)' });
    }

    // 7. Deploy no Firebase
    const publishedUrl = await firebaseDeployer.deploy(pageId, minifiedHtml, minifiedCss);

    // 8. Gerar thumbnail (async, sem aguardar)
    thumbnailService.generateThumbnail(publishedUrl, pageId).catch(console.error);

    // 9. Atualizar banco
    await db.collection('pages').doc(pageId).update({
      status: 'published',
      published_url: publishedUrl,
      published_at: new Date().toISOString(),
      published_by: userId,
      page_size_kb: Math.round(Buffer.byteLength(minifiedHtml, 'utf8') / 1024),
    });

    return res.json({
      status: 'published',
      url: publishedUrl,
      sizeKB: Math.round(Buffer.byteLength(minifiedHtml, 'utf8') / 1024),
    });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Erro ao publicar' });
  }
});

export default router;
```

### Frontend: usePublish.ts

```typescript
export const usePublish = (pageId: string) => {
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState<PublishProgress[]>([]);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [error, setError] = useState('');

  const publish = async () => {
    setPublishing(true);
    setProgress([]);
    setError('');

    try {
      const steps = [
        { status: 'validating', message: 'Validando página' },
        { status: 'generating-html', message: 'Gerando HTML' },
        { status: 'generating-css', message: 'Gerando CSS' },
        { status: 'generating-js', message: 'Gerando JavaScript' },
        { status: 'schemas', message: 'Adicionando Schemas' },
        { status: 'minifying', message: 'Minificando' },
        { status: 'deploying', message: 'Enviando para CDN' },
        { status: 'thumbnail', message: 'Gerando thumbnail' },
        { status: 'published', message: 'Publicado!' },
      ];

      for (const step of steps) {
        setProgress(prev => [...prev, step as any]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const response = await fetch(`/api/page/${pageId}/publish`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Publish failed');

      const data = await response.json();
      setPublishedUrl(data.url);
    } catch (err) {
      setError(err.message || 'Erro ao publicar');
    } finally {
      setPublishing(false);
    }
  };

  return { publishing, progress, publishedUrl, error, publish };
};
```

### PublishProgress.tsx

```typescript
const PublishProgress = ({ isOpen, onClose, pageId }: Props) => {
  const { publishing, progress, publishedUrl, error, publish } = usePublish(pageId);

  useEffect(() => {
    if (isOpen && !publishing) {
      publish();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Publicando Página</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle size={16} />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {publishedUrl && (
          <Alert className="bg-green-50 border-green-200">
            <Check size={16} className="text-green-600" />
            <AlertTitle className="text-green-900">Publicado com sucesso!</AlertTitle>
            <AlertDescription className="text-green-800">
              <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {publishedUrl}
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {progress.map((step, idx) => {
            const isComplete = progress.length > idx + 1 || publishedUrl;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2"
              >
                {isComplete ? (
                  <Check size={20} className="text-green-600" />
                ) : publishing ? (
                  <Spinner size={20} className="text-blue-600" />
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
                <span className={isComplete ? 'text-gray-500' : 'font-medium'}>
                  {step.message}
                </span>
              </motion.div>
            );
          })}
        </div>

        {publishedUrl && (
          <div className="flex gap-2">
            <Button onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button
              onClick={() => window.open(publishedUrl, '_blank')}
              variant="outline"
              className="flex-1"
            >
              Abrir Página
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

## Otimizações de Performance

**<50KB Total:**
- HTML minificado: ~25KB
- CSS crítico inline: ~8KB
- JS nativo: ~2KB
- JSON-LD schemas: ~3KB
- Assets (fonts): carregados via CDN

**PageSpeed >90:**
- Zero React runtime
- CSS crítico no head
- Lazy loading de imagens (loading="lazy")
- No layout shift (contenidos dimensionados)
- IntersectionObserver para animações

## Critérios de Aceite

- [ ] HTML gerado é semântico H5
- [ ] CSS com classes únicas por elemento
- [ ] JS nativo sem dependências externas
- [ ] Tamanho total <50KB
- [ ] PageSpeed Insights >90
- [ ] FAQPage JSON-LD renderiza
- [ ] FormElement envia via fetch sem reload
- [ ] Countdown timer funciona
- [ ] Stats counter anima com IntersectionObserver
- [ ] WhatsApp flutuante renderiza
- [ ] LGPD banner aparece
- [ ] Publicação salva no Firestore
- [ ] Thumbnail gerado com Puppeteer
- [ ] URL publicada acessível
- [ ] Meta robots noindex quando desativado

## Stack Técnico

- Backend: Express + Firebase Admin + Puppeteer + sharp + html-minifier-terser
- Frontend: React + zustand + Framer Motion
- Deploy: Firebase Hosting
- Database: Firestore
