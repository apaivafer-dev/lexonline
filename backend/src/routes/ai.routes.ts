import express from 'express';
import type { Router } from 'express';
import * as aiController from '@/controllers/aiController';
import { authenticateToken } from '@/middleware/auth';

const router: Router = express.Router();

router.use(authenticateToken);

router.post('/generate-text', aiController.generateText);
router.post('/seo', aiController.generateSeo);
router.post('/analyze', aiController.analyzePage);
router.post('/faq', aiController.generateFaq);
router.get('/usage', aiController.getUsage);

export default router;
