import { Router } from 'express';
import {
	googleOAuthCallback,
	googleOAuthMiddleware,
	localAuthMiddleware,
} from '../middleware/auth.middleware';
import {
	googleCallback,
	loginUser,
	logoutUser,
	loginAdminUser,
	generateRefreshToken,
} from '../controllers/auth.controllers';
import {} from '../controllers/user.controllers';

const router = Router();

router.route('/google').get(googleOAuthMiddleware);
router.route('/google/callback').get(googleOAuthCallback, googleCallback);
router.route('/refresh-token').get(generateRefreshToken);
router.route('/user/login').post(localAuthMiddleware, loginUser);
router.route('/user/logout').post(logoutUser);
router.route('/admin/login').post(localAuthMiddleware, loginAdminUser);
router.route('/admin/logout').post(logoutUser);

export default router;
