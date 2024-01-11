import { User } from "@prisma/client";
import { Prisma } from "~/db";

/**
 * Type alias for Prisma.UserWhereUniqueInput.
 * Used for querying a single user record by a unique identifier.
 */
export type TUserWhereUniqueInput = Prisma.UserWhereUniqueInput;

/**
 * Type for UserFindManyArgs from Prisma Client.
 * Allows passing undefined to find all users.
 */

export type TUserFindManyArgs = Prisma.UserFindManyArgs | undefined;

/**
 * Defines the TUserCreateInput type by omitting the "id" field from
 * Prisma.UserCreateInput, since the id should be auto-generated rather
 * than set during user creation.
 */
export type TUserCreateInput = Omit<Prisma.UserCreateInput, "id">;

/**
 * Defines the shape of the TUserUpdateInput type, which is the
 * type for the input to update a User record in the database.
 *
 * It extends Prisma.UserUpdateInput to omit the "id" field since
 * that should not be updated, and adds back an "id" field marked
 * as required.
 */
export type TUserUpdateInput = Omit<Prisma.UserUpdateInput, "id"> & {
  id: string;
};

/**
 * Omits the `password` property from the `User` type.
 * This creates a type that represents a `User` without the sensitive `password` field.
 */
export type IUser = Omit<User, "password">;
