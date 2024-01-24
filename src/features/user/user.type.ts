import { User } from "@prisma/client";
import { z } from "zod";

import { Prisma } from "@core/db";
import { idSchema } from "@core/schemas";

import { createUserSchema, updateUserSchema } from "@features/user";

/**
 * Type alias for Prisma.UserWhereUniqueInput.
 * Used for querying a single user record by a unique identifier.
 */
export type TWhereUniqueUser = Prisma.UserWhereUniqueInput;

/**
 * Type for UserFindManyArgs from Prisma Client.
 * Allows passing undefined to find all users.
 */

export type TFindManyUser = Prisma.UserFindManyArgs | undefined;

/**
 * Defines the TUserCreateInput type by omitting the "id" field from
 * Prisma.UserCreateInput, since the id should be auto-generated rather
 * than set during user creation.
 */

export type TCreateUserProps = z.infer<typeof createUserSchema>;

/**
 * Defines the shape of the TUserUpdateInput type, which is the
 * type for the input to update a User record in the database.
 *
 * It extends Prisma.UserUpdateInput to omit the "id" field since
 * that should not be updated, and adds back an "id" field marked
 * as required.
 */

export type TUpdateUserProps = z.infer<
  typeof idSchema & typeof updateUserSchema
>;

/**
 * Omits the `password` property from the `User` type.
 * This creates a type that represents a `User` without the sensitive `password` field.
 */

export type TUser = Omit<User, "password">;

export type TUserError = {
  user?: string[];
  email?: string[];
  password?: string[];
  nomorTelephone?: string[];
};

export type TValidationUser = {
  id?: string;
  email: string;
  nomorTelephone: string;
  name: string;
};
