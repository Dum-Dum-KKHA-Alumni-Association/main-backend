import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/apiRequest';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { comparePassword, passwordHashed } from '../utils/hasher';
import { generateAccessToken } from '../middleware/jwtAuth.middleware';

export const getUserDetails = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		response.json({ message: 'User Protected route' });
	}
);

export const registerUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;
		const { fullName, email, password } = request.body;

		try {
			const hashedPassword = await passwordHashed(password);
			const user = await prisma.user.create({
				data: {
					fullName,
					email,
					password: hashedPassword,
				},
			});
			response.json(new ApiResponse(200, user, 'User created Successful'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const loginUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		const { email, password } = request.body;

		try {
			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user)
				response.status(401).json(new ApiError(401, 'Incorrect Email'));

			const isPasswordMatch = await comparePassword(password, user!.password);
			// const isPasswordMatch = user?.password === password ? true : false;

			if (isPasswordMatch) {
				const accessToken = await generateAccessToken(user);

				const options = {
					httpOnly: true,
					secure: true,
				};

				response
					.status(200)
					.cookie('accessToken', accessToken, options)
					// .cookie('refreshToken', refreshToken, options)
					.json(
						new ApiResponse(
							200,
							{
								user,
								accessToken,

								FRONTEND_URL: process.env.FRONTEND_URL,
							},
							'User logged In Successfully'
						)
					);
			} else {
				response.status(400).json(new ApiError(400, 'Incorrect Password'));
			}
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);
export const logoutUser = asyncHandler(
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

export const loginAdminUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const userId = request.auth?.userId;

		response.json({ message: 'User Protected route' });
	}
);
