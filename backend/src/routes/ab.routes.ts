import express from 'express';
import type { Router } from 'express';
import * as abController from '@/controllers/abController';
import { authenticateToken } from '@/middleware/auth';

const router: Router = express.Router();

router.use(authenticateToken);

// Testes
router.post('/tests', abController.createTest);
router.get('/tests/:testId', abController.getTest);
router.get('/pages/:pageId/tests', abController.getTestsByPage);
router.put('/tests/:testId', abController.updateTest);
router.delete('/tests/:testId', abController.deleteTest);
router.post('/tests/:testId/declare-winner', abController.declareWinner);

// Resultados
router.get('/tests/:testId/results', abController.getResults);

// Eventos (impressões e conversões) — sem auth para chamadas do script injetado
router.post('/:testId/impression', abController.recordImpression);
router.post('/:testId/conversion', abController.recordConversion);

export default router;
