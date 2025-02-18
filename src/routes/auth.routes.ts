import { Router } from 'express';
import { googleOAuthMiddleware } from '../middleware/auth.middleware';
import { googleLogin } from '../controllers/auth.controllers';

const router = Router();

router.route('/google').get(googleOAuthMiddleware);
router.route('/google/callback').get(googleOAuthMiddleware, googleLogin);

export default router;
