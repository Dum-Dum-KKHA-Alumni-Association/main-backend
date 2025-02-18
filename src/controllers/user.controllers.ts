import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/apiRequest';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { passwordHashed } from '../utils/hasher';
import { User } from '@prisma/client';
import {
	generateAccessToken,
	generateResetPasswordToken,
	verifyJwtToken,
	verifyResetPasswordJwtToken,
} from '../utils/token';

import { forgotPasswordEmail } from '../utils/sendEmail';

export const registerUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const { fullName, madyamikYear, higherSecondaryYear, email, password } =
			request.body;

		try {
			const existedUser = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (existedUser) {
				response
					.status(200)
					.json(new ApiResponse(409, {}, 'User already exists'));
			} else {
				const hashedPassword = await passwordHashed(password);
				const user = await prisma.user.create({
					data: {
						fullName,
						email,
						madyamikYear,
						higherSecondaryYear,
						password: hashedPassword,
					},
				});

				response.json(
					new ApiResponse(200, user, 'User Registered Successfully')
				);
			}
		} catch (error) {
			response.status(400).json(new ApiError(40, 'Error Happens', error));
		}
	}
);

export const loginUser = asyncHandler(
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
		} else {
			response.sendStatus(401);
		}
	}
);

export const loginAdminUser = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		if (prismaUser && prismaUser.role === 'ADMIN') {
			response.json(
				new ApiResponse(
					200,
					{
						user: request.user,
						session: request.session,
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

export const refreshToken = asyncHandler(
	async (request: Request, response: Response) => {
		const { token } = request.body;
		if (!token) response.status(401).json({ error: 'Unauthorized' });

		try {
			const decoded = verifyJwtToken(token) as User;

			const user = await prisma.user.findUnique({ where: { id: decoded.id } });

			if (!user || user.refreshToken !== token)
				response.status(403).json({ error: 'Forbidden' });

			const newAccessToken = generateAccessToken(user!.id);
			response.json({ accessToken: newAccessToken });
		} catch {
			response.status(403).json({ error: 'Invalid token' });
		}
	}
);

export const userProfile = asyncHandler(
	async (request: Request, response: Response) => {
		response.json(
			new ApiResponse(
				200,
				{
					user: request.user,
					session: request.session,
				},
				'User logged In Successfully'
			)
		);
	}
);

export const updateUserProfile = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const {
			id,
			fullName,
			email,
			password,
			googleId,
			madyamikYear,
			higherSecondaryYear,
			primaryNumber,
			whatsappNumber,
			role,
			permanentAddress,
			deliveryAddress,
			dateOfBirth,
			bloodGroup,
			occupation,
			membershipId,
			linkedin,
			instagram,
			twitter,
			facebook,
			refreshToken,
		} = request.body;

		try {
			const user = await prisma.user.update({
				where: {
					id: prismaUser.id,
				},
				data: {
					id,
					fullName,
					email,
					password,
					googleId,
					madyamikYear,
					higherSecondaryYear,
					primaryNumber,
					whatsappNumber,
					role,
					permanentAddress,
					deliveryAddress,
					dateOfBirth,
					bloodGroup,
					occupation,
					membershipId,
					linkedin,
					instagram,
					twitter,
					facebook,
					refreshToken,
				},
			});
			response
				.status(200)
				.json(new ApiResponse(200, user, 'New event successfully created'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

//Forget Password

export const forgetPassword = asyncHandler(
	async (request: Request, response: Response) => {
		const { email } = request.body;

		if (!email) {
			response.status(400).json({ error: 'Please Enter field' });
		}

		try {
			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				response.status(400).json({ error: 'Email is not registered' });
			} else {
				const token = generateResetPasswordToken(user!.id);

				const emailInfo = await forgotPasswordEmail({
					receiverEmail: email,
					userFirstName: user.fullName,
					token,
				});

				response
					.status(200)
					.json(new ApiResponse(200, emailInfo, 'New Password Updated'));
			}
		} catch (error) {
			response.status(400).json(new ApiError(400, 'error Happens', error));
		}
	}
);

//Reset Password Link

export const resetLink = asyncHandler(
	async (request: Request, response: Response) => {
		const { token, password } = request.body;

		if (!password && !token) {
			response.status(400).json({ error: 'Please Enter field' });
		}

		if (typeof password === 'string') {
			const { id } = (await verifyResetPasswordJwtToken(token)) as {
				id: string;
			};

			try {
				const user = await prisma.user.update({
					where: {
						id: id as string,
					},
					data: {
						password: await passwordHashed(password),
					},
				});

				response
					.status(200)
					.json(new ApiResponse(200, user, 'New Password Updated'));
			} catch (error) {
				console.log(error);
				response
					.status(400)
					.json(new ApiError(400, 'Password not Updated', error));
			}
		} else {
			response
				.status(400)
				.json(new ApiError(400, 'Please give only string value'));
		}
	}
);
