import { faker } from "@faker-js/faker";
import { TUpdateUser } from "./user.type";

export const userfaker = (
  user: Omit<TUpdateUser, "id"> | undefined = undefined
) => {
  const numberPhone = faker.helpers.fromRegExp(
    "+62 [0-9]{3}-[0-9]{3}-[0-9]{4}"
  ); // +62 813-444-5555,

  const role = faker.helpers.enumValue({
    pengendara: "pengendara",
    motir: "motir",
  } as const);

  return {
    email: user?.email ?? faker.internet.email(),
    name: user?.name ?? faker.person.fullName(),
    nomorTelephone: user?.nomorTelephone ?? numberPhone,
    role: user?.role ?? role,
  } as const;
};
