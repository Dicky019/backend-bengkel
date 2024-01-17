import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { logger } from "~/utils/logger";
import { userfaker } from "~/features/user/user.faker";

const userFaker = (l: number) =>
  Array.from(Array(l).keys()).map(() => {
    return userfaker();
  });

const main = async () => {
  const users = userFaker(1);
  const usersCount = await prisma.user.createMany({
    data: users,
  });

  logger.debug({ users, usersCount });
};

await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
