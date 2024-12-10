import { WithAuthProp } from '@clerk/express';
import { Request } from 'express';

interface ClerkUser {
	userId: string;
	// Add other Clerk user properties if needed
}

interface AuthenticatedRequest extends Request {
	auth?: WithAuthProp<ClerkUser>;
}
