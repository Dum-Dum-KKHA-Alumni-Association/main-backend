import { comparePassword } from '../utils/hasher';
import prisma from '../db/prismaClient';
import passport from 'passport';

import passportLocal from 'passport-local';
const localStrategy = passportLocal.Strategy;

export const passportLocalStrategy = () =>
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

					// const isPasswordMatch = user.password === password ? true : false;

					if (isPasswordMatched) {
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

export const localAuthMiddleware = passport.authenticate('local', {
	session: false,
	failureRedirect: '/login',
});
