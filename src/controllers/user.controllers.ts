import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types/apiRequest';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { passwordHashed } from '../helper/hasher';
import { User } from '@prisma/client';
import {
	generateResetPasswordToken,
	verifyResetPasswordJwtToken,
} from '../helper/token';

import { forgotPasswordEmail } from '../helper/sendEmail';

export const registerUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const { fullName, email, password } = request.body;

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

export const userProfile = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;

		try {
			const user = await prisma.user.findUnique({
				where: {
					id: prismaUser.id,
				},
				select: {
					id: true,
					fullName: true,
					avatar: true,
					membershipId: true,
					madyamikYear: true,
					higherSecondaryYear: true,
					primaryNumber: true,
					whatsappNumber: true,
					role: true,
					permanentAddress: true,
					deliveryAddress: true,
					dateOfBirth: true,
					bloodGroup: true,
					occupation: true,
					linkedin: true,
					instagram: true,
					twitter: true,
					facebook: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			// const userAccount = {
			// 	id: user?.id,
			// 	fullName: user?.fullName,
			// 	avatar: user?.avatar,
			// 	madyamikYear: user?.madyamikYear,
			// 	higherSecondaryYear: user?.higherSecondaryYear,
			// 	primaryNumber: user?.primaryNumber,
			// 	whatsappNumber: user?.whatsappNumber,
			// 	role: user?.role,
			// 	permanentAddress: user?.permanentAddress,
			// 	deliveryAddress: user?.deliveryAddress,
			// 	dateOfBirth: user?.dateOfBirth,
			// 	bloodGroup: user?.bloodGroup,
			// 	occupation: user?.occupation,
			// 	linkedin: user?.linkedin,
			// 	instagram: user?.instagram,
			// 	twitter: user?.twitter,
			// 	facebook: user?.facebook,
			// 	createdAt: user?.createdAt,
			// 	updatedAt: user?.updatedAt,
			// };
			response
				.status(200)
				.json(new ApiResponse(200, user, 'Fetch User Details'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const updateUserProfile = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const {
			id,
			avatar,
			fullName,
			madyamikYear,
			higherSecondaryYear,
			primaryNumber,
			whatsappNumber,
			permanentAddress,
			deliveryAddress,
			dateOfBirth,
			bloodGroup,
			occupation,
			linkedin,
			instagram,
			twitter,
			facebook,
		} = request.body;

		try {
			const user = await prisma.user.update({
				where: {
					id: prismaUser.id,
				},
				data: {
					id,
					avatar,
					fullName,
					madyamikYear,
					higherSecondaryYear,
					primaryNumber,
					whatsappNumber,
					permanentAddress,
					deliveryAddress,
					dateOfBirth,
					bloodGroup,
					occupation,
					linkedin,
					instagram,
					twitter,
					facebook,
				},
			});
			response
				.status(200)
				.json(new ApiResponse(200, user, 'Profile is Updated'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

///Account Management
export const userAccount = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const userAccountDetails = await prisma.user.findUnique({
			where: {
				id: prismaUser.id,
			},
			select: {
				membershipId: true,
				email: true,
				password: true,
			},
		});

		response.json(
			new ApiResponse(200, userAccountDetails, 'User Account Details fetched')
		);
	}
);

export const updateUserAccount = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const { email, password } = request.body;

		try {
			const user = await prisma.user.update({
				where: {
					id: prismaUser.id,
				},
				data: {
					email,
					password,
				},
				select: {
					email: true,
					password: true,
					membershipId: true,
				},
			});
			response
				.status(200)
				.json(new ApiResponse(200, user, 'Account Details Updated'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);
export const deleteUserAccount = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;

		try {
			const user = await prisma.user.delete({
				where: {
					id: prismaUser.id,
				},
			});
			response
				.status(200)
				.json(new ApiResponse(200, user, 'USer Account Deleted'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

//Onboard Feature
export const onboardUser = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;
		const {
			madyamikYear,
			higherSecondaryYear,
			primaryNumber,
			whatsappNumber,
			permanentAddress,
			deliveryAddress,
			dateOfBirth,
			occupation,
		} = request.body;

		try {
			const user = await prisma.user.update({
				where: {
					id: prismaUser.id,
				},
				data: {
					madyamikYear,
					higherSecondaryYear,
					primaryNumber,
					whatsappNumber,
					permanentAddress,
					deliveryAddress,
					dateOfBirth,
					occupation,
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
export const userIsOnboarded = asyncHandler(
	async (request: Request, response: Response) => {
		const prismaUser = request.user as User;

		try {
			const isUserOnboarded = await prisma.user.findFirst({
				where: {
					id: prismaUser.id,
					madyamikYear: null,
					higherSecondaryYear: null,
					primaryNumber: null,
					whatsappNumber: null,
					permanentAddress: null,
					deliveryAddress: null,
					dateOfBirth: null,
					occupation: null,
				},
			});
			console.log('isUserOnboarded', isUserOnboarded);
			if (isUserOnboarded) {
				response
					.status(200)
					.json(new ApiResponse(200, false, 'User is not Onboarded'));
			} else {
				response
					.status(200)
					.json(new ApiResponse(200, true, 'User is Onboarded'));
			}
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

///////////////Admin Panel

export const userDetails = asyncHandler(
	async (request: Request, response: Response) => {
		console.log('query detils--->', request.query);

		const userId = request.query.id;

		if (userId && typeof userId === 'string') {
			try {
				const user = await prisma.user.findUnique({
					where: {
						id: userId,
					},
					select: {
						id: true,
						fullName: true,
						avatar: true,
						membershipId: true,
						madyamikYear: true,
						higherSecondaryYear: true,
						primaryNumber: true,
						whatsappNumber: true,
						role: true,
						permanentAddress: true,
						deliveryAddress: true,
						dateOfBirth: true,
						bloodGroup: true,
						occupation: true,
						linkedin: true,
						instagram: true,
						twitter: true,
						facebook: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				if (user) {
					response
						.status(200)
						.json(
							new ApiResponse(200, user, ' User Details fetched Successful')
						);
				} else {
					response
						.status(200)
						.json(new ApiResponse(200, user, 'No user Found'));
				}
			} catch (error) {
				response.status(400).json(new ApiError(400, 'Error Happened', error));
			}
		} else {
			try {
				const user = await prisma.user.findMany({
					select: {
						id: true,
						fullName: true,
						avatar: true,
						membershipId: true,
						madyamikYear: true,
						higherSecondaryYear: true,
						primaryNumber: true,
						whatsappNumber: true,
						role: true,
						permanentAddress: true,
						deliveryAddress: true,
						dateOfBirth: true,
						bloodGroup: true,
						occupation: true,
						linkedin: true,
						instagram: true,
						twitter: true,
						facebook: true,
						isEmailVerified: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				response
					.status(200)
					.json(new ApiResponse(200, user, 'Get All Users Details fetched'));
			} catch (error) {
				response.status(400).json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);
export const createNewUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const { fullName, email } = request.body;

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
				const user = await prisma.user.create({
					data: {
						fullName,
						email,
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
