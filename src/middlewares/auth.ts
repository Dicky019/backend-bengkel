import type { $Enums } from "@prisma/client";
import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";

import { verifyJwt } from "~/services/jwt";
import type { TVariables } from "~/types";
import { HttpStatus } from "~/utils/http-utils";
// import { logger } from "~/utils/logger";

const authCheck = (c: Context) => {
  const authorization = c.req.header("authorization");

  //   logger.info("here: " + authorization);

  if (!authorization) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "Anda Belum Login",
    });
  }

  const token = authorization.split(" ")[1];

  const jwtDecode = verifyJwt(token);

  if (!jwtDecode) {
    throw new HTTPException(HttpStatus.CONFLICT, {
      message: "User ini tidak ada",
    });
  }

  return jwtDecode;
};

export const authMiddleware: MiddlewareHandler<{
  Variables: TVariables;
}> = async (c, next) => {
  const jwt = authCheck(c);
  c.set("userData", jwt);

  return await next();
};

export const authAdminMiddleware = async (
  role: $Enums.Role,
  c: Context<{ Variables: TVariables }>,
  next: Next
) => {
  if (c.var.userData.role !== role) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "Anda Tidak Di Ijinkan",
    });
  }

  return await next();
};
