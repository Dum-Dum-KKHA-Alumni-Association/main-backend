import { Router } from "express";
// import { loginAdminUser, loginUser } from "../controllers/user.controllers";
import { requireAuth } from "@clerk/express";
import { getUserDetails } from "../controllers/user.controllers";

const router = Router();


router.route("/").get(getUserDetails);
// router.route("/login").post(requireAuth(),loginUser);
// router.route("/adminLogin").post(loginAdminUser);
// router.route("/adminSignup").post(registerAdminUser);
// router.route('/:userId').get(userDetails);


export default router;
