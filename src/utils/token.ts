import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET!;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY!;

const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET!;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY!;

const resetPasswordTokenSecretKey = process.env.FORGET_PASSWORD_JWT_SECRET!;

export const generateAccessToken = (id: string) => {
	return jwt.sign({ id }, secretKey, { expiresIn: accessTokenExpiry });
};
export const generateRefreshToken = (id: string) => {
	return jwt.sign({ id }, refreshTokenSecretKey, {
		expiresIn: refreshTokenExpiry,
	});
};

export const generateResetPasswordToken = (id: string) => {
	return jwt.sign({ id }, resetPasswordTokenSecretKey, { expiresIn: '15m' });
};
export const verifyResetPasswordJwtToken = (token: string) => {
	try {
		const data = jwt.verify(token, resetPasswordTokenSecretKey);
		return data;
	} catch (error) {
		return error;
	}
};

export const verifyJwtToken = (token: string) => {
	if (refreshTokenSecretKey !== undefined) {
		try {
			const data = jwt.verify(token, refreshTokenSecretKey);
			return data;
		} catch (error) {
			return error;
		}
	}
};
