import { Router } from 'express';
import {
	checkPaymentGateWayStatus,
	// checkPaymentStatus,
	// checkPaymentStatusForm,
	paymentStatusWebhook,
} from '../controllers/payment.controllers';

const router = Router();

// router
// 	.route('/status/:merchantTransactionId')
// 	// .get(checkPaymentStatus)
// 	.post(checkPaymentStatus);
router.route('/status').post(checkPaymentGateWayStatus);
// router
// 	.route('/status')
// 	.post(checkPaymentStatusForm);
router.route('/phonepe-callback').post(paymentStatusWebhook);

export default router;
