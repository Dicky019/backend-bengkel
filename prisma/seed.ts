import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import { logger } from "~/utils/logger";

const fakerUsers = (l: number) =>
  Promise.all(
    Array.from(Array(l).keys()).map(async () => {
      const numberPhone = faker.helpers.fromRegExp(
        "+62 [0-9]{3}-[0-9]{3}-[0-9]{4}"
      ); // +62 813-444-5555,

      const numberPhoneArray = numberPhone.split("-");
      const password =
        "password" + numberPhoneArray[numberPhoneArray.length - 1];

      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const role = faker.helpers.enumValue(Role);
      return {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        nomorTelephone: numberPhone,
        role: "admin",
        password: hashedPassword,
      } as const;
    })
  );

const main = async () => {
  const users = await fakerUsers(1).then((users) => {
    return prisma.user.createMany({
      data: users,
    });
  });
  logger.debug(users);
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
