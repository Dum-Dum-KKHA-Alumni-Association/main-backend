import { Router } from 'express';

import {
	createAnEvent,
	deleteAnEvent,
	getAnEventsDetails,
	getEventsDetails,
	updateAnEvent,
} from '../controllers/events.controllers';

const router = Router();

///General Routes
router.route('/').post(createAnEvent).get(getEventsDetails);
router
	.route('/:id')
	.put(updateAnEvent)
	.get(getAnEventsDetails)
	.delete(deleteAnEvent);

export default router;
