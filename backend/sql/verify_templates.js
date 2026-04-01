const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const templates = await prisma.page_templates.findMany({
    select: { title: true, slug: true, category: true, is_premium: true, schema: true }
  });
  templates.forEach(t => {
    const sections = Array.isArray(t.schema) ? t.schema.length : 0;
    const elements = Array.isArray(t.schema)
      ? t.schema.reduce((sum, s) => sum + (s.columns || []).reduce((cs, c) => cs + (c.elements || []).length, 0), 0)
      : 0;
    console.log(`${t.title} (${t.category}) - ${sections} seções, ${elements} elementos, premium: ${t.is_premium}`);
  });
}
main().finally(() => prisma.$disconnect());
