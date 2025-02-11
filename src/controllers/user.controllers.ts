import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/apiRequest';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { passwordHashed } from '../utils/hasher';
import { User } from '@prisma/client';
import { resetJwtToken, verifyJwtToken } from '../utils/token';
import nodemailer from 'nodemailer';

export const registerUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
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
			response.json(new ApiResponse(200, user, 'User created Successfully'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const loginUser = async (request: Request, response: Response) => {
	console.log(request.user, request.session);

	if (request.user) {
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
};

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
		request.logout((err) => {
			if (err) {
				response.status(500).json({ message: 'Logout failed' });
			}

			// Destroy the session
			request.session.destroy((err) => {
				if (err) {
					return response
						.status(500)
						.json({ message: 'Error destroying session' });
				}

				// Clear the cookie
				response.clearCookie('connect.sid'); // Or whatever your cookie name is

				// Send response
				response.status(200).json({ message: 'Logged out successfully' });
			});
		});
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
			provider,
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
					provider,
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

		if (typeof email === 'string') {
			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user) {
				response.status(400).json({ error: 'Email is not registered' });
			}

			const token = resetJwtToken(user!.id);

			try {
				//Connect SMPT
				const transporter = await nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						// TODO: replace `user` and `pass` values from <https://forwardemail.net>
						user: 'tejodeepmitra@gmail.com',
						pass: 'mnscfgbaxtsxcced',
					},
				});

				const info = await transporter.sendMail({
					to: email,
					subject: 'Password Reset',
					text: 'Your new password',
					html: `<h1>Your reset LInk</h1> <br><a href='http://localhost:3000/reset-password/${token}'><span>Reset LInk</span></a>`,
				});

				response.status(200).json(info);
			} catch (error) {
				response.status(200).json(error);
			}
		} else {
			response.status(200).json({ error: 'Please give any string value' });
		}
	}
);

//Reset Password Link

export const resetLink = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId, password } = request.body;

		if (!password) {
			response.status(400).json({ error: 'Please Enter field' });
		}

		if (typeof password === 'string') {
			const { id } = (await verifyJwtToken(userId)) as { id: string };

			try {
				const user = await prisma.user.update({
					where: {
						id: id as string,
					},
					data: {
						password: await passwordHashed(password),
					},
				});

				response.status(200).json(user);
			} catch (error) {
				console.log(error);
				response.status(400).json({ error: 'Password not Updated' });
			}
		} else {
			response.status(400).json({ error: 'Please give only string value' });
		}
	}
);
