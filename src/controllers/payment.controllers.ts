import { Response } from 'express';
import { AuthenticatedRequest } from '../types/apiRequest';
import asyncHandler from '../utils/asyncHandler';
// import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

// import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import prisma from '../db/prismaClient';
import { console } from 'inspector';
import { callCheckStatusApi } from '../utils/paymentGateway';

export const checkPaymentStatus = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		// const { merchantTransactionId, donationId } = request.params;
		// const { merchantTransactionId } = request.params;
		const { merchantTransactionId } = request.body;

		console.log(merchantTransactionId);

		//Check Payment Status
		try {
			const data = await callCheckStatusApi({ merchantTransactionId });

			// if (data && data.code === 'PAYMENT_SUCCESS') {
			// await prisma.$transaction(async (prisma) => {
			const paymentDetailsUpdate = await prisma.payment.update({
				where: {
					merchantTransactionId,
				},
				data: {
					success: data.success,
					code: data.code,
					message: data.message,
					transactionId: data.data.transactionId,
					state: data.data.state,
					responseCode: data.data.responseCode,
					paymentType: data.data.paymentInstrument.type,
					cardType: data.data.paymentInstrument.cardType,
					pgTransactionId: data.data.paymentInstrument.pgTransactionId,
					bankTransactionId: data.data.paymentInstrument.bankTransactionId,
					pgAuthorizationCode: data.data.paymentInstrument.pgAuthorizationCode,
					arn: data.data.paymentInstrument.arn,
					bankId: data.data.paymentInstrument.bankId,
					brn: data.data.paymentInstrument.brn,
					utr: data.data.paymentInstrument.utr,
					pgServiceTransactionId:
						data.data.paymentInstrument.pgServiceTransactionId,
					responseDescription: data.data.responseCodeDescription,
				},
			});
			console.log(paymentDetailsUpdate);
			if (data.success === true) {
				response.redirect(
					200,
					`${process.env.FRONTEND_ENDPOINT_URL}/donation/success`
				);
			} else {
				response.redirect(
					400,
					`${process.env.FRONTEND_ENDPOINT_URL}/donation/failed`
				);
			}

			// const donationDetails = await prisma.donation.update({
			// 	where: {
			// 		id: donationId,
			// 	},
			// 	data: {
			// 		Payment: {
			// 			connect: {
			// 				id: paymentDetailsUpdate.id,
			// 			},
			// 		},
			// 	},
			// });

			// console.log(paymentDetailsUpdate);

			// });
			// }

			// if (data && data.code === 'INTERNAL_SERVER_ERROR') {
			// 	///Delete The Donation and Payment Details
			// 	const [donationDetails, paymentDetailsUpdate] =
			// 		await prisma.$transaction([
			// 			prisma.donation.delete({
			// 				where: {
			// 					id: donationId,
			// 				},
			// 			}),
			// 			prisma.payment.delete({
			// 				where: {
			// 					merchantTransactionId,
			// 				},
			// 			}),
			// 		]);

			// 	console.log(paymentDetailsUpdate);
			// 	response
			// 		.status(200)
			// 		.json(
			// 			new ApiResponse(
			// 				200,
			// 				{ donationDetails, paymentDetailsUpdate },
			// 				'Payment Error'
			// 			)
			// 		);
			// }

			// const paymentDetailsUpdate = await prisma.payment.update({
			// 	where: {
			// 		merchantTransactionId,
			// 	},
			// 	data: {
			// 		transactionId: data.data.transactionId,
			// 		state: data.data.state,
			// 		responseCode: data.data.responseCode,
			// 		paymentType: data.data.paymentInstrument.type,
			// 		cardType: data.data.paymentInstrument.cardType,
			// 		pgTransactionId: data.data.paymentInstrument.pgTransactionId,
			// 		bankTransactionId: data.data.paymentInstrument.bankTransactionId,
			// 		pgAuthorizationCode: data.data.paymentInstrument.pgAuthorizationCode,
			// 		arn: data.data.paymentInstrument.arn,
			// 		bankId: data.data.paymentInstrument.bankId,
			// 		brn: data.data.paymentInstrument.brn,
			// 		utr: data.data.paymentInstrument.utr,
			// 		pgServiceTransactionId:
			// 			data.data.paymentInstrument.pgServiceTransactionId,
			// 		responseDescription: data.data.responseCodeDescription,
			// 	},
			// });
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);
export const checkPaymentGateWayStatus = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		// const { merchantTransactionId, donationId } = request.params;
		// const { merchantTransactionId } = request.params;
		const body = request.body;

		// console.log(merchantTransactionId);

		//Check Payment Status
		try {
			const data = await callCheckStatusApi({
				merchantTransactionId: body.transactionId,
			});

			if (data && data.code === 'PAYMENT_SUCCESS') {
				const paymentDetailsUpdate = await prisma.payment.update({
					where: {
						merchantTransactionId: body.transactionId,
					},
					data: {
						success: data.success,
						code: data.code,
						message: data.message,
						transactionId: data.data.transactionId,
						state: data.data.state,
						responseCode: data.data.responseCode,
						paymentType: data.data.paymentInstrument.type,
						cardType: data.data.paymentInstrument.cardType,
						pgTransactionId: data.data.paymentInstrument.pgTransactionId,
						bankTransactionId: data.data.paymentInstrument.bankTransactionId,
						pgAuthorizationCode:
							data.data.paymentInstrument.pgAuthorizationCode,
						arn: data.data.paymentInstrument.arn,
						bankId: data.data.paymentInstrument.bankId,
						brn: data.data.paymentInstrument.brn,
						utr: data.data.paymentInstrument.utr,
						pgServiceTransactionId:
							data.data.paymentInstrument.pgServiceTransactionId,
						responseDescription: data.data.responseCodeDescription,
						Donation: {
							update: {
								DonationPage: {
									update: {
										collectedAmount: data.data.amount,
									},
								},
							},
						},
					},
				});
				console.log(paymentDetailsUpdate);

				console.log(paymentDetailsUpdate);
				if (data.success === true) {
					response.redirect(
						`${process.env.FRONTEND_ENDPOINT_URL}/donation/success`
					);
				} else {
					response.redirect(
						`${process.env.FRONTEND_ENDPOINT_URL}/donation/failed`
					);
				}
			} else {
				const paymentDetailsUpdate = await prisma.payment.delete({
					where: {
						merchantTransactionId: body.transactionId,
					},
				});

				console.log(paymentDetailsUpdate);
				response.redirect(
					`${process.env.FRONTEND_ENDPOINT_URL}/donation/failed`
				);
			}
		} catch (error) {
			console.log(error);
			response.redirect(`${process.env.FRONTEND_ENDPOINT_URL}/donation/failed`);
		}
	}
);

