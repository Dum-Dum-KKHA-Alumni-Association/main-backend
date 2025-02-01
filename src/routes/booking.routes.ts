import { Router } from 'express';

import authMiddleware from '../middleware/clerk.middleware';
import {
	createAnEvent,
	deleteAnEvent,
	getAnEventsDetails,
	getEventsDetails,
	updateAnEvent,
} from '../controllers/events.controllers';

const router = Router();

///General Routes
router.route('/').post(authMiddleware, createAnEvent).get(getEventsDetails);
router
	.route('/:id')
	.put(authMiddleware, updateAnEvent)
	.get(getAnEventsDetails)
	.delete(authMiddleware, deleteAnEvent);

export default router;
