import { Response } from 'express';
import { AuthenticatedRequest } from '../types/apiRequest';
import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import prisma from '../db/prismaClient';
import { console } from 'inspector';

export const initiatePay = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { name, amount, mobile } = request.body;

		const payEndPoint = '/pg/v1/pay';
		const merchantTransactionId = uuidv4();
		const merchantUserId = 'MUID123343';

		const payload = {
			name,
			merchantId: process.env.PHONEPE_MERCHANT_ID,
			merchantTransactionId: merchantTransactionId,
			merchantUserId: merchantUserId,
			amount: amount * 100,
			redirectUrl: `https://localhost:8000/api/v1/status/${merchantTransactionId}`,
			redirectMode: 'POST',
			callbackUrl: `https://localhost:8000/api/v1/status/${merchantTransactionId}`,
			mobileNumber: mobile,
			paymentInstrument: {
				type: 'PAY_PAGE',
			},
		};

		// SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
		const payloadString = JSON.stringify(payload);
		const payloadMain = Buffer.from(payloadString).toString('base64');

		const hash = crypto
			.createHash('sha256')
			.update(payloadMain + payEndPoint + process.env.SALT_KEY)
			.digest('hex');

		const xVerify = hash + '###' + process.env.SALT_INDEX;

		try {
			const payResponse = await axios.post(
				`${process.env.PHONEPE_API_URL!}`,
				{
					request: payloadMain,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-VERIFY': xVerify,
					},
				}
			);
			console.log(payResponse.data);

			response
				.status(200)
				.json(new ApiResponse(200, payResponse.data, 'Initiate Pay'));
		} catch (error) {
			response.status(500).json(new ApiError(500, 'Error Happened', error));
		}
	}
);

export const checkPaymentStatus = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { merchantTransactionId, donationId } = request.params;

		console.log(merchantTransactionId);

		// SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
		const hash = crypto
			.createHash('sha256')
			.update(
				`/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
					process.env.SALT_KEY
			)
			.digest('hex');

		const xVerify = hash + '###' + process.env.SALT_INDEX;

		//Check Payment Status
		try {
			const { data } = await axios.get(
				`${process.env.PHONEPE_API_URL!}/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
				{
					headers: {
						'Content-Type': 'application/json',
						'X-VERIFY': xVerify,
						'X-MERCHANT-ID': process.env.PHONEPE_MERCHANT_ID,
					},
				}
			);

			if (data && data.success === 'true') {
				await prisma.$transaction(async (prisma) => {
					const paymentDetailsUpdate = await prisma.payment.update({
						where: {
							merchantTransactionId,
						},
						data: {
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
						},
					});
					console.log(paymentDetailsUpdate);

					const donationDetails = await prisma.donation.update({
						where: {
							id: donationId,
						},
						data: {
							Payment: {
								connect: {
									id: paymentDetailsUpdate.id,
								},
							},
						},
					});

					console.log(paymentDetailsUpdate);
					response
						.status(200)
						.json(
							new ApiResponse(
								200,
								{ donationDetails, paymentDetailsUpdate },
								'Payment Success'
							)
						);
				});
			} else {
				///Delete The Donation and Payment Details
				const [donationDetails, paymentDetailsUpdate] =
					await prisma.$transaction([
						prisma.donation.delete({
							where: {
								id: donationId,
							},
						}),
						prisma.payment.delete({
							where: {
								merchantTransactionId,
							},
						}),
					]);

				console.log(paymentDetailsUpdate);
				response
					.status(200)
					.json(
						new ApiResponse(
							200,
							{ donationDetails, paymentDetailsUpdate },
							'Payment Error'
						)
					);
			}

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
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const paymentStatusWebhook = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { donationId, merchantTransactionId } = request.params;
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
			if (responseData.code === 'PAYMENT_SUCCESS') {
				await prisma.$transaction(
					async (prisma) => {
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
								pgTransactionId:
									responseData.data.paymentInstrument.pgTransactionId,
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

						const donationDetails = await prisma.donation.update({
							where: {
								id: donationId,
							},
							data: {
								Payment: {
									connect: {
										id: paymentDetailsUpdate.id,
									},
								},
							},
						});

						console.log(donationDetails);

						response.status(200).json({
							message: 'Callback processed successfully',
						});
					},
					{
						maxWait: 5000, // 5 seconds max wait to connect to prisma
						timeout: 10000, // 10 seconds
					}
				);
			}

			////If Payment is PAYMENT_PENDING

			if (
				responseData.code === 'PAYMENT_PENDING' ||
				responseData.code === 'INTERNAL_SERVER_ERROR'
			) {
				const checkStatusResponse = await axios.post(
					`/status/${donationId}/${merchantTransactionId}`
				);

				console.log(checkStatusResponse);
			}

			////If Payment is Failed

			if (responseData && responseData.code !== 'PAYMENT_ERROR') {
				///Delete The Donation and Payment Details
				const [donationDetails, paymentDetailsUpdate] =
					await prisma.$transaction([
						prisma.donation.delete({
							where: {
								id: donationId,
							},
						}),
						prisma.payment.delete({
							where: {
								merchantTransactionId: responseData.data.merchantTransactionId,
							},
						}),
					]);

				// console.log(donationDetails, paymentDetailsUpdate);
				response
					.status(200)
					.json(
						new ApiResponse(
							200,
							{ donationDetails, paymentDetailsUpdate },
							'Payment Error'
						)
					);
			}
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}

		// Acknowledge the callback
		response
			.status(200)
			.json({ message: 'Callback processed successfully', responseData });
	}
);