export const paymentStatusWebhook = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		// const {  merchantTransactionId } = request.params;
		const base64Response = request.body.response;
		const xVerifyHeader = request.headers['x-verify'];

		console.log(base64Response, xVerifyHeader);
		if (!base64Response || !xVerifyHeader) {
			response.status(400).json({ message: 'Invalid request' });
		}

		// Calculate the expected X-VERIFY value
		const calculatedVerify =
			crypto
				.createHash('sha256')
				.update(base64Response + process.env.SALT_KEY)
				.digest('hex') +
			'###' +
			process.env.SALT_INDEX;

		// Compare calculated X-VERIFY with the header
		if (calculatedVerify !== xVerifyHeader) {
			response.status(401).json({ message: 'Unauthorized' });
		}

		// Decode the base64 response
		const decodedResponse = Buffer.from(base64Response, 'base64').toString(
			'utf-8'
		);
		const responseData = JSON.parse(decodedResponse);

		console.log('Callback Data:', responseData);

		//Check Payment Status

		try {
			////If Payment is Successfull
			// if (responseData.code === 'PAYMENT_SUCCESS') {
			// await prisma.$transaction(
			// 	async (prisma) => {
			const paymentDetailsUpdate = await prisma.payment.update({
				where: {
					merchantTransactionId: responseData.data.merchantTransactionId,
				},
				data: {
					transactionId: responseData.data.transactionId,
					state: responseData.data.state,
					responseCode: responseData.data.responseCode,
					paymentType: responseData.data.paymentInstrument.type,
					cardType: responseData.data.paymentInstrument.cardType,
					pgTransactionId: responseData.data.paymentInstrument.pgTransactionId,
					bankTransactionId:
						responseData.data.paymentInstrument.bankTransactionId,
					pgAuthorizationCode:
						responseData.data.paymentInstrument.pgAuthorizationCode,
					arn: responseData.data.paymentInstrument.arn,
					bankId: responseData.data.paymentInstrument.bankId,
					brn: responseData.data.paymentInstrument.brn,
					utr: responseData.data.paymentInstrument.utr,
					pgServiceTransactionId:
						responseData.data.paymentInstrument.pgServiceTransactionId,
					responseDescription: responseData.data.responseCodeDescription,
				},
			});
			console.log(paymentDetailsUpdate);

			// const donationDetails = await prisma.donation.update({
			// 	where: {
			// 		id: donationId,
			// 	},
			// 	data: {
			// 		Payment: {
			// 			connect: {
			// 				id: paymentDetailsUpdate.id,
			// 			},
			// 		},
			// 	},
			// });

			response.status(200).json({
				message: 'Callback processed successfully',
			});

			// 		{
			// 			maxWait: 5000, // 5 seconds max wait to connect to prisma
			// 			timeout: 10000, // 10 seconds
			// 		}
			// 	);
			// }

			////If Payment is PAYMENT_PENDING

			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			// if (
			// 	responseData.code === 'PAYMENT_PENDING' ||
			// 	responseData.code === 'INTERNAL_SERVER_ERROR'
			// ) {
			// 	console.log(
			// 		'Payment pending or internal server error. Checking status...'
			// 	);

			// 	// Call Check Status API

			// 	const statusResponse = await callCheckStatusApi({
			// 		merchantTransactionId,
			// 	});

			// 	if (statusResponse && statusResponse.data.state === 'COMPLETED') {
			// 		// Payment successful, update your database
			// 		const paymentDetailsUpdate = await prisma.payment.update({
			// 			where: {
			// 				merchantTransactionId,
			// 			},
			// 			data: {
			// 				success: statusResponse.success,
			// 				code: statusResponse.code,
			// 				message: statusResponse.message,
			// 				state: statusResponse.data.state,
			// 				responseCode: statusResponse.data.responseCode,
			// 				paymentType: statusResponse.data.paymentInstrument.type,
			// 				cardType: statusResponse.data.paymentInstrument.cardType,
			// 				pgTransactionId:
			// 					statusResponse.data.paymentInstrument.pgTransactionId,
			// 				bankTransactionId:
			// 					statusResponse.data.paymentInstrument.bankTransactionId,
			// 				pgAuthorizationCode:
			// 					statusResponse.data.paymentInstrument.pgAuthorizationCode,
			// 				arn: statusResponse.data.paymentInstrument.arn,
			// 				bankId: statusResponse.data.paymentInstrument.bankId,
			// 				brn: statusResponse.data.paymentInstrument.brn,
			// 				utr: statusResponse.data.paymentInstrument.utr,
			// 				pgServiceTransactionId:
			// 					statusResponse.data.paymentInstrument.pgServiceTransactionId,
			// 				responseDescription: statusResponse.data.responseCodeDescription,
			// 			},
			// 		});
			// 		console.log(paymentDetailsUpdate);

			// 		console.log('Payment successful:', statusResponse.data);
			// 	} else {
			// 		console.log('Payment not yet completed:', statusResponse);
			// 	}

			// 	console.log(statusResponse);
			// }

			// ////If Payment is Failed

			// if (responseData && responseData.code !== 'PAYMENT_ERROR') {
			// 	///Delete The Donation and Payment Details
			// 	const [donationDetails, paymentDetailsUpdate] =
			// 		await prisma.$transaction([
			// 			prisma.donation.delete({
			// 				where: {
			// 					id: donationId,
			// 				},
			// 			}),
			// 			prisma.payment.delete({
			// 				where: {
			// 					merchantTransactionId: responseData.data.merchantTransactionId,
			// 				},
			// 			}),
			// 		]);

			// 	// console.log(donationDetails, paymentDetailsUpdate);
			// 	response
			// 		.status(200)
			// 		.json(
			// 			new ApiResponse(
			// 				200,
			// 				{ donationDetails, paymentDetailsUpdate },
			// 				'Payment Error'
			// 			)
			// 		);
			// }

			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}

		// Acknowledge the callback
		// response
		// 	.status(200)
		// 	.json({ message: 'Callback processed successfully', responseData });
	}
);
