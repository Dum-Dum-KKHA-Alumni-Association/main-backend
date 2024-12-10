import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//   if (params.model === "User") {
//     if (params.action === "create" || params.action === "update") {
//       const data = params.args.data;

//       if (data.password) {
//         // Hash the password if provided
//         const saltRounds = 10;
//         data.password = await passwordHashed(data.password);
//       }
//     }
//   }

//   return next(params);
// });

// let prisma: PrismaClient;

// declare global {
//   // Ensure the global object has a PrismaClient instance in development
//   // This prevents `global` type errors in TypeScript
//   var prisma: PrismaClient | undefined;
// }

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;

// Prevent multiple Prisma client instances
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'error', 'warn']
				: ['error'],
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
