import { Router } from 'express';
// import { loginAdminUser, loginUser } from "../controllers/user.controllers";

import {
	loginAdminUser,
	loginUser,
	logoutUser,
	registerAdminUser,
	registerUser,
} from '../controllers/user.controllers';

const router = Router();

//General Access
router.route('/login').post(loginUser);
router.route('/signup').post(registerUser);
router.route('/logout').post(logoutUser);

//Admin Access
router.route('/adminLogin').post(loginAdminUser);
router.route('/adminSignup').post(registerAdminUser);
router.route('/logout').post(logoutUser);
// router.route('/:userId').get(userDetails);

export default router;
