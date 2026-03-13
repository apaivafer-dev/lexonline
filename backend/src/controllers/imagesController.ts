import fs from 'fs';
import path from 'path';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import imageOptimizer from '@/services/imageOptimizer';

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// POST /api/images/:pageId
export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const { pageId } = req.params;
    const file = req.file;
    if (!file) { res.status(400).json({ error: 'Nenhuma imagem fornecida' }); return; }

    // Verify page ownership
    const page = await prisma.pages.findFirst({ where: { id: pageId, user_id: userId } });
    if (!page) { res.status(404).json({ error: 'Página não encontrada' }); return; }

    const timestamp = Date.now();
    const isSvg = file.mimetype === 'image/svg+xml';
    const ext = isSvg ? 'svg' : 'webp';

    const dirPath = path.join(UPLOADS_DIR, 'page', userId, pageId);
    ensureDir(dirPath);

    const { original, size1200, size800, size400, width, height } =
      await imageOptimizer.convert(file.buffer, file.mimetype);

    const baseName = `${timestamp}`;
    const sizes = [
      { suffix: 'original', buffer: original },
      { suffix: '1200', buffer: size1200 },
      { suffix: '800', buffer: size800 },
      { suffix: '400', buffer: size400 },
    ];

    for (const { suffix, buffer } of sizes) {
      fs.writeFileSync(path.join(dirPath, `${baseName}-${suffix}.${ext}`), buffer);
    }

    const baseUrl = `/uploads/page/${userId}/${pageId}/${baseName}`;

    const asset = await prisma.page_assets.create({
      data: {
        page_id: pageId,
        user_id: userId,
        filename: file.originalname,
        file_type: `image/${ext}`,
        file_size: original.length,
        firebase_url: `${baseUrl}-original.${ext}`,
        firebase_path: path.join('page', userId, pageId, `${baseName}-original.${ext}`),
        width,
        height,
      },
    });

    res.status(201).json({
      id: asset.id,
      url: `${baseUrl}-original.${ext}`,
      url1200: `${baseUrl}-1200.${ext}`,
      url800: `${baseUrl}-800.${ext}`,
      urlThumb: `${baseUrl}-400.${ext}`,
      width,
      height,
      sizeKB: Math.round(original.length / 1024),
      filename: file.originalname,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
}

// GET /api/images/:pageId
export async function listImages(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const { pageId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const scope = (req.query.scope as string) ?? 'current';

    const where = scope === 'all'
      ? { user_id: userId }
      : { page_id: pageId, user_id: userId };

    const [assets, total] = await Promise.all([
      prisma.page_assets.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.page_assets.count({ where }),
    ]);

    // Reconstruct size URLs from original URL
    const images = assets.map((a) => {
      const base = a.firebase_url.replace(/-original\.(webp|svg)$/, '');
      const ext = a.firebase_url.endsWith('.svg') ? 'svg' : 'webp';
      return {
        id: a.id,
        filename: a.filename,
        url: a.firebase_url,
        url1200: `${base}-1200.${ext}`,
        url800: `${base}-800.${ext}`,
        urlThumb: `${base}-400.${ext}`,
        width: a.width,
        height: a.height,
        sizeKB: a.file_size ? Math.round(a.file_size / 1024) : 0,
        createdAt: a.created_at,
      };
    });

    res.json({ images, total, page, limit });
  } catch (err) {
    console.error('List images error:', err);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
}

// DELETE /api/images/:pageId/:assetId
export async function deleteImage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const { pageId, assetId } = req.params;

    const asset = await prisma.page_assets.findFirst({
      where: { id: assetId, page_id: pageId, user_id: userId },
    });
    if (!asset) { res.status(404).json({ error: 'Asset não encontrado' }); return; }

    // Delete all size variants from disk
    const dirPath = path.join(UPLOADS_DIR, path.dirname(asset.firebase_path));
    const baseName = path.basename(asset.firebase_path).replace(/-original\.(webp|svg)$/, '');
    const ext = asset.firebase_path.endsWith('.svg') ? 'svg' : 'webp';

    for (const suffix of ['original', '1200', '800', '400']) {
      const filePath = path.join(dirPath, `${baseName}-${suffix}.${ext}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.page_assets.delete({ where: { id: assetId } });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
}
