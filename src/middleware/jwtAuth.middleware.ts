/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../db/prismaClient';

export const verifyJWT = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token =
				req.cookies?.accessToken ||
				req.header('Authorization')?.replace('Bearer ', '');

			if (!token) {
				return next(new ApiError(401, 'Unauthorized request', token));
			}

			const decodedToken = jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			) as JwtPayload;

			if (!decodedToken || typeof decodedToken === 'string') {
				return next(new ApiError(401, 'Invalid Access Token'));
			}

			const user = await prisma.user.findUnique({
				where: {
					id: decodedToken.id,
				},
			});

			if (!user) {
				return next(new ApiError(401, 'Invalid Access Token'));
			}

			req.user = user;
			next(); // Call next to pass control to the next middleware
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			next(new ApiError(400, error?.message || 'Invalid Access Token')); // Pass error to next
		}
	}
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateAccessToken = async (user: any) => {
	try {
		// const user = await prisma.user.findUnique({
		// 	where: {
		// 		id: userId,
		// 	},
		// });
		if (!user) return 'User is Not found';
		const accessToken = jwt.sign(
			{
				_id: user?.id,
				fullName: user?.fullName,
				email: user?.email,
				admin: user?.role,
			},
			process.env.ACCESS_TOKEN_SECRET!,
			{
				expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
			}
		);

		return accessToken;
	} catch (error) {
		new ApiError(
			500,
			'Something went wrong while generating refresh and access token'
		);
	}
};
