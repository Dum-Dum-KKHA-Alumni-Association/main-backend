import { Router } from "express";
// import { loginAdminUser, loginUser } from "../controllers/user.controllers";
import { requireAuth } from "@clerk/express";
import { getUserDetails } from "../controllers/user.controllers";
import authMiddleware from "../middleware/clerk.middleware";

const router = Router();


router.route("/").post(authMiddleware,getUserDetails);
// router.route("/login").post(requireAuth(),loginUser);
// router.route("/adminLogin").post(loginAdminUser);
// router.route("/adminSignup").post(registerAdminUser);
// router.route('/:userId').get(userDetails);


export default router;
