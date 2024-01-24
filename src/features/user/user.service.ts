// import { HTTPException } from "hono/http-exception";
import { TQueryPage } from "@core/types";
import { HttpStatus } from "@core/enum";
import HTTPException from "@core/states/error";

import pagination from "@utils/pagination";

import type {
  TCreateUserProps,
  TUpdateUserProps,
  TUserError,
  TValidationUser,
  TWhereUniqueUser,
} from "@features/user";

import { userRepo } from "@features/user";

/**
 * Gets users based on optional find arguments.
 * Delegates to userRepo.getUsers.
 */
export const getUsers = async ({ page, perPage }: TQueryPage) => {
  const usersPagination = await pagination({
    page,
    perPage,
    getData: userRepo.getUsers,
    getDataCount: userRepo.getUsersCount,
  });

  return usersPagination;
};

/**
 * Gets a user by their unique identifier.
 *
 * Delegates to userRepo to fetch user from database.
 *
 * Throws error if no user found.
 */
export const getUser = async (where: TWhereUniqueUser) => {
  const user = await userRepo.getUserByUniq(where);
  if (!user) {
    // throw Error("User ini tidak ada");
    throw new HTTPException<TUserError>(HttpStatus.NOT_FOUND, {
      errors: { user: ["User ini tidak ada"] },
    });
  }
  return user;
};

export const validateUser = async (user: TValidationUser) => {
  const [getUserByEmail, getUserByNoTelephone] = await Promise.all([
    userRepo.getUserByUniq({
      email: user.email,
    }),
    userRepo.getUserByUniq({
      nomorTelephone: user.nomorTelephone,
    }),
  ]);

  const isUpdatedUser = user.id !== undefined;
  const isElseUser =
    user.id === getUserByEmail?.id && user.id === getUserByNoTelephone?.id;

  if (isUpdatedUser && isElseUser) {
    return;
  }

  const isEmailAndNoTelephoneEmpty = !getUserByEmail && !getUserByNoTelephone;

  if (isEmailAndNoTelephoneEmpty) {
    return;
  }

  const errors: TUserError = {};

  if (getUserByEmail) {
    errors.email = ["Email sudah ada"];
  }

  if (getUserByNoTelephone) {
    errors.nomorTelephone = ["No.telephone sudah ada"];
  }

  throw new HTTPException<TUserError>(HttpStatus.BAD_REQUEST, {
    errors,
  });
};

export const createUser = async (create: TCreateUserProps) => {
  await validateUser(create);
  return userRepo.createUser(create);
};

/**
 * Updates a user's information in the database.
 *
 * Gets the existing user by ID first to validate it exists.
 * Then delegates to the userRepo to perform the update in the database.
 */
export const updateUser = async (updateUserProps: TUpdateUserProps) => {
  const user = await getUser({
    id: updateUserProps.id,
  });
  await validateUser(user);
  return userRepo.updateUser(updateUserProps);
};

/**
 * Deletes a user from the database.
 *
 * Gets the user to delete first to validate it exists.
 * Then delegates to the userRepo to perform the deletion.
 */
export const deleteUser = async (deleteUsersProps: TWhereUniqueUser) => {
  await getUser({ id: deleteUsersProps.id });
  return userRepo.deleteUser(deleteUsersProps);
};
