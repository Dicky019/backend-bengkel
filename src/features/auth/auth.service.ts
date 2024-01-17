import { HTTPException } from "hono/http-exception";
import * as userRepo from "~/features/user/user.repository";
import { TLoginProps, TSigninProps } from "./auth.type";
import { signJwtAccessToken } from "~/services/jwt";
import { TUser } from "../user/user.type";
import HttpStatus from "~/utils/http-utils";
import { validateCreateUser } from "../user/user.service";

/**
 * Signs in a user.
 *
 * This takes a user sign up object, checks if the email or phone number
 * already exists, hashes the password, and creates a new user record.
 *
 * Throws errors if email or phone number already exists.
 */
export const signin = async (signinProps: TSigninProps) => {
  const { password, ...userWithoutPassword } = signinProps;

  await validateCreateUser(userWithoutPassword);

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  return userRepo.createUser({
    password: hashedPassword,
    ...userWithoutPassword,
  });
};

/**
 * Logs in a user.
 *
 * This takes a user login object, finds the user record by email,
 * verifies the provided password, generates a JWT access token if valid,
 * and returns the user object without the password and the new JWT token.
 *
 * Throws errors if user not found or invalid password.
 */
export const login = async (loginProps: TLoginProps) => {
  const user = await userRepo.getUserByUniq({
    email: loginProps.email,
  });

  if (!user) {
    throw new HTTPException(HttpStatus.NOT_FOUND, {
      message: "Email anda salah",
    });
  }

  if (!user.password) {
    throw new HTTPException(HttpStatus.CONFLICT, {
      message: "Password anda belum diset",
    });
  }

  const { password, ...userWithoutPassword } = user;

  const isPasswordValid = await Bun.password.verify(
    loginProps.password,
    password,
  );

  if (!isPasswordValid) {
    throw new HTTPException(HttpStatus.BAD_REQUEST, {
      message: "Password anda salah",
    });
  }

  const token = signJwtAccessToken(userWithoutPassword);

  return { userWithoutPassword, token };
};

/**
 * Gets the current authenticated user from a JWT token.
 *
 * Takes a JWT token, verifies it, and returns the payload
 * as the current user if valid.
 *
 * Throws errors if no token provided or invalid token.
 */
export const currentUser = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}) => {
  const user = await userRepo.getUserByUniq({ id, email });

  if (!user) {
    throw new HTTPException(HttpStatus.NOT_FOUND, {
      message: "User ini tidak ada",
    });
  }

  return user as TUser;
};
