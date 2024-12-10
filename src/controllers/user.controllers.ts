import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/apiRequest';

export const getUserDetails = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
