// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import { $Enums } from "@prisma/client";

const signinFaker = async (
  signin:
    | {
        email?: string;
        name?: string;
        nomorTelephone?: string;
        password?: string;
        role?: $Enums.Role;
      }
    | undefined = undefined,
) => {
  const numberPhone = faker.helpers.fromRegExp(
    "+62 [0-9]{3}-[0-9]{3}-[0-9]{4}",
  ); // +62 813-444-5555,

  const role = faker.helpers.enumValue({
    pengendara: "pengendara",
    motir: "motir",
  } as const);

  const numberPhoneArray = numberPhone.split("-");
  const password = `password${numberPhoneArray[numberPhoneArray.length - 1]}`;

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  return {
    email: signin?.email ?? faker.internet.email(),
    name: signin?.name ?? faker.person.fullName(),
    nomorTelephone: signin?.nomorTelephone ?? numberPhone,
    password: signin?.password ?? hashedPassword,
    role: signin?.role ?? role,
    realPassword: password,
  } as const;
};

export default signinFaker;

// export const loginfaker = (login: TFakerLoginProps | undefined = undefined) => {
//   const password = faker.internet.password({ length: 8 });
//   const email = faker.internet.email();

//   return {
//     email: login?.email ?? email,
//     password: login?.password ?? password,
//   } as const;
// };
