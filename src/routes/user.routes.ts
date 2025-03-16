import { Router } from 'express';
import {
	forgetPassword,
	onboardUser,
	registerUser,
	resetLink,
	updateUserProfile,
	userIsOnboarded,
	userProfile,
	userAccount,
	updateUserAccount,
	userDetails,
	createNewUser,
	deleteUserAccount,
} from '../controllers/user.controllers';

import { jwtAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.route('/register').post(registerUser);
router.route('/onboard').post(jwtAuthMiddleware, onboardUser);
router.route('/isOnboarded').get(jwtAuthMiddleware, userIsOnboarded);
router
	.route('/profile')
	.get(jwtAuthMiddleware, userProfile)
	.put(jwtAuthMiddleware, updateUserProfile);
router
	.route('/account')
	.get(jwtAuthMiddleware, userAccount)
	.put(jwtAuthMiddleware, updateUserAccount)
	.delete(deleteUserAccount);

///For Admin Users
router.route('/').get(userDetails);
router.route('/createNewUser').post(createNewUser);

router.route('/forget-password').post(forgetPassword);
router.route('/reset-link').put(resetLink);

export default router;
