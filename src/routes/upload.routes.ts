import {
	deleteAObject,
	listAllObjects,
	uploadImageToS3,
	viewUrl,
} from '../controllers/upload.controllers';
import { Router } from 'express';

const router = Router();

router.route('/image').post(uploadImageToS3).get(viewUrl);
router.route('/').get(listAllObjects).delete(deleteAObject);

export default router;
