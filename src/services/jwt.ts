import jwt, { type JwtPayload, VerifyOptions, SignOptions } from "jsonwebtoken";
import { env } from "~/utils/env";

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: 3 * 24 * 60 * 60, // 12 days
};

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
    email: string;
  }
}

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTION
) {
  const secret_key = env.AUTH_SECRET;
  const token = jwt.sign(payload, secret_key ?? "", options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret_key = env.AUTH_SECRET;
    const decoded = jwt.verify(token, secret_key ?? "");
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
