import { Router } from 'express';

import authMiddleware from '../middleware/clerk.middleware';
import {
	createDonationPage,
	deleteDonationPage,
	editDonationPage,
	getAllDonationPages,
	getAllDonations,
	getDonationPage,
	submitDonation,
} from '../controllers/donation.controllers';

const router = Router();

//Donation Page
router
	.route('/page')
	.post(authMiddleware, createDonationPage)
	.get(getAllDonationPages)
	.put(authMiddleware, editDonationPage);
router.route('/page/:slug').get(getDonationPage);
router.route('/page/:id').delete(authMiddleware, deleteDonationPage);

//Donatons
router.route('/').post(submitDonation).get(getAllDonations);
// router.route("/all_donations").post(getAllDonations);

export default router;
