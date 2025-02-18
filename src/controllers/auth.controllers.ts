import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { generateAccessToken } from '../utils/token';
import { User } from '@prisma/client';
import { Request, Response } from 'express';

export const googleLogin = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const accessToken = generateAccessToken(prismaUser.id);

		if (request.user) {
			// Set HTTP-only cookies
			response.cookie('access_token', accessToken, {
				// httpOnly: true,
				secure: true,
				maxAge: 15 * 60 * 1000, // 15 minutes
				sameSite: 'none',
			});

			response.cookie('refresh_token', prismaUser.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});

			response.json(
				new ApiResponse(
					200,
					{
						user: prismaUser,
						session: request.session,
						token: accessToken,
					},
					'User logged In Successfully'
				)
			);
			response.redirect(`${process.env.FRONTEND_ENDPOINT_URL}/dashboard`);
		} else {
			response.sendStatus(401);
		}
	}
);
