import { $Enums } from "@prisma/client";
import jwt from "jsonwebtoken";
import env from "~/utils/env";
import logger from "~/utils/logger";

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
  options: jwt.SignOptions = DEFAULT_SIGN_OPTION,
) {
  const secretKey = env.AUTH_SECRET;
  const token = jwt.sign(payload, secretKey ?? "", options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secretKey = env.AUTH_SECRET;
    const decoded = jwt.verify(token, secretKey ?? "");
    return decoded as jwt.JwtPayload;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
