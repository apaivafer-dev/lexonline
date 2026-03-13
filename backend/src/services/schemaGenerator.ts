import type { PageSettings } from '@/types/page.types';

interface PageSchemaItem {
  id: string;
  type: string;
  columns?: Array<{
    elements?: Array<{ type: string; metadata?: Record<string, unknown>; props?: Record<string, unknown> }>;
  }>;
}

class SchemaGenerator {
  generate(schema: PageSchemaItem[], settings: PageSettings): string {
    const schemas: unknown[] = [];

    // Base organisation
    if (settings.seo?.title) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.seo.title,
        description: settings.seo.metaDescription,
        url: settings.seo.slug ? `https://lexonline.com/${settings.seo.slug}` : undefined,
      });
    }

    // Collect all elements from all sections
    const allElements = schema.flatMap((section) =>
      (section.columns ?? []).flatMap((col) => col.elements ?? []),
    );

    // FAQ Schema
    const faqEls = allElements.filter((el) => el.type === 'faq');
    if (faqEls.length > 0) {
      const meta = (faqEls[0].metadata ?? faqEls[0].props ?? {}) as Record<string, unknown>;
      const items = (meta.items as Array<{ question: string; answer: string }>) ?? [];
      if (items.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        });
      }
    }

    if (schemas.length === 0) return '';

    return schemas
      .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
      .join('\n');
  }
}

export default new SchemaGenerator();
