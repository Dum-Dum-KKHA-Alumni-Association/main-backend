import { Router } from 'express';

const router = Router();

///General Routes
// router.route('/page/:slug').get(getDonationPage);
// // router.route('/page/id/:id').get(getDonationPageById);

// /// Admin Panels Routes
// router
// 	.route('/page')
// 	.post(authMiddleware, createDonationPage)
// 	.get(getAllDonationPages)
// 	.put(authMiddleware, editDonationPage);
// router.route('/page/:id').delete(authMiddleware, deleteDonationPage);

// //Donatons
// router.route('/').post(submitDonation).get(getAllDonationPages);
// router.route('/:pageId').get(getAllDonationsByPageId);
// router.route('/donor/:donorId').get(getDonorDetails);

export default router;
