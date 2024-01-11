import * as userRepo from "~/features/user/user.repository";
import { TUserUpdateInput, TUserWhereUniqueInput } from "./user.type";
import { IQueryPage } from "~/types";
import { pagination } from "~/utils/pagination";

/**
 * Gets users based on optional find arguments.
 * Delegates to userRepo.getUsers.
 */
export const getUsers = async ({ page, perPage }: IQueryPage) => {
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
    throw Error("User ini tidak ada");
  }
  return user;
};

/**
 * Updates a user's information in the database.
 *
 * Gets the existing user by ID first to validate it exists.
 * Then delegates to the userRepo to perform the update in the database.
 */
export const updateUser = async (updateUserProps: TUserUpdateInput) => {
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
