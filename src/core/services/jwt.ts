import jwt from "jsonwebtoken";

import type { TAuthError } from "@features/auth";

import { HTTPException } from "@core/states";
import { HttpStatus } from "@core/enum";

import env from "@utils/env";

const DEFAULT_SIGN_OPTION: jwt.SignOptions = {
  expiresIn: 7 * 24 * 60 * 60, // 7 days
};

export function signJwtAccessToken(
  payload: jwt.JwtPayload,
  options: jwt.SignOptions = DEFAULT_SIGN_OPTION,
) {
  const secretKey = env.AUTH_SECRET;

  const data = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    nomorTelephone: payload.nomorTelephone,
    role: payload.role,
    image: payload.image,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  };
  const token = jwt.sign(data, secretKey ?? "", options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secretKey = env.AUTH_SECRET;
    const decoded = jwt.verify(token, secretKey ?? "");
    return decoded as jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new HTTPException<TAuthError>(HttpStatus.UNAUTHORIZED, {
        errors: { token: ["Token expire"] },
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      const { message } = error;
      throw new HTTPException<TAuthError>(HttpStatus.UNAUTHORIZED, {
        errors: { token: [message] },
      });
    }

    return null;
  }
}
