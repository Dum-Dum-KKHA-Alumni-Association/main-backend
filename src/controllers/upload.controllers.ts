import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import {
	deleteObject,
	getObjectUrl,
	listObjects,
	uploadToS3,
} from '../helper/generate-upload-url';
import { Response } from 'express';
import { AuthenticatedRequest } from 'types/apiRequest';

export const uploadImageToS3 = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { contentType } = request.body;

		console.log(contentType);
		try {
			const uploadUrl = await uploadToS3();
			response.status(200).json(new ApiResponse(200, { uploadUrl }));
		} catch (error) {
			console.log(error);
			response
				.status(500)
				.json(new ApiError(500, 'Upload Url not generated', error));
		}
	}
);
export const viewUrl = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { key } = request.body;
		try {
			const uploadUrl = await getObjectUrl({ key });
			response.status(200).json(new ApiResponse(200, { uploadUrl }));
		} catch (error) {
			console.log(error);
			response
				.status(500)
				.json(new ApiError(500, 'Upload Url not generated', error));
		}
	}
);
export const listAllObjects = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		try {
			const listAllfiles = await listObjects();
			response.status(200).json(new ApiResponse(200, { listAllfiles }));
		} catch (error) {
			console.log(error);
			response
				.status(500)
				.json(new ApiError(500, 'Upload Url not generated', error));
		}
	}
);

export const deleteAObject = asyncHandler(
	async (request: AuthenticatedRequest, response: Response): Promise<void> => {
		const { key } = request.body;
		try {
			const deleteFile = await deleteObject({ key });
			response.status(200).json(new ApiResponse(200, deleteFile));
		} catch (error) {
			console.log(error);
			response
				.status(500)
				.json(new ApiError(500, 'Upload Url not generated', error));
		}
	}
);
