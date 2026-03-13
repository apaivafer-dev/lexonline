import fs from 'fs';
import path from 'path';

const PUBLISHED_DIR = path.join(process.cwd(), 'published');

class FileDeployer {
  /**
   * Saves generated HTML to disk and returns the public URL.
   * Files are served at GET /pub/:pageId by Express static middleware.
   */
  async deploy(pageId: string, htmlContent: string): Promise<string> {
    const pageDir = path.join(PUBLISHED_DIR, pageId);
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), htmlContent, 'utf8');

    const baseUrl = process.env.BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';
    return `${baseUrl}/pub/${pageId}`;
  }

  sizeKB(content: string): number {
    return Math.round(Buffer.byteLength(content, 'utf8') / 1024);
  }
}

export default new FileDeployer();
