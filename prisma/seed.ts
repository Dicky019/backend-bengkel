import { $Enums, PrismaClient } from "@prisma/client";
import signinFaker from "@/faker/auth.faker";
import userFaker from "@/faker/user.faker";
import logger from "@/utils/logger";

const prisma = new PrismaClient();

const usersFaker = (l: number) =>
  Array.from(Array(l).keys()).map(() => userFaker());

const accountsFaker = async (l: number, role: $Enums.Role) => {
  const accounts = await Promise.all(
    Array.from(Array(l).keys()).map(() => signinFaker({ role })),
  );
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accounts: accounts.map(({ realPassword, ...account }) => account),
    accountsPassword: accounts.map(({ realPassword, email }) => ({
      password: realPassword,
      email,
    })),
  };
};

const main = async () => {
  const users = usersFaker(1);
  const usersCount = await prisma.user.createMany({
    data: users,
  });
  // signins
  const { accounts, accountsPassword } = await accountsFaker(1, "motir");
  const accountsCount = await prisma.user.createMany({
    data: accounts,
  });

  logger.debug({ users, usersCount });
  logger.debug({ accountsPassword, accountsCount });
};

await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
