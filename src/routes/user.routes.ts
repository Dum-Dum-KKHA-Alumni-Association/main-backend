import { Router } from 'express';
// import { loginAdminUser, loginUser } from "../controllers/user.controllers";

import {
	getUserDetails,
	loginAdminUser,
	loginUser,
	logoutUser,
	registerAdminUser,
	registerUser,
} from '../controllers/user.controllers';

import { localAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

//General Access
router.route('/login').post(localAuthMiddleware, loginUser);
router.route('/signup').post(registerUser);
router.route('/logout').post(logoutUser);

//Admin Access
router.route('/adminLogin').post(loginAdminUser);
router.route('/adminSignup').post(registerAdminUser);
router.route('/logout').post(logoutUser);
router.route('/:userId').get(getUserDetails);

export default router;
