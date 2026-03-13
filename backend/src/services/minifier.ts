import { minify } from 'html-minifier-terser';

class Minifier {
  async minifyHTML(html: string): Promise<string> {
    return minify(html, {
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    });
  }
}

export default new Minifier();
