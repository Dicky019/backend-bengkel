import { $Enums } from "@prisma/client";
import jwt from "jsonwebtoken";
import { env } from "~/utils/env";

const DEFAULT_SIGN_OPTION: jwt.SignOptions = {
  expiresIn: 3 * 24 * 60 * 60, // 12 days
};

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: string;
    name: string;
    email: string;
    image: string | null;
    nomorTelephone: string;
    role: $Enums.Role;
  }
}

export function signJwtAccessToken(
  payload: jwt.JwtPayload,
  options: jwt.SignOptions = DEFAULT_SIGN_OPTION
) {
  const secret_key = env.AUTH_SECRET;
  const token = jwt.sign(payload, secret_key ?? "", options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret_key = env.AUTH_SECRET;
    const decoded = jwt.verify(token, secret_key ?? "");
    return decoded as jwt.JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
