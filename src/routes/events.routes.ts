import { Router } from 'express';
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
	.put(updateAnEvent)
	.get(getAnEventsDetails)
	.delete(deleteAnEvent);

router.route('/booking').post(bookAnEvent);

export default router;
