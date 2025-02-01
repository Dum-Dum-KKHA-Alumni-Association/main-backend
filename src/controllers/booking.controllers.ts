// import asyncHandler from "@/utils/asyncHandler";
// import prisma from "db/prismaClient";
// import { Response } from "express";
// import { AuthenticatedRequest } from "types/apiRequest";

// export const createAnEvent = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		// const userId = request.auth?.userId;
// 		const {
// 			title,
// 			description,
// 			date,
// 			status,
// 			mode,
// 			location,
// 			thumbnail,
// 			gallery,
// 			merchandise,
// 			merchandiseType,
// 			foodAvailable,
// 			eventPaymentType,
// 			eventPaymentMode,
// 		} = request.body;

// 		try {
// 			const eventDetails = await prisma.events.create({
// 				data: {
// 					title,
// 					description,
// 					date,
// 					status,
// 					mode,
// 					location,
// 					thumbnail,
// 					gallery,
// 					merchandise,
// 					merchandiseType,
// 					foodAvailable,
// 					eventPaymentType,
// 					eventPaymentMode,
// 				},
// 			});

// 			console.log(eventDetails);

// 			response
// 				.status(200)
// 				.json(
// 					new ApiResponse(200, eventDetails, 'New event successfully created')
// 				);
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getEventsDetails = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		try {
// 			const eventsDetails = await prisma.events.findMany({});
// 			console.log(eventsDetails);

// 			response
// 				.status(200)
// 				.json(new ApiResponse(200, eventsDetails, 'Get All Events'));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const getAnEventsDetails = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		const id = request.params.id;

// 		try {
// 			const eventDetails = await prisma.events.findUnique({
// 				where: {
// 					id,
// 				},
// 			});
// 			console.log(eventDetails);

// 			response
// 				.status(200)
// 				.json(
// 					new ApiResponse(
// 						200,
// 						eventDetails,
// 						`Get ${eventDetails?.title} Events Details`
// 					)
// 				);
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const updateAnEvent = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		// const userId = request.auth?.userId;
// 		const id = request.params.id;

// 		const {
// 			title,
// 			description,
// 			date,
// 			status,
// 			mode,
// 			location,
// 			thumbnail,
// 			gallery,
// 			merchandise,
// 			merchandiseType,
// 			foodAvailable,
// 			eventPaymentType,
// 			eventPaymentMode,
// 		} = request.body;

// 		try {
// 			const eventDetails = await prisma.events.update({
// 				where: {
// 					id,
// 				},
// 				data: {
// 					title,
// 					description,
// 					date,
// 					status,
// 					mode,
// 					location,
// 					thumbnail,
// 					gallery,
// 					merchandise,
// 					merchandiseType,
// 					foodAvailable,
// 					eventPaymentType,
// 					eventPaymentMode,
// 				},
// 			});

// 			console.log(eventDetails);

// 			response
// 				.status(200)
// 				.json(new ApiResponse(200, eventDetails, 'Event successfully Updated'));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );

// export const deleteAnEvent = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
// 		// const userId = request.auth?.userId;
// 		const id = request.params.id;

// 		try {
// 			const eventDetails = await prisma.events.delete({
// 				where: {
// 					id,
// 				},
// 			});

// 			console.log(eventDetails);

// 			response
// 				.status(200)
// 				.json(new ApiResponse(200, eventDetails, 'event successfully Removed'));
// 		} catch (error) {
// 			response.status(400).json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );
