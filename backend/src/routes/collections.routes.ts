import express from 'express';
import type { Router } from 'express';
import * as collectionsController from '@/controllers/collectionsController';
import { authenticateToken } from '@/middleware/auth';

const router: Router = express.Router();

router.use(authenticateToken);

// Collections
router.get('/', collectionsController.getCollections);
router.post('/', collectionsController.createCollection);
router.get('/:id', collectionsController.getCollectionById);
router.put('/:id', collectionsController.updateCollection);
router.delete('/:id', collectionsController.deleteCollection);

// Items
router.get('/:id/items', collectionsController.getItems);
router.post('/:id/items', collectionsController.createItem);
router.put('/:id/items/:itemId', collectionsController.updateItem);
router.delete('/:id/items/:itemId', collectionsController.deleteItem);
router.post('/:id/reorder', collectionsController.reorderItems);

// Bindings
router.post('/:id/bindings', collectionsController.createBinding);

// Publicação em massa
router.post('/:id/publish-all', collectionsController.publishAll);

export default router;
