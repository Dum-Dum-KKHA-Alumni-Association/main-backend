import { Router } from 'express';
import {
	forgetPassword,
	loginAdminUser,
	loginUser,
	logoutUser,
	registerUser,
	resetLink,
	updateUserProfile,
	userProfile,
} from '../controllers/user.controllers';

import {
	isAuthenticated,
	localAuthMiddleware,
} from '../middleware/auth.middleware';

const router = Router();

router.route('/login').post(localAuthMiddleware, loginUser);
router.route('/adminLogin').post(localAuthMiddleware, loginAdminUser);

router.route('/register').post(registerUser);
router.route('/logout').post(logoutUser);
router
	.route('/profile')
	.get(isAuthenticated, userProfile)
	.put(isAuthenticated, updateUserProfile);

router.route('/forgetPassword').post(forgetPassword);
router.route('/resetLink').put(resetLink);

export default router;
