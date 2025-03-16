import jwt from 'jsonwebtoken';

const resetPasswordTokenSecretKey = process.env.FORGET_PASSWORD_JWT_SECRET!;

export const generateAccessToken = ({
	id,
	email,
	role,
}: {
	id: string;
	email: string;
	role: string;
}) => {
	const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET!;
	const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY!;
	if (!accessTokenSecretKey) {
		throw new Error(
			'ACCESS_TOKEN_SECRET is missing from environment variables'
		);
	}
	console.log('ACcess Toekn------->', accessTokenSecretKey);
	return jwt.sign({ id, email, role }, accessTokenSecretKey, {
		expiresIn: accessTokenExpiry,
	});
};
export const generateRefreshToken = (id: string) => {
	const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET!;
	const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY!;

	console.log('REFRESH_TOKEN_SECRET---->', refreshTokenSecretKey);

	// if (!refreshTokenSecretKey) {
	// 	throw new Error(
	// 		'REFRESH_TOKEN_SECRET is missing from environment variables'
	// 	);
	// }
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

export const verifyRefreshJwtToken = (refreshToken: string) => {
	const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET!;

	if (refreshTokenSecretKey !== undefined) {
		try {
			const data = jwt.verify(refreshToken, refreshTokenSecretKey);
			return data;
		} catch (error) {
			return error;
		}
	}
};
