import sharp from 'sharp';

export interface OptimizedImages {
  original: Buffer;
  size1200: Buffer;
  size800: Buffer;
  size400: Buffer;
  width: number;
  height: number;
}

const WEBP_QUALITY = 85;

class ImageOptimizer {
  async convert(buffer: Buffer, mimeType: string): Promise<OptimizedImages> {
    // SVGs are not processed by sharp — return as-is
    if (mimeType === 'image/svg+xml') {
      return {
        original: buffer,
        size1200: buffer,
        size800: buffer,
        size400: buffer,
        width: 0,
        height: 0,
      };
    }

    const image = sharp(buffer);
    const metadata = await image.metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    const [original, size1200, size800, size400] = await Promise.all([
      // Original — convert to WebP without resize
      sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer(),

      // 1200px — desktop
      sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer(),

      // 800px — tablet
      sharp(buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer(),

      // 400px — mobile / thumbnail
      sharp(buffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer(),
    ]);

    return { original, size1200, size800, size400, width, height };
  }
}

export default new ImageOptimizer();
