/**
 * Gera thumbnails SVG para os templates baseados na estrutura do schema.
 * Cada seção vira um bloco colorido no SVG, com representações dos elementos.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SVG_WIDTH = 400;
const SVG_HEIGHT = 560;

function getElementColor(type) {
  const map = {
    heading: '#1e293b',
    text: '#94a3b8',
    button: '#2563eb',
    image: '#cbd5e1',
    video: '#1e293b',
    icon: '#3b82f6',
    form: '#e2e8f0',
    testimonial: '#fbbf24',
    stats_counter: '#2563eb',
    faq: '#e2e8f0',
    pricing: '#e2e8f0',
    social_icons: '#64748b',
    countdown: '#f87171',
    input: '#e2e8f0',
    list: '#94a3b8',
    divider: '#e2e8f0',
    spacer: 'transparent',
  };
  return map[type] || '#cbd5e1';
}

function getElementHeight(type) {
  const map = {
    heading: 14,
    text: 8,
    button: 16,
    image: 40,
    video: 50,
    icon: 12,
    form: 50,
    testimonial: 30,
    stats_counter: 20,
    faq: 35,
    pricing: 40,
    social_icons: 10,
    countdown: 20,
    input: 12,
    list: 18,
    divider: 2,
    spacer: 10,
  };
  return map[type] || 10;
}

function generateSvg(schema) {
  // Calculate total content height to know how to scale
  let totalHeight = 0;
  const sectionData = [];

  for (const section of schema) {
    const ss = section.styles || {};
    const padding = parsePadding(ss.padding || '20px 16px');

    // Calculate section content height
    let maxColHeight = 0;
    const colData = [];

    for (const col of section.columns || []) {
      let colHeight = 0;
      const elements = [];

      for (const el of col.elements || []) {
        const h = getElementHeight(el.type);
        elements.push({ type: el.type, height: h, content: el.content });
        colHeight += h + 3; // 3px gap
      }

      colData.push({ width: col.width, elements, height: colHeight });
      if (colHeight > maxColHeight) maxColHeight = colHeight;
    }

    const sectionHeight = Math.max(maxColHeight + padding.top + padding.bottom, 30);
    sectionData.push({
      bg: ss.backgroundColor || '#ffffff',
      textAlign: ss.textAlign || 'left',
      height: sectionHeight,
      padding,
      columns: colData,
    });
    totalHeight += sectionHeight;
  }

  // Scale factor to fit in SVG_HEIGHT
  const scale = Math.min(1, (SVG_HEIGHT - 20) / totalHeight);
  const contentWidth = SVG_WIDTH - 20; // 10px margin each side

  let svgContent = '';
  let y = 10;

  for (const sec of sectionData) {
    const h = sec.height * scale;

    // Section background
    svgContent += `<rect x="10" y="${y}" width="${contentWidth}" height="${h}" fill="${sec.bg}" rx="2"/>`;

    // Draw columns
    const totalColWidth = sec.columns.reduce((sum, c) => sum + c.width, 0) || 12;
    let colX = 10 + (sec.padding.left * scale * 0.3);
    const colGap = 4;
    const availWidth = contentWidth - (sec.padding.left + sec.padding.right) * scale * 0.3;

    for (let ci = 0; ci < sec.columns.length; ci++) {
      const col = sec.columns[ci];
      const colW = (col.width / totalColWidth) * availWidth - (ci < sec.columns.length - 1 ? colGap : 0);
      let elY = y + sec.padding.top * scale * 0.3;

      for (const el of col.elements) {
        const elH = el.height * scale;
        const color = getElementColor(el.type);

        if (el.type === 'heading') {
          // Heading: wider bar
          const w = sec.textAlign === 'center' ? colW * 0.7 : colW * 0.8;
          const x = sec.textAlign === 'center' ? colX + (colW - w) / 2 : colX;
          svgContent += `<rect x="${x}" y="${elY}" width="${w}" height="${elH * 0.7}" fill="${color}" rx="2"/>`;
        } else if (el.type === 'text') {
          // Text: thinner lines
          const w = sec.textAlign === 'center' ? colW * 0.6 : colW * 0.9;
          const x = sec.textAlign === 'center' ? colX + (colW - w) / 2 : colX;
          svgContent += `<rect x="${x}" y="${elY}" width="${w}" height="${elH * 0.5}" fill="${color}" rx="1" opacity="0.6"/>`;
        } else if (el.type === 'button') {
          // Button: rounded rect
          const w = Math.min(colW * 0.5, 80);
          const x = sec.textAlign === 'center' ? colX + (colW - w) / 2 : colX;
          svgContent += `<rect x="${x}" y="${elY}" width="${w}" height="${elH * 0.7}" fill="${color}" rx="4"/>`;
        } else if (el.type === 'image') {
          // Image: rect with X
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="#f1f5f9" rx="3" stroke="#e2e8f0" stroke-width="1"/>`;
          svgContent += `<line x1="${colX + 4}" y1="${elY + 4}" x2="${colX + colW - 4}" y2="${elY + elH - 4}" stroke="#cbd5e1" stroke-width="0.5"/>`;
          svgContent += `<line x1="${colX + colW - 4}" y1="${elY + 4}" x2="${colX + 4}" y2="${elY + elH - 4}" stroke="#cbd5e1" stroke-width="0.5"/>`;
        } else if (el.type === 'video') {
          // Video: dark rect with play triangle
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="#0f172a" rx="3"/>`;
          const cx = colX + colW / 2;
          const cy = elY + elH / 2;
          const sz = Math.min(elH * 0.3, 8);
          svgContent += `<polygon points="${cx - sz},${cy - sz} ${cx + sz},${cy} ${cx - sz},${cy + sz}" fill="#ffffff" opacity="0.5"/>`;
        } else if (el.type === 'icon') {
          // Icon: small circle
          const cx = sec.textAlign === 'center' ? colX + colW / 2 : colX + 8;
          svgContent += `<circle cx="${cx}" cy="${elY + elH / 2}" r="${Math.min(elH * 0.4, 5)}" fill="${color}"/>`;
        } else if (el.type === 'form') {
          // Form: stacked input lines
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="#f8fafc" rx="3"/>`;
          for (let fi = 0; fi < 3; fi++) {
            const fy = elY + 5 + fi * (elH / 4);
            svgContent += `<rect x="${colX + 5}" y="${fy}" width="${colW - 10}" height="${elH * 0.15}" fill="#e2e8f0" rx="2"/>`;
          }
          svgContent += `<rect x="${colX + 5}" y="${elY + elH - elH * 0.22 - 3}" width="${colW - 10}" height="${elH * 0.18}" fill="#2563eb" rx="2"/>`;
        } else if (el.type === 'testimonial') {
          // Testimonial: card with star and text
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="#ffffff" rx="3" stroke="#e2e8f0" stroke-width="0.5"/>`;
          // Stars
          for (let si = 0; si < 5; si++) {
            svgContent += `<circle cx="${colX + 6 + si * 6}" cy="${elY + 5}" r="2" fill="#fbbf24"/>`;
          }
          // Text line
          svgContent += `<rect x="${colX + 4}" y="${elY + 12}" width="${colW * 0.7}" height="3" fill="#94a3b8" rx="1" opacity="0.5"/>`;
        } else if (el.type === 'stats_counter') {
          // Stats: big number
          const cx = colX + colW / 2;
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="transparent"/>`;
          svgContent += `<rect x="${cx - 12}" y="${elY + 2}" width="24" height="${elH * 0.5}" fill="${color}" rx="2"/>`;
          svgContent += `<rect x="${cx - 15}" y="${elY + elH * 0.6}" width="30" height="3" fill="#94a3b8" rx="1" opacity="0.4"/>`;
        } else if (el.type === 'countdown') {
          // Countdown: 4 boxes
          const bw = Math.min(colW / 5, 20);
          const startX = sec.textAlign === 'center' ? colX + (colW - bw * 4 - 12) / 2 : colX;
          for (let ci = 0; ci < 4; ci++) {
            svgContent += `<rect x="${startX + ci * (bw + 4)}" y="${elY}" width="${bw}" height="${elH * 0.7}" fill="rgba(255,255,255,0.2)" rx="2"/>`;
          }
        } else if (el.type === 'social_icons') {
          // Social: small circles
          const startX = sec.textAlign === 'center' ? colX + colW / 2 - 20 : colX;
          for (let si = 0; si < 4; si++) {
            svgContent += `<circle cx="${startX + si * 12 + 4}" cy="${elY + elH / 2}" r="4" fill="${color}"/>`;
          }
        } else if (el.type === 'faq') {
          // FAQ: stacked bars
          for (let fi = 0; fi < 3; fi++) {
            const fy = elY + fi * (elH / 3);
            svgContent += `<rect x="${colX}" y="${fy}" width="${colW}" height="${elH / 3 - 2}" fill="#f8fafc" rx="2" stroke="#e2e8f0" stroke-width="0.5"/>`;
            svgContent += `<rect x="${colX + 5}" y="${fy + 4}" width="${colW * 0.6}" height="3" fill="#64748b" rx="1" opacity="0.5"/>`;
          }
        } else if (el.type === 'pricing') {
          // Pricing: 3 cards
          const cardW = (colW - 8) / 3;
          for (let pi = 0; pi < 3; pi++) {
            const px = colX + pi * (cardW + 4);
            svgContent += `<rect x="${px}" y="${elY}" width="${cardW}" height="${elH}" fill="#ffffff" rx="3" stroke="${pi === 1 ? '#2563eb' : '#e2e8f0'}" stroke-width="${pi === 1 ? 1.5 : 0.5}"/>`;
            svgContent += `<rect x="${px + 4}" y="${elY + 5}" width="${cardW - 8}" height="4" fill="#1e293b" rx="1" opacity="0.4"/>`;
            svgContent += `<rect x="${px + 4}" y="${elY + 14}" width="${cardW * 0.5}" height="6" fill="#2563eb" rx="1" opacity="0.3"/>`;
          }
        } else if (el.type === 'list') {
          // List: bullet points
          const items = (el.content || '').split('\n').filter(Boolean);
          const count = Math.min(items.length || 3, 4);
          for (let li = 0; li < count; li++) {
            const ly = elY + li * (elH / count);
            svgContent += `<circle cx="${colX + 4}" cy="${ly + 4}" r="2" fill="#3b82f6"/>`;
            svgContent += `<rect x="${colX + 10}" y="${ly + 2}" width="${colW * 0.6}" height="3" fill="#94a3b8" rx="1" opacity="0.5"/>`;
          }
        } else {
          // Default: simple rect
          svgContent += `<rect x="${colX}" y="${elY}" width="${colW}" height="${elH}" fill="${color}" rx="2" opacity="0.3"/>`;
        }

        elY += (el.height * scale) + (3 * scale);
      }

      colX += colW + colGap;
    }

    y += h;
  }

  // Wrap in SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${Math.ceil(y + 10)}" viewBox="0 0 ${SVG_WIDTH} ${Math.ceil(y + 10)}">
    <rect width="${SVG_WIDTH}" height="${Math.ceil(y + 10)}" fill="#ffffff" rx="6"/>
    ${svgContent}
  </svg>`;

  return svg;
}

function parsePadding(padding) {
  const parts = padding.replace(/px/g, '').trim().split(/\s+/).map(Number);
  if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  if (parts.length === 4) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  return { top: 20, right: 16, bottom: 20, left: 16 };
}

async function main() {
  const templates = await prisma.page_templates.findMany();
  console.log(`Generating thumbnails for ${templates.length} templates...\n`);

  for (const tpl of templates) {
    const schema = Array.isArray(tpl.schema) ? tpl.schema : [];
    const svg = generateSvg(schema);

    // Convert to data URI
    const encoded = Buffer.from(svg).toString('base64');
    const dataUri = `data:image/svg+xml;base64,${encoded}`;

    await prisma.page_templates.update({
      where: { id: tpl.id },
      data: { thumbnail_url: dataUri },
    });

    console.log(`✓ ${tpl.title} (${schema.length} sections, SVG ${svg.length} bytes)`);
  }

  console.log('\nDone!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
