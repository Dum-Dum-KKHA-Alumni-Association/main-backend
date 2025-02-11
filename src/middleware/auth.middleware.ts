import { comparePassword } from '../utils/hasher';
import prisma from '../db/prismaClient';
import passport from 'passport';
import passportLocal from 'passport-local';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
const localStrategy = passportLocal.Strategy;

export const passportLocalStrategy = () => {
	passport.use(
		new localStrategy(
			{ usernameField: 'email', passwordField: 'password' },
			async (email, password, done) => {
				console.log('Receive Credentials', email, password);
				//authentication Logic here
				try {
					const user = await prisma.user.findUnique({
						where: {
							email,
						},
					});

					if (!user) return done(null, false, { message: 'Incorrect email' });
					const isPasswordMatched = await comparePassword(
						password,
						user.password
					);

					if (isPasswordMatched) {
						///User is Authenticated
						// console.log('Auth Parsed User-->', user);
						console.log(
							'Fetch User data in Local stratigy FNS',
							email,
							password
						);
						return done(null, user);
					} else {
						return done(null, false, { message: 'Incorrect Password' });
					}
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		const prismaUser = user as User; // Explicitly casting user to User type
		if (prismaUser) {
			console.log('isAuthenticated User in Serialized User', prismaUser);
			return done(null, prismaUser.id);
		}
		return done(null, false);
	});
	passport.deserializeUser(async (id: string, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { id } });
			done(null, user || false);
		} catch (error) {
			done(error);
		}
	});
};
export const localAuthMiddleware = passport.authenticate('local', {
	failureRedirect: '/login',
	failureMessage: true,
});

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
