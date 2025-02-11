import { Router } from 'express';

import authMiddleware from '../middleware/clerk.middleware';
import {
	bookAnEvent,
	createAnEvent,
	deleteAnEvent,
	getAnEventsDetails,
	getEventsDetails,
	updateAnEvent,
} from '../controllers/events.controllers';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

///General Routes
router.route('/').post(isAuthenticated, createAnEvent).get(getEventsDetails);
router
	.route('/:id')
	.put(authMiddleware, updateAnEvent)
	.get(getAnEventsDetails)
	.delete(authMiddleware, deleteAnEvent);

router.route('/booking').post(bookAnEvent);

export default router;
