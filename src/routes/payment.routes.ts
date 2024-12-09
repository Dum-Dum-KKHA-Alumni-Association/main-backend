import { Router } from "express";
import { checkPaymentStatus, initiatePay } from "../controllers/payment.controllers";

const router = Router();

//Donation Page
router.route("/").post(initiatePay);
router.route("/status").post(checkPaymentStatus);

export default router;
