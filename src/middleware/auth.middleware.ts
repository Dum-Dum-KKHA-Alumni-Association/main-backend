import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const localAuthMiddleware = passport.authenticate('local', {
	failureRedirect: '/login',
	failureMessage: true,
	session: false,
});
export const jwtAuthMiddleware = passport.authenticate('jwt', {
	session: false,
});

export const googleOAuthMiddleware = passport.authenticate('google', {
	scope: ['email', 'profile', 'openid'],
});

//// api Authentication logic

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user) {
		console.log('isAuthenticated User', req.user);
		return next();
	}
	res.json({ message: 'user Id not found' });
};
export const isAdminAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user && req.user) {
		console.log('isAuthenticated User', req.user);
		return next();
	}
	res.json({ message: 'user Id not found' });
};
