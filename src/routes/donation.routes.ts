import { Router } from 'express';

import authMiddleware from '../middleware/clerk.middleware';
import {
	createDonationPage,
	deleteDonationPage,
	editDonationPage,
	getAllDonationPages,
	getCountDonationsByPageId,
	getDonationPage,
	getDonationPageById,
	getDonationsByPageId,
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
router.route('/page/id/:id').get(getDonationPageById);
router.route('/page/:id').delete(authMiddleware, deleteDonationPage);

//Donatons
router.route('/').post(submitDonation).get(getAllDonationPages);
router.route('/users/:pageId').get(getDonationsByPageId);
router.route('/users/count/:pageId').get(getCountDonationsByPageId);

export default router;
