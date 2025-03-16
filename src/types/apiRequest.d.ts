import { WithAuthProp } from '@clerk/express';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
	auth?: WithAuthProp<ClerkUser>;
}

interface PassportUser {
	id: string;
	username: string;
	email: string;
	role: string;
}

// declare global {
// 	namespace Express {
// 		type User = PassportUser // Extending Express.User with Prisma User type
// 	}
// }
