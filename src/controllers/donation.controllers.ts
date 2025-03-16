// import { Response } from 'express';
// import { AuthenticatedRequest } from '../types/apiRequest';
// import asyncHandler from '../utils/asyncHandler';
// import prisma from '../db/prismaClient';
// import ApiResponse from '../utils/ApiResponse';
// import ApiError from '../utils/ApiError';
// import { initiatePay } from '../utils/paymentGateway';

// export const createDonationPage = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const {
// 			title,

// 			description,
// 			thumbnail,
// 			targetAmount,
// 			expirationDate,
// 		} = request.body;
// 		// const userId = request.auth?.userId;

// 		try {
// 			const donationDetails = await prisma.donationPage.create({
// 				data: {
// 					title,
// 					description,
// 					thumbnail,
// 					targetAmount,
// 					expirationDate,
// 				},
// 			});

// 			console.log(donationDetails);

// 			response
// 				.status(200)
// 				.json(
// 					new ApiResponse(
// 						200,
// 						donationDetails,
// 						'New Donation Page successfully created'
// 					)
// 				);
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getAllDonationPages = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		try {
// 			const getDonationPages = await prisma.donationPage.findMany({
// 				select: {
// 					id: true,
// 					title: true,
// 					description: true,
// 					thumbnail: true,
// 					targetAmount: true,
// 					collectedAmount: true,
// 					expirationDate: true,
// 					status: true,
// 					listOfDonors: {
// 						where: {
// 							Payment: {
// 								state: 'COMPLETED',
// 							},
// 						},
// 						select: {
// 							Payment: {
// 								select: {
// 									state: true,
// 									amount: true,
// 								},
// 							},
// 						},
// 					},
// 				},
// 			});

// 			response
// 				.status(200)
// 				.json(new ApiResponse(200, getDonationPages, 'Get All Donation Pages'));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const editDonationPage = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const {
// 			id,
// 			title,
// 			description,
// 			thumbnail,
// 			targetAmount,
// 			expirationDate,
// 			status,
// 		} = request.body;

// 		console.log(request.body);
// 		try {
// 			const updateDonationPage = await prisma.donationPage.update({
// 				where: {
// 					id,
// 				},
// 				data: {
// 					title,

// 					description,
// 					thumbnail,
// 					targetAmount,
// 					expirationDate,
// 					status,
// 				},
// 			});

// 			response
// 				.status(200)
// 				.json(
// 					new ApiResponse(200, updateDonationPage, 'Get All Donation Pages')
// 				);
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getDonationPage = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const id = request.params.id;

// 		console.log(id);
// 		try {
// 			const getDonationPage = await prisma.donationPage.findUnique({
// 				where: {
// 					id,
// 				},
// 				select: {
// 					id: true,
// 					title: true,

// 					description: true,
// 					thumbnail: true,
// 					listOfDonors: {
// 						where: {
// 							Payment: {
// 								state: 'COMPLETED',
// 							},
// 						},
// 						select: {
// 							id: true,
// 						},
// 					},
// 					targetAmount: true,
// 					collectedAmount: true,
// 					expirationDate: true,
// 					status: true,
// 					createdAt: true,
// 					updatedAt: true,
// 				},
// 			});

// 			response.status(200).json(new ApiResponse(200, getDonationPage));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const deleteDonationPage = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const id = request.params.id;

// 		console.log(id);
// 		try {
// 			const deleteDonationPage = await prisma.donationPage.delete({
// 				where: {
// 					id,
// 				},
// 			});
// 			response
// 				.status(200)
// 				.json(
// 					new ApiResponse(
// 						200,
// 						deleteDonationPage,
// 						'Donation Page is Successfully Removed'
// 					)
// 				);
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// //Donation
// export const submitDonation = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const {
// 			donationPageId,
// 			firstName,
// 			lastName,
// 			email,
// 			primaryNumber,
// 			whatsappNumber,
// 			madyamikYear,
// 			higherSecondaryYear,
// 			dateOfBirth,
// 			occupation,
// 			presentAddress,
// 			contactAddress,
// 			amount,
// 		} = request.body;

// 		try {
// 			const paymentPageDetails = await initiatePay({
// 				amount,
// 				mobile: primaryNumber,
// 			});

// 			const donationDetails = await prisma.donation.create({
// 				data: {
// 					DonationPage: {
// 						connect: {
// 							id: donationPageId,
// 						},
// 					},
// 					firstName,
// 					lastName,
// 					email,
// 					primaryNumber,
// 					whatsappNumber,
// 					madyamikYear,
// 					higherSecondaryYear,
// 					dateOfBirth,
// 					occupation,
// 					presentAddress,
// 					contactAddress,
// 					amount,
// 					Payment: {
// 						create: {
// 							merchantId: paymentPageDetails?.merchantId,
// 							merchantTransactionId: paymentPageDetails?.merchantTransactionId,
// 							amount,
// 						},
// 					},
// 				},
// 			});

// 			console.log(donationDetails);

// 			response
// 				.status(200)
// 				.json(new ApiResponse(200, paymentPageDetails, 'Payment is Initiated'));
// 		} catch (error) {
// 			console.log(error);
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getAllDonationsByPageId = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const pageId = request.params.pageId;

// 		console.log(pageId);
// 		try {
// 			const getAllDonations = await prisma.donation.findMany({
// 				where: {
// 					donationPageId: pageId,
// 					Payment: {
// 						state: 'COMPLETED',
// 					},
// 				},
// 			});

// 			response.status(200).json(new ApiResponse(200, getAllDonations));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );
// export const getCountDonationsByPageId = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const pageId = request.params.pageId;

// 		console.log(pageId);
// 		try {
// 			const getDonationsCount = await prisma.donation.count({
// 				where: {
// 					donationPageId: pageId,
// 				},
// 			});
// 			response.status(200).json(new ApiResponse(200, getDonationsCount));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getDonorDetails = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const donorId = request.params.donorId;

// 		console.log(donorId);
// 		try {
// 			const getDonorDetails = await prisma.donation.findUnique({
// 				where: {
// 					id: donorId,
// 				},
// 				select: {
// 					id: true,
// 					firstName: true,
// 					lastName: true,
// 					email: true,
// 					primaryNumber: true,
// 					whatsappNumber: true,
// 					dateOfBirth: true,
// 					madyamikYear: true,
// 					higherSecondaryYear: true,
// 					presentAddress: true,
// 					contactAddress: true,
// 					occupation: true,
// 					amount: true,
// 					donationPageId: true,
// 					Payment: true,
// 					createdAt: true,
// 					updatedAt: true,
// 				},
// 			});
// 			response.status(200).json(new ApiResponse(200, getDonorDetails));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );
