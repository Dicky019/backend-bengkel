import { userService, userRepo } from "@features/user";

import { signJwtAccessToken } from "@core/services";
import { HttpStatus } from "@core/enum";
import HTTPException from "@core/states/error";

import type {
  TAuthError,
  TCurentUserProps,
  TLoginProps,
  TSigninProps,
} from "@features/auth/auth.type";
import { JwtPayload } from "jsonwebtoken";
import { google } from "googleapis";
import env from "@utils/env";

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

  await userService.validateUser(userWithoutPassword);

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
  const user = await userService.getUser({ email, id });

  return user;
};

export const refreshTokenUser = async (token: JwtPayload) => {
  const newToken = signJwtAccessToken(token);

  return newToken;
};

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/callback/google",
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

export const googleAuth = () => authorizationUrl;

export const googleCallback = async (
  code: string,
  role: "pengendara" | "motir",
) => {
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data.email || !data.name || !data.picture) {
    throw new HTTPException<TAuthError>(HttpStatus.CONFLICT, {
      errors: {
        auth: ["Ada Yang salah"],
      },
    });
  }

  let user = await userRepo.getUserByUniq({ email: data.email });

  if (!user) {
    user = await userService.createUser({
      email: data.email,
      name: data.name,
      nomorTelephone: "-",
      role,
      image: data.picture,
    });
  }

  const token = signJwtAccessToken(user);

  return { token, user };
};
