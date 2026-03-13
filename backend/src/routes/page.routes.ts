import express from 'express';
import type { Router } from 'express';
import * as pageController from '@/controllers/pageController';
import * as domainsController from '@/controllers/domainsController';
import { authenticateToken } from '@/middleware/auth';

const router: Router = express.Router();

router.use(authenticateToken);

// TEMPLATES (antes de /:id para não ser interceptado)
router.get('/templates/list', pageController.getTemplates);
router.get('/templates/:id', pageController.getTemplateById);
router.post('/from-template/:templateId', pageController.createFromTemplate);

// DOMÍNIOS (legado — nível de usuário, antes de /:id)
router.get('/domains/list', pageController.getUserDomains);
router.post('/domains', pageController.addDomain);
router.delete('/domains/:id', pageController.removeDomain);

// PÁGINAS
router.get('/', pageController.getPages);
router.post('/', pageController.createPage);
router.get('/:id', pageController.getPageById);
router.put('/:id', pageController.updatePage);
router.delete('/:id', pageController.deletePage);

// PUBLICAÇÃO
router.post('/:id/publish', pageController.publishPage);
router.post('/:id/unpublish', pageController.unpublishPage);

// DUPLICAÇÃO
router.post('/:id/duplicate', pageController.duplicatePage);

// LEADS
router.get('/:id/leads', pageController.getPageLeads);

// ANALYTICS
router.get('/:id/analytics', pageController.getPageAnalytics);
router.get('/:id/views', pageController.getPageViews);

// DOMÍNIOS POR PÁGINA (Fase 7)
router.get('/:id/domains', domainsController.getPageDomains);
router.post('/:id/domain', domainsController.addPageDomain);
router.get('/:id/domain/:domainId/verify', domainsController.verifyPageDomain);
router.delete('/:id/domain/:domainId', domainsController.removePageDomain);

export default router;
