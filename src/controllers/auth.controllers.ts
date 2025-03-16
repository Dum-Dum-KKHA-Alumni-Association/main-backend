import { generateAccessToken, verifyRefreshJwtToken } from '../helper/token';
import asyncHandler from '../utils/asyncHandler';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const googleCallback = asyncHandler(
	async (request: Request, response: Response) => {
		try {
			const prismaUser = request.user as User;
			console.log();

			const accessToken = generateAccessToken({
				id: prismaUser.id,
				email: prismaUser.email,
				role: prismaUser.role,
			});

			response.cookie('access_token', accessToken, {
				// httpOnly: true,
				secure: true,
				maxAge: 15 * 60 * 1000, // 15 minutes
				sameSite: 'none',
			});

			// Set HTTP-only cookies

			response.cookie('refresh_token', prismaUser.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});

			response.redirect(`${process.env.FRONTEND_ENDPOINT_URL}/dashboard`);
		} catch (error) {
			console.log(error);
			response.status(500).json({ error });
		}
		// console.log(prismaUser);
		// const accessToken = generateAccessToken(prismaUser.id);

		// Generate JWT Tokens
	}
);

export const generateRefreshToken = asyncHandler(
	async (request: Request, response: Response) => {
		const refreshToken = request.cookies.refresh_token;

		if (!refreshToken) {
			response.status(403).json({ error: 'Refresh token Missing' });
		} else {
			try {
				const decoded = verifyRefreshJwtToken(refreshToken) as User;

				//Find user in DB
				const user = await prisma.user.findUnique({
					where: { id: decoded.id },
				});

				if (!user || user.refreshToken !== refreshToken) {
					response.status(403).json({ error: 'Invalid refresh token' });
				} else {
					// Generate new tokens
					const newAccessToken = generateAccessToken({
						id: user.id,
						email: user.email,
						role: user.role,
					});
					response.cookie('access_token', newAccessToken, {
						// httpOnly: true,
						secure: true,
						maxAge: 15 * 60 * 1000, // 15 minutes
						sameSite: 'none',
					});
					response.status(200).json({ accessToken: newAccessToken });
				}
			} catch {
				response.status(403).json({ error: 'Invalid token' });
			}
		}
	}
);

export const loginUser = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const accessToken = generateAccessToken({
			id: prismaUser.id,
			email: prismaUser.email,
			role: prismaUser.role,
		});

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
		} else {
			response.sendStatus(401);
		}
	}
);

export const logoutUser = asyncHandler(
	async (request: Request, response: Response) => {
		request.logout(async (err) => {
			if (err) {
				response.status(500).json({ message: 'Logout failed' });
			}

			const token = request.cookies.refresh_token;

			console.log('Logout, Refresh Token--->', token);
			try {
				await prisma.user.updateMany({
					where: { refreshToken: token },
					data: { refreshToken: null },
				});

				response.clearCookie('access_token', {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production', // Secure in production
					sameSite: 'strict',
					path: '/',
				});
				response.clearCookie('refresh_token', {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production', // Secure in production
					sameSite: 'strict',
					path: '/',
				});
				response.status(200).json({ message: 'Logged out successfully' });
			} catch {
				response.status(500).json({ error: 'Server error' });
			}
		});
	}
);

/// Admin controllers
export const loginAdminUser = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;

		if (prismaUser && prismaUser.role === 'ADMIN') {
			const accessToken = generateAccessToken({
				id: prismaUser.id,
				email: prismaUser.email,
				role: prismaUser.role,
			});
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

			response.status(200).json(
				new ApiResponse(
					200,
					{
						user: prismaUser,
						session: request.session,
						token: accessToken,
					},
					'Admin User logged In Successfully'
				)
			);
		} else {
			response
				.status(401)
				.json(new ApiError(401, 'This credentials are not for Admin User'));
		}
	}
);
