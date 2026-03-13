import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pageRoutes from '@/routes/page.routes';
import imagesRoutes from '@/routes/images.routes';
import aiRoutes from '@/routes/ai.routes';
import collectionsRoutes from '@/routes/collections.routes';
import abRoutes from '@/routes/ab.routes';
import analyticsRoutes from '@/routes/analytics.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve published pages statically at /pub/:pageId
app.use('/pub', express.static(path.join(process.cwd(), 'published'), {
  index: 'index.html',
  setHeaders(res) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  },
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '9.0.0' });
});

app.use('/api/page', pageRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/ab', abRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`LexOnline Builder API running on port ${PORT}`);
});

export default app;
