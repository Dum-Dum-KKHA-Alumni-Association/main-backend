import { Router } from 'express';
import {
	forgetPassword,
	loginAdminUser,
	loginUser,
	logoutUser,
	refreshToken,
	registerUser,
	resetLink,
	updateUserProfile,
	userProfile,
} from '../controllers/user.controllers';

import {
	isAuthenticated,
	jwtAuthMiddleware,
	localAuthMiddleware,
} from '../middleware/auth.middleware';

const router = Router();

router.route('/login').post(localAuthMiddleware, loginUser);
router.route('/adminLogin').post(localAuthMiddleware, loginAdminUser);
router.route('/refresh-token').post(refreshToken);

router.route('/register').post(registerUser);
router.route('/logout').post(logoutUser);
router
	.route('/profile')
	.get(jwtAuthMiddleware, userProfile)
	.put(isAuthenticated, updateUserProfile);

router.route('/forget-password').post(forgetPassword);
router.route('/reset-link').put(resetLink);

export default router;
