import { prisma } from "~/db";
import type {
  TUserWhereUniqueInput,
  TUserFindManyArgs,
  TUserCreateInput,
  TUserUpdateInput,
} from "./user.type";

const selectUserWithoutPass = {
  id: true,
  email: true,
  name: true,
  nomorTelephone: true,
  role: true,
};

/**
 * Retrieves a list of users from the database, filtering and selecting fields based on the provided arguments.
 *
 * @param userFindManyArgs - Optional filtering and selection criteria to apply to the query.
 */
export const getUsers = (userFindManyArgs: TUserFindManyArgs = undefined) => {
  const users = prisma.user.findMany({
    select: selectUserWithoutPass,
    ...userFindManyArgs,
  });

  return users;
};

export const getUsersCount = () => {
  const usersCount = prisma.user.count();

  return usersCount;
};

/**
 * Retrieves a single user from the database based on the provided unique identifier.
 *
 * @param where - The unique identifier to search for the user by.
 */
export const getUserByUniq = (where: TUserWhereUniqueInput) => {
  const user = prisma.user.findUnique({
    where: where,
  });

  return user;
};

/**
 * Creates a new user record in the database.
 *
 * @param data - The user data to insert into the database.
 */
export const createUser = (data: TUserCreateInput) => {
  const user = prisma.user.create({
    data,
  });

  return user;
};

/**
 * Updates an existing user record in the database.
 *
 * @param data - The updated user data. Must include the user's id to identify the record to update.
 */
export const updateUser = (data: TUserUpdateInput) => {
  const user = prisma.user.update({
    data,
    where: { id: data.id },
  });

  return user;
};

/**
 * Deletes a user record from the database.
 *
 * @param where - The unique identifier of the user record to delete.
 */
export const deleteUser = (where: TUserWhereUniqueInput) => {
  const user = prisma.user.delete({
    where,
  });

  return user;
};
