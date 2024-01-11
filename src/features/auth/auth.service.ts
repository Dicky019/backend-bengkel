import * as userRepo from "~/features/user/user.repository";
import { ILoginProps, ISigninProps } from "./auth.type";
import { signJwtAccessToken, verifyJwt } from "~/services/jwt";
import { IUser } from "../user/user.type";

/**
 * Signs in a user.
 *
 * This takes a user sign up object, checks if the email or phone number
 * already exists, hashes the password, and creates a new user record.
 *
 * Throws errors if email or phone number already exists.
 */
export const signin = async (signinProps: ISigninProps) => {
  const { password, ...userWithoutPassword } = signinProps;

  const checkEmail = await userRepo.getUserByUniq({
    email: userWithoutPassword.email,
  });

  const checkNoTelephone = await userRepo.getUserByUniq({
    nomorTelephone: userWithoutPassword.nomorTelephone,
  });

  if (checkEmail && checkNoTelephone) {
    throw Error("Email dan No.telephone sudah ada");
  }

  if (checkEmail) {
    throw Error("Email sudah ada");
  }

  if (checkNoTelephone) {
    throw Error("No.telephone sudah ada");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  return userRepo.createUser({
    ...userWithoutPassword,
    password: hashedPassword,
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
export const login = async (loginProps: ILoginProps) => {
  const user = await userRepo.getUserByUniq({
    email: loginProps.email,
  });

  if (!user) {
    throw Error("Email anda salah");
  }

  const { password, ...userWithoutPassword } = user;

  const isPasswordValid = await bcrypt.compare(loginProps.password, password);

  if (!isPasswordValid) {
    throw Error("Password anda salah");
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
export const currentUser = (token: string | undefined) => {
  if (!token) {
    throw Error("Anda belum login");
  }
  const user = verifyJwt(token);
  if (!user) {
    throw Error("Ada yang salah");
  }
  return user as IUser;
};
