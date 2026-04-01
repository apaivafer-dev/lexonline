const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.page_templates.findFirst({ select: { title: true, thumbnail_url: true } })
  .then(t => {
    console.log('Title:', t.title);
    console.log('Has thumbnail:', !!t.thumbnail_url);
    console.log('Starts with:', t.thumbnail_url ? t.thumbnail_url.substring(0, 60) : 'null');
    console.log('Length:', t.thumbnail_url ? t.thumbnail_url.length : 0);
  })
  .finally(() => prisma.$disconnect());
