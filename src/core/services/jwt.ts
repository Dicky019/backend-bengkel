import jwt from "jsonwebtoken";
import { TAuthError } from "@features/auth/auth.type";

import { HTTPException } from "@core/states";
import { HttpStatus } from "@core/enum";

import env from "@utils/env";

const DEFAULT_SIGN_OPTION: jwt.SignOptions = {
  expiresIn: 3 * 24 * 60 * 60, // 12 days
};

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
