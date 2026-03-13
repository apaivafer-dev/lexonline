import express from 'express';
import type { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { upload, handleUploadError } from '@/middleware/uploadMiddleware';
import * as imagesController from '@/controllers/imagesController';

const router: Router = express.Router();

router.use(authenticateToken);

router.post('/:pageId', upload.single('image'), handleUploadError, imagesController.uploadImage);
router.get('/:pageId', imagesController.listImages);
router.delete('/:pageId/:assetId', imagesController.deleteImage);

export default router;
