import { User, Role } from "@prisma/client";
import { Prisma } from "~/db";

export type TUserWhereUniqueInput = Prisma.UserWhereUniqueInput;

export type TUserFindManyArgs = Prisma.UserFindManyArgs | undefined;

export type TUserCreateInput = Omit<Prisma.UserCreateInput, "id">;

export type TUserUpdateInput = Omit<Prisma.UserUpdateInput, "id"> & {
  id: string;
};

export type IUser = User;

export type IUserRole = Role;


