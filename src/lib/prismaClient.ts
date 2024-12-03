import { PrismaClient } from "@prisma/client";
import { passwordHashed } from "../utils/hasher";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "User") {
    if (params.action === "create" || params.action === "update") {
      const data = params.args.data;

      if (data.password) {
        // Hash the password if provided
        const saltRounds = 10;
        data.password = await passwordHashed(data.password);
      }
    }
  }

  return next(params);
});

export default prisma;
