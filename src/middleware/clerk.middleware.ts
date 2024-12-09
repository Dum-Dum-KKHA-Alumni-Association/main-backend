import { requireAuth } from "@clerk/express";

const authMiddleware = requireAuth({ signInUrl: "/sign-in" });


export default authMiddleware;
