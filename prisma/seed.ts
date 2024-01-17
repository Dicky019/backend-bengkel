import { PrismaClient } from "@prisma/client";
import { logger } from "~/utils/logger";
import { userfaker } from "~/features/user/user.faker";

const prisma = new PrismaClient();

const userFaker = (l: number) =>
  Array.from(Array(l).keys()).map(() => userfaker());

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
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
