import { Router } from 'express';
import {
	initiatePay,
	paymentStatusWebhook,
} from '../controllers/payment.controllers';

const router = Router();

//Donation Page
router.route('/').post(initiatePay);
// router
// 	.route('/status/:donationId/:merchantTransactionId')
// 	.get(checkPaymentStatus)
// 	.post(checkPaymentStatus);
router
	.route('/phonepe-callback/:donationId/:merchantTransactionId')
	.post(paymentStatusWebhook);

export default router;
