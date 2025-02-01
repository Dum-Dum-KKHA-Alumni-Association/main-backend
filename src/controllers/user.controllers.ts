import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

import { AuthenticatedRequest } from '../types/apiRequest';

// export const getUserDetails = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response) => {
// 		// const userId = request.auth?.userId;

// 		response.json({ message: 'User Protected route' });
// 	}
// );

export const loginUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
export const registerAdminUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
export const logoutUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);

export const loginAdminUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
export const registerUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
