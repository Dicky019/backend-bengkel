import * as userRepo from "@features/user/user.repository";
import { validateUser, getUser } from "@features/user/user.service";

import { signJwtAccessToken } from "@core/services";
import { HttpStatus } from "@core/enum";
import HTTPException from "@core/states/error";

import {
  TAuthError,
  TCurentUserProps,
  TLoginProps,
  TSigninProps,
} from "./auth.type";

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

  await validateUser(userWithoutPassword);

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
    throw new HTTPException<TAuthError>(HttpStatus.NOT_FOUND, {
      errors: {
        email: ["Email tidak ada"],
      },
    });
  }

  if (!user.password) {
    throw new HTTPException<TAuthError>(HttpStatus.CONFLICT, {
      // message: "Password anda belum diset",
      errors: {
        password: ["Password anda belum diset"],
      },
    });
  }

  const { password, ...userWithoutPassword } = user;

  const isPasswordValid = await Bun.password.verify(
    loginProps.password,
    password,
  );

  if (!isPasswordValid) {
    throw new HTTPException<TAuthError>(HttpStatus.BAD_REQUEST, {
      // message: "Password anda salah",
      errors: {
        password: ["Password anda salah"],
      },
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
export const currentUser = async ({ email, id }: TCurentUserProps) => {
  const user = await getUser({ email, id });

  return user;
};
