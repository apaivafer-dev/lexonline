import express from 'express';
import type { Router } from 'express';
import * as analyticsController from '@/controllers/analyticsController';
import { authenticateToken } from '@/middleware/auth';

const router: Router = express.Router();

// ─── PUBLIC (chamados pelo script da página publicada) ────────────────────────
router.post('/pageview', analyticsController.recordPageview);
router.post('/duration', analyticsController.recordDuration);
router.post('/lead', analyticsController.recordLead);

// ─── PROTECTED ────────────────────────────────────────────────────────────────
router.use(authenticateToken);

router.get('/dashboard/:pageId', analyticsController.getDashboard);
router.get('/chart/visits/:pageId', analyticsController.getVisitsChart);
router.get('/chart/device/:pageId', analyticsController.getDeviceChart);
router.get('/chart/sources/:pageId', analyticsController.getSourcesChart);
router.get('/leads/:pageId', analyticsController.getLeads);
router.put('/leads/:leadId', analyticsController.updateLeadStatus);
router.get('/leads/export', analyticsController.exportLeads);
router.post('/leads/send-crm', analyticsController.sendLeadsToCrm);

export default router;
