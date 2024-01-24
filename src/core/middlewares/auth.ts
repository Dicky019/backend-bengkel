import { Next, type Context } from "hono";

import { TAuthError } from "@features/auth/auth.type";
import { TUserError } from "@features/user/user.type";

import { verifyJwt } from "@core/services/jwt";
import HTTPException from "@core/states/error";
import type {
  TAuthMiddleware,
  TVariablesUsingAuthMiddelware,
} from "@core/types";
import { HttpStatus } from "@core/enum";

const authCheck = (c: Context<TVariablesUsingAuthMiddelware>) => {
  const authorization = c.req.header("authorization");

  //   logger.info("here: " + authorization);

  if (!authorization) {
    throw new HTTPException<TAuthError>(HttpStatus.UNAUTHORIZED, {
      errors: {
        auth: ["Anda Belum Login"],
      },
    });
  }

  const token = authorization.split(" ")[1];

  const userData = verifyJwt(token);

  if (!userData) {
    throw new HTTPException<TUserError>(HttpStatus.CONFLICT, {
      // message: "User ini tidak ada",
      errors: {
        user: ["User ini tidak ada"],
      },
    });
  }

  c.set("userData", userData);
};

const authMiddleware = async (
  c: Context<TVariablesUsingAuthMiddelware>,
  next: Next,
  allowedRoles: TAuthMiddleware = ["admin", "motir", "pengendara"],
) => {
  authCheck(c);

  const { role } = c.var.userData;
  const isIncluded: boolean = allowedRoles.includes(role);
  if (!isIncluded) {
    throw new HTTPException<TAuthError>(HttpStatus.FORBIDDEN, {
      errors: { auth: ["Anda Tidak Di Ijinkan"] },
    });
  }

  return next();
};

export default authMiddleware;
