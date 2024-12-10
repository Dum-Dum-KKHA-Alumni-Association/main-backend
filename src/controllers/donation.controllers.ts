import { Response } from 'express';
import { AuthenticatedRequest } from '../types/apiRequest';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../db/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { initiatePay } from '../utils/payment-gateway';

export const createDonationPage = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const {
			title,
			slug,
			description,
			thumbnail,
			targetAmount,
			expirationDate,
		} = request.body;
		// const userId = request.auth?.userId;

		try {
			const donationDetails = await prisma.donationPage.create({
				data: {
					title,
					slug,
					description,
					thumbnail,
					targetAmount,
					expirationDate,
				},
			});

			console.log(donationDetails);

			response
				.status(200)
				.json(
					new ApiResponse(
						200,
						donationDetails,
						'Donation Page Successfully created'
					)
				);
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getAllDonationPages = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		try {
			const getDonationPages = await prisma.donationPage.findMany();

			response
				.status(200)
				.json(new ApiResponse(200, getDonationPages, 'Get All Donation Pages'));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const editDonationPage = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const {
			id,
			title,
			slug,
			description,
			thumbnail,
			targetAmount,
			expirationDate,
			status,
		} = request.body;

		console.log(request.body);
		try {
			const updateDonationPage = await prisma.donationPage.update({
				where: {
					id,
				},
				data: {
					title,
					slug,
					description,
					thumbnail,
					targetAmount,
					expirationDate,
					status,
				},
			});

			response
				.status(200)
				.json(
					new ApiResponse(200, updateDonationPage, 'Get All Donation Pages')
				);
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getDonationPage = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const slug = request.params.slug;

		console.log(slug);
		try {
			const getDonationPage = await prisma.donationPage.findFirst({
				where: {
					slug,
				},
			});

			response.status(200).json(new ApiResponse(200, getDonationPage));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const deleteDonationPage = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const id = request.params.id;

		console.log(id);
		try {
			const deleteDonationPage = await prisma.donationPage.delete({
				where: {
					id,
				},
			});
			response
				.status(200)
				.json(
					new ApiResponse(
						200,
						deleteDonationPage,
						'Donation Page is Successfully Removed'
					)
				);
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

//Donation
export const submitDonation = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const {
			donationPageId,
			firstName,
			lastName,
			email,
			primaryNumber,
			whatsappNumber,
			gender,
			madyamikYear,
			higherSecondaryYear,
			dateOfBirth,
			occupation,
			presentAddress,
			contactAddress,
			amount,
		} = request.body;

		try {
			const paymentPageDetails = await initiatePay({
				amount,
				mobile: primaryNumber,
			});
			// await prisma.$transaction(
			// 	async (prisma) => {
			const donationDetails = await prisma.donation.create({
				data: {
					DonationPage: {
						connect: {
							id: donationPageId,
						},
					},
					firstName,
					lastName,
					email,
					primaryNumber,
					whatsappNumber,
					madyamikYear,
					gender,
					higherSecondaryYear,
					dateOfBirth,
					occupation,
					presentAddress,
					contactAddress,
					amount,
					Payment: {
						create: {
							merchantId: paymentPageDetails?.merchantId,
							merchantTransactionId: paymentPageDetails?.merchantTransactionId,
							amount,
						},
					},
				},
			});

			console.log(donationDetails);

			response
				.status(200)
				.json(new ApiResponse(200, paymentPageDetails, 'Payment is Initiated'));

			// const payment = await prisma.payment.create({
			// 	data: {
			// 		merchantId: paymentPageDetails?.merchantId,
			// 		merchantTransactionId: paymentPageDetails?.merchantTransactionId,
			// 		amount,
			// 	},
			// });

			// 	},
			// 	{
			// 		maxWait: 5000, // 5 seconds max wait to connect to prisma
			// 		timeout: 10000, // 10 seconds
			// 	}
			// );

			// const donationDetails = await prisma.donation.create({
			// 	data: {
			// 		DonationPage: {
			// 			connect: {
			// 				id: donationPageId,
			// 			},
			// 		},
			// 		firstName,
			// 		lastName,
			// 		email,
			// 		whatsappNumber,
			// 		alternativeNumber,
			// 		madyamikYear,
			// 		gender,
			// 		higherSecondaryYear,
			// 		dateOfBirth,
			// 		occupation,
			// 		presentAddress,
			// 		contactAddress,
			// 		amount,
			// 		Payment: {
			// 			create: {
			// 				merchantId: paymentPageDetails?.merchantId,
			// 				merchantTransactionId: paymentPageDetails?.merchantTransactionId,
			// 				amount,
			// 			},
			// 		},
			// 	},
			// });

			// const paymentData = await
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getAllDonations = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const id = request.params.id;

		console.log(id);
		try {
			const deleteDonationPage = await prisma.donationPage.delete({
				where: {
					id,
				},
			});
			response.status(200).json(new ApiResponse(200, deleteDonationPage));
		} catch (error) {
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);
