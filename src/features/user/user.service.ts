import * as userRepo from "~/features/user/user.repository";
import {
  TCreateUser,
  TUpdateUser,
  TUserCreateInput,
  TUserUpdateInput,
  TUserWhereUniqueInput,
} from "./user.type";
import { TQueryPage } from "~/types";
import { pagination } from "~/utils/pagination";
import { HTTPException } from "hono/http-exception";
import { HttpStatus } from "~/utils/http-utils";

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
export const getUser = async (where: TUserWhereUniqueInput) => {
  const user = await userRepo.getUserByUniq(where);
  if (!user) {
    // throw Error("User ini tidak ada");
    throw new HTTPException(HttpStatus.NOT_FOUND, {
      message: "User ini tidak ada",
    });
  }
  return user;
};

export const validateCreateUser = async (create: TCreateUser) => {
  const [checkEmail, checkNoTelephone] = await Promise.all([
    userRepo.getUserByUniq({
      email: create.email,
    }),
    userRepo.getUserByUniq({
      nomorTelephone: create.nomorTelephone,
    }),
  ]);

  if (checkEmail && checkNoTelephone) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Email dan No.telephone sudah ada",
    });
  }

  if (checkEmail) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Email sudah ada",
    });
  }

  if (checkNoTelephone) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "No.telephone sudah ada",
    });
  }
};

export const createUser = async (create: TCreateUser) => {
  await validateCreateUser(create);
  return userRepo.createUser(create);
};

/**
 * Updates a user's information in the database.
 *
 * Gets the existing user by ID first to validate it exists.
 * Then delegates to the userRepo to perform the update in the database.
 */
export const updateUser = async (updateUserProps: TUpdateUser) => {
  await getUser({ id: updateUserProps.id });
  return userRepo.updateUser(updateUserProps);
};

/**
 * Deletes a user from the database.
 *
 * Gets the user to delete first to validate it exists.
 * Then delegates to the userRepo to perform the deletion.
 */
export const deleteUser = async (deleteUsersProps: TUserWhereUniqueInput) => {
  await getUser({ id: deleteUsersProps.id });
  return userRepo.deleteUser(deleteUsersProps);
};
